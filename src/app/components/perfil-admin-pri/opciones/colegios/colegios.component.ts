import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ColegiosService, Colegio, CreateColegioDto, UpdateColegioDto } from '../../../../services/colegios.service';
import { DocentesService, Docente } from '../../../../services/docentes.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-colegios',
  templateUrl: './colegios.component.html',
  styleUrls: ['./colegios.component.css']
})
export class ColegiosComponent implements OnInit, OnDestroy {
  // Servicio de docentes
  private docentesService = inject(DocentesService);
  // ✅ PROPIEDADES ESENCIALES
  colegios: Colegio[] = [];
  filteredColegios: Colegio[] = [];
  paginatedColegios: Colegio[] = [];

  // ✅ CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  isEditing = false;
  editingColegioId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  // ✅ FORMULARIO REACTIVO
  colegioForm!: FormGroup;

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // ✅ TRACKBY FUNCTION FOR PERFORMANCE
  trackByColegioId(index: number, colegio: Colegio): number {
    return colegio.id_colegio || index;
  }

  // ✅ FECHA EN ESPAÑOL PARA EL TEMPLATE
  get todayES(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // ✅ CONFIGURACIÓN DE OPCIONES
  readonly nivelesEducativos = [
    { value: 'Inicial', label: 'Inicial' },
    { value: 'Primaria', label: 'Primaria' },
    { value: 'Secundaria', label: 'Secundaria' }
  ];

  readonly turnos = [
    { value: 'Mañana', label: 'Mañana' },
    { value: 'Tarde', label: 'Tarde' },
    { value: 'Noche', label: 'Noche' }
  ];

  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  private ubigeoService = inject(UbigeoService);

  // ✅ INYECCIÓN DE DEPENDENCIAS CON INJECT()
  private colegiosService = inject(ColegiosService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarColegios();
    this.testEndpointConnection();
  }
  cargarDepartamentos(): void {
    this.ubigeoService.getDepartamentos().subscribe(deps => {
      this.departamentos = deps;
      this.filtroDepartamento = '';
      this.provincias = [];
      this.distritos = [];
      this.filtroProvincia = '';
      this.filtroDistrito = '';
    });
  }

  onDepartamentoChange(): void {
    const dep = this.departamentos.find(d => d.departamento === this.filtroDepartamento);
    if (dep) {
      const idDep = dep.id_ubigeo.substring(0, 2);
      this.ubigeoService.getProvincias(idDep).subscribe(provs => {
        this.provincias = provs;
        this.filtroProvincia = '';
        this.distritos = [];
        this.filtroDistrito = '';
      });
    } else {
      this.provincias = [];
      this.distritos = [];
      this.filtroProvincia = '';
      this.filtroDistrito = '';
    }
    this.filterColegios();
  }

  onProvinciaChange(): void {
    const prov = this.provincias.find(p => p.provincia === this.filtroProvincia);
    if (prov) {
      const idProv = prov.id_ubigeo.substring(0, 4);
      this.ubigeoService.getDistritos(idProv).subscribe(dists => {
        this.distritos = dists;
        this.filtroDistrito = '';
      });
    } else {
      this.distritos = [];
      this.filtroDistrito = '';
    }
    this.filterColegios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.colegioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigoModular: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      website: [''],
      director: [''],
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      nivelesEducativos: [[], [Validators.required]],
      turnos: [[], [Validators.required]],
      aforoMaximo: ['', [Validators.required, Validators.min(1)]],
      fechaFundacion: ['', [Validators.required]],
      estado: [true, [Validators.required]]
    }, {
      validators: this.codigoModularValidator.bind(this)
    });
  }

  // ✅ VALIDADOR PERSONALIZADO PARA CÓDIGO MODULAR
  private codigoModularValidator(control: AbstractControl) {
    const codigoModular = control.get('codigoModular')?.value;

    if (!codigoModular) {
      return null;
    }

    // Validar que sea exactamente 7 dígitos
    if (!/^\d{7}$/.test(codigoModular)) {
      return { codigoModularInvalid: true };
    }

    return null;
  }

  // ✅ CARGA DE COLEGIOS
  cargarColegios(): void {
    console.log('🔄 Iniciando carga de colegios...');
    console.log('🔗 Endpoint configurado:', 'http://localhost:3000/colegios');
    console.log('🔧 Interceptors que se ejecutarán automáticamente:');
    console.log('   1. 🔑 AuthInterceptor → Agrega token JWT');
    console.log('   2. 📝 LoggingInterceptor → Registra request');
    console.log('   3. ⏳ LoadingInterceptor → Muestra spinner');
    console.log('   4. 🚨 ErrorInterceptor → Maneja errores (si ocurren)');

    this.loading = true;

    console.log('📡 Llamando this.colegiosService.getColegios()...');
    this.colegiosService.getColegios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ INTERCEPTORS COMPLETADOS - Datos recibidos del endpoint:');
          console.log('📊 Cantidad de colegios:', data.length);
          console.log('🔍 Datos completos recibidos:', data);

          this.colegios = data;
          this.filteredColegios = [...data];
          this.updatePaginatedColegios();
          this.loading = false;

          if (data.length === 0) {
            console.warn('⚠️ No se encontraron colegios en la base de datos');
            console.log('� Asegúrate de que el backend esté activo y tenga datos');
            this.showEmptyState();
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ ERROR AL CONECTAR CON EL ENDPOINT:', error);
          console.error('🔍 Detalles del error:', {
            status: error.status,
            message: error.message,
            url: error.url
          });

          // Mostrar error específico
          this.handleError(`Error al cargar colegios: ${error.message}`);
          this.showEmptyState();
        }
      });
  }

  // ✅ FILTRADO DE COLEGIOS
  filterColegios(): void {
    if (!this.searchTerm.trim()) {
      this.filteredColegios = [...this.colegios];
    } else {
      this.filteredColegios = this.colegios.filter(colegio =>
        colegio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        colegio.codigoModular.includes(this.searchTerm) ||
        colegio.direccion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedColegios();
  }

  // ✅ ACTUALIZACIÓN DE PAGINACIÓN
  updatePaginatedColegios(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedColegios = this.filteredColegios.slice(startIndex, endIndex);
  }

  // ✅ CAMBIO DE PÁGINA
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedColegios();
  }

  // ✅ CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado'): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // ✅ CREAR NUEVO COLEGIO
  createColegio(): void {
    this.activeTab = 'nuevo';
    this.isEditing = false;
    this.editingColegioId = undefined;
    this.colegioForm.reset();
    this.colegioForm.patchValue({
      estado: true,
      nivelesEducativos: [],
      turnos: []
    });
  }

  // ✅ GUARDAR COLEGIO
  saveColegio(): void {
    if (this.colegioForm.invalid) {
      this.markFormGroupTouched();
      this.handleError('Por favor corrige los errores en el formulario');
      return;
    }

    this.loading = true;
    const formData = this.colegioForm.value;

    if (this.isEditing && this.editingColegioId) {
      // Actualizar colegio existente
      const updateData: UpdateColegioDto = {
        id_colegio: this.editingColegioId,
        ...formData
      };

      this.colegiosService.actualizarColegio(this.editingColegioId, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Colegio actualizado exitosamente');
            this.cargarColegios();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al actualizar el colegio');
            console.error('Error:', error);
          }
        });
    } else {
      // Crear nuevo colegio
      const createData: CreateColegioDto = formData;

      this.colegiosService.crearColegio(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Colegio creado exitosamente');
            this.cargarColegios();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al crear el colegio');
            console.error('Error:', error);
          }
        });
    }
  }

  // ✅ EDITAR COLEGIO
  editColegio(id_colegio: number): void {
    const colegio = this.colegios.find(c => c.id_colegio === id_colegio);
    if (!colegio) {
      this.handleError('Colegio no encontrado');
      return;
    }

    this.isEditing = true;
    this.editingColegioId = id_colegio;
    this.activeTab = 'nuevo';

    this.colegioForm.patchValue({
      nombre: colegio.nombre,
      codigoModular: colegio.codigoModular,
      direccion: colegio.direccion,
      telefono: colegio.telefono,
      correo: colegio.correo,
      website: colegio.website || '',
      director: colegio.director || '',
      departamento: colegio.departamento,
      provincia: colegio.provincia,
      distrito: colegio.distrito,
      nivelesEducativos: colegio.nivelesEducativos,
      turnos: colegio.turnos,
      aforoMaximo: colegio.poblacion,
      fechaFundacion: colegio.fechaFundacion,
      estado: colegio.estado
    });
  }

  // ✅ ELIMINAR COLEGIO
  deleteColegio(id_colegio: number): void {
    const colegio = this.colegios.find(c => c.id_colegio === id_colegio);
    if (!colegio) {
      this.handleError('Colegio no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Colegio?',
      text: `¿Estás seguro de que deseas eliminar "${colegio.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
             this.colegiosService.eliminarColegio(id_colegio)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              this.handleSuccess('Colegio eliminado exitosamente');
              this.cargarColegios();
            },
            error: (error) => {
              this.loading = false;
              this.handleError('Error al eliminar el colegio');
              console.error('Error:', error);
            }
          });
      }
    });
  }

  // ✅ VER DETALLES DEL COLEGIO
  viewColegio(id_colegio: number): void {
    const colegio = this.colegios.find(c => c.id_colegio === id_colegio);
    if (!colegio) {
      this.handleError('Colegio no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Colegio`,
      html: `
        <div class="text-left">
          <p><strong>Nombre:</strong> ${colegio.nombre}</p>
          <p><strong>Código Modular:</strong> ${colegio.codigoModular}</p>
          <p><strong>Dirección:</strong> ${colegio.direccion}</p>
          <p><strong>Teléfono:</strong> ${colegio.telefono}</p>
          <p><strong>Correo:</strong> ${colegio.correo}</p>
          <p><strong>Website:</strong> ${colegio.website || 'No especificado'}</p>
          <p><strong>Director:</strong> ${colegio.director || 'No especificado'}</p>
          <p><strong>Ubicación:</strong> ${colegio.distrito}, ${colegio.provincia}, ${colegio.departamento}</p>
          <p><strong>Niveles:</strong> ${colegio.nivelesEducativos.join(', ')}</p>
          <p><strong>Turnos:</strong> ${colegio.turnos.join(', ')}</p>
          <p><strong>Población:</strong> ${colegio.poblacion}</p>
          <p><strong>Fecha de Fundación:</strong> ${new Date(colegio.fechaFundacion).toLocaleDateString('es-ES')}</p>
          <p><strong>Estado:</strong> ${colegio.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });
  }

// ✅ VER DOCENTES DEL COLEGIO
  viewDocentes(id_colegio: number): void {
    const colegio = this.colegios.find(c => c.id_colegio === id_colegio);
    if (!colegio) {
      this.handleError('Colegio no encontrado');
      return;
    }

    // Mostrar loading mientras se obtienen los docentes
    Swal.fire({
      title: 'Cargando docentes...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.docentesService.getDocentes().subscribe({
      next: (response) => {
        const docentes = response;
        let html = '';
        if (docentes.length === 0) {
          html = '<p>No hay docentes registrados para este colegio.</p>';
        } else {
          html = `
            <div style="overflow-x:auto; max-height:350px;">
              <table class="table table-bordered table-sm" style="width:100%; font-size:14px;">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombres y Apellidos</th>
                    <th>Nivel</th>
                    <th>Grado</th>
                    <th>Sección</th>
                  </tr>
                </thead>
                <tbody>
                  ${docentes.map((d: Docente & { nivel?: string; grado?: string; seccion?: string }, i: number) => `
                    <tr>
                      <td>${d.id_docente ?? (i+1)}</td>
                      <td>${d.nombres} ${d.apellido}</td>
                      <td>${d.nivel ?? '-'}</td>
                      <td>${d.grado ?? '-'}</td>
                      <td>${d.seccion ?? '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
        Swal.fire({
          title: `Docentes del Colegio` + (colegio.nombre ? `: ${colegio.nombre}` : ''),
          html,
          icon: 'info',
          confirmButtonText: 'Cerrar',
          width: '700px'
        });
      },
      error: () => {
        this.handleError('No se pudieron obtener los docentes del colegio.');
      }
    });
  }

  // ✅ CANCELAR EDICIÓN
  cancelEdit(): void {
    this.isEditing = false;
    this.editingColegioId = undefined;
    this.colegioForm.reset();
    this.colegioForm.patchValue({
      estado: true,
      nivelesEducativos: [],
      turnos: []
    });
    this.activeTab = 'tabla';
  }

  // ✅ LIMPIAR FORMULARIO
  resetForm(): void {
    Swal.fire({
      title: '¿Limpiar Formulario?',
      text: '¿Estás seguro de que deseas limpiar todos los campos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6c757d',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.colegioForm.reset();
        this.colegioForm.patchValue({
          estado: true,
          nivelesEducativos: [],
          turnos: []
        });
      }
    });
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.colegioForm.controls).forEach(key => {
      const control = this.colegioForm.get(key);
      control?.markAsTouched();
    });
  }

  // ✅ MANEJO DE ERRORES
  private handleError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  // ✅ MANEJO DE ÉXITO
  private handleSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#28a745'
    });
  }

  // ✅ PAGINACIÓN - TOTAL DE PÁGINAS
  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredColegios.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // ✅ GETTER PARA FORMULARIO
  get f() {
    return this.colegioForm.controls;
  }

  // ✅ VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.colegioForm.valid && !this.loading;
  }

  // ✅ MÉTODOS FALTANTES REQUERIDOS POR EL HTML
  onViewColegioKey(event: KeyboardEvent, id_colegio: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.viewColegio(id_colegio);
    }
  }

  onEditColegioKey(event: KeyboardEvent, id_colegio: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.editColegio(id_colegio);
    }
  }

  onDeleteColegioKey(event: KeyboardEvent, id_colegio: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.deleteColegio(id_colegio);
    }
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Logo seleccionado:', file.name);
      // Aquí implementarías la lógica para subir el logo
    }
  }

  cancelCreate(): void {
    this.cancelEdit();
  }

  // ✅ PROPIEDADES ADICIONALES PARA EL TEMPLATE HTML
  // Las provincias y distritos ahora son arrays cargados dinámicamente
  private showEmptyState(): void {
    this.colegios = [];
    this.filteredColegios = [];
    this.paginatedColegios = [];

    console.log('📋 Estado vacío configurado');
    console.log('💡 Para cargar datos reales:');
    console.log('   1. Asegúrate de que el backend esté corriendo en http://localhost:3000');
    console.log('   2. Verifica que el endpoint /colegios esté disponible');
    console.log('   3. Revisa que haya datos en la base de datos');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN CON EL ENDPOINT
  testEndpointConnection(): void {
    console.log('🧪 TESTING ENDPOINT CONNECTION...');
    console.log('🔗 URL del endpoint:', 'http://localhost:3000/colegios');
    console.log('🔧 Interceptors activos:', ['AuthInterceptor', 'LoggingInterceptor', 'ErrorInterceptor', 'LoadingInterceptor']);

    // Verificar si el servicio está inyectado correctamente
    if (this.colegiosService) {
      console.log('✅ ColegiosService inyectado correctamente');
    } else {
      console.error('❌ ColegiosService NO está inyectado');
    }

    console.log('📡 La carga de datos se realizará automáticamente en cargarColegios()');
    console.log('🚫 Ya NO se cargan datos de prueba automáticamente');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN DIRECTA CON EL ENDPOINT
  testConnection(): void {
    console.log('🧪 PROBANDO CONEXIÓN DIRECTA CON EL ENDPOINT...');
    console.log('🔗 URL:', 'http://localhost:3000/colegios');

    this.loading = true;
    this.colegiosService.getColegios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('✅ CONEXIÓN EXITOSA!');
          console.log('📊 Respuesta completa:', response);
          console.log('📋 Tipo de respuesta:', typeof response);
          console.log('🔍 Es array?', Array.isArray(response));

          if (Array.isArray(response)) {
            console.log('📊 Cantidad de elementos:', response.length);
            response.forEach((item, index) => {
              console.log(`🏫 Colegio ${index + 1}:`, item);
            });
          }

          // Forzar actualización de datos
          this.colegios = response;
          this.filteredColegios = [...response];
          this.updatePaginatedColegios();
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ ERROR EN CONEXIÓN:');
          console.error('🔍 Status:', error.status);
          console.error('🔍 Message:', error.message);
          console.error('🔍 URL:', error.url);
          console.error('🔍 Error completo:', error);

          this.handleError(`Error de conexión: ${error.message || 'Error desconocido'}`);
        }
      });
  }

  // ✅ VERIFICAR AUTENTICACIÓN Y PROBAR ENDPOINT
  checkAuthAndTestEndpoint(): void {
    console.log('🔐 VERIFICANDO AUTENTICACIÓN...');

    // Verificar token en localStorage
    const token = localStorage.getItem('access_token');
    console.log('🔑 Token en localStorage:', token ? 'EXISTE' : 'NO EXISTE');

    if (!token) {
      console.error('❌ NO HAY TOKEN DE AUTENTICACIÓN');
      this.handleError('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
      return;
    }

    console.log('✅ Token encontrado, probando endpoint...');
    this.testConnection();
  }

  // ⚠️ DATOS DE PRUEBA TEMPORALES (SOLO PARA DESARROLLO)
  // Este método ya NO se ejecuta automáticamente
  // Solo se usa para propósitos de desarrollo si es necesario
  loadTestData(): void {
    console.warn('⚠️ CARGANDO DATOS DE PRUEBA - SOLO PARA DESARROLLO');
    console.warn('🚫 Este método NO debe usarse en producción');
    console.warn('📝 Los datos reales deben venir del endpoint: http://localhost:3000/colegios');

    const testColegios: Colegio[] = [
      {
        id_colegio: 1,
        nombre: 'Colegio San Remo (PRUEBA)',
        codigoModular: '1234567',
        direccion: 'Av. Principal 123, Lima',
        telefono: '987654321',
        correo: 'info@sanremo.edu.pe',
        website: 'www.sanremo.edu.pe',
        director: 'Director Prueba',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'San Isidro',
        nivelesEducativos: ['Inicial', 'Primaria', 'Secundaria'],
        turnos: ['Mañana', 'Tarde'],
        poblacion: 1000,
        fechaFundacion: '2020-01-01',
        estado: true
      },
      {
        id_colegio: 2,
        nombre: 'Colegio Los Andes (PRUEBA)',
        codigoModular: '7654321',
        direccion: 'Jr. Los Pinos 456, Lima',
        telefono: '987654322',
        correo: 'info@losandes.edu.pe',
        website: 'www.losandes.edu.pe',
        director: 'Director Los Andes',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'Miraflores',
        nivelesEducativos: ['Primaria', 'Secundaria'],
        turnos: ['Mañana'],
        poblacion: 800,
        fechaFundacion: '2015-03-15',
        estado: true
      }
    ];

    console.log('📊 Aplicando datos de prueba:', testColegios);
    this.colegios = testColegios;
    this.filteredColegios = [...testColegios];
    this.updatePaginatedColegios();
  }

  // ✅ MÉTODO PARA FORZAR CARGA DE DATOS DE PRUEBA (SOLO DESARROLLO)
  forceLoadTestData(): void {
    console.log('🔧 FORZANDO CARGA DE DATOS DE PRUEBA...');
    this.loadTestData();
  }

  // ✅ MÉTODO PARA SIMULAR LOGIN Y OBTENER TOKEN (SOLO PARA PRUEBAS)
  simulateLogin(): void {
    console.log('🔐 SIMULANDO LOGIN PARA OBTENER TOKEN...');

    // Datos de prueba (ajustar según tu backend)
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };

    this.authService.login(loginData.username, loginData.password)
      .subscribe({
        next: (response: { access_token: string; user?: unknown }) => {
          console.log('✅ LOGIN EXITOSO:', response);

          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            console.log('🔑 Token guardado en localStorage');

            // Ahora probar el endpoint
            this.testConnection();
          }
        },
        error: (error: { message: string }) => {
          console.error('❌ ERROR EN LOGIN:', error);
          this.handleError('Error en login. Verifica las credenciales.');
        }
      });
  }

  private handleEmptyState(): void {
    // Implementación para manejar el estado vacío si es necesario
    this.showEmptyState();
  }

  private resetFilters(): void {
    this.searchTerm = '';
    this.filtroDepartamento = '';
    this.filtroProvincia = '';
    this.filtroDistrito = '';
    this.cargarColegios();
  }

}
