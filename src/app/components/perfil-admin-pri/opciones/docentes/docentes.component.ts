
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Docente, DocentesService, CreateDocenteDto, UpdateDocenteDto } from 'src/app/services/docentes.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit, OnDestroy {
  // Servicio de docentes
  private docentesService = inject(DocentesService);
  // ✅ PROPIEDADES ESENCIALES
  docentes: Docente[] = [];
  filteredDocentes: Docente[] = [];
  paginatedDocentes: Docente[] = [];

  // ✅ CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  isEditing = false;
  editingDocenteId?: number;
  loading = false;
  activeTab = 'tabla';

  // ✅ FORMULARIO REACTIVO
  docenteForm!: FormGroup;

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // ✅ TRACKBY FUNCTION FOR PERFORMANCE
  trackByDocenteId(index: number, docente: Docente): number {
    return docente.id_docente || index;
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
  // Si los docentes tienen niveles educativos o turnos asociados, se mantienen.
  // Si son propiedades del colegio donde enseñan, estas propiedades deberían venir del contexto del colegio,
  // o el docente debería tener un id_colegio para buscar esa info.
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
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarDocentes();
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
    this.docenteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]], // Asumiendo que el docente tiene apellido
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // DNI para docentes
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      // Campos específicos para docente
      titulo: ['', [Validators.required]], // Título del docente
      especialidad: ['', [Validators.required]], // Especialidad del docente
      fechaContratacion: ['', [Validators.required]], // Fecha de contratación
      estado: [true, [Validators.required]]
    });
  }

  // ✅ VALIDADOR PERSONALIZADO (ejemplo, ajustar según necesidad)
  private dniValidator(control: AbstractControl) {
    const dni = control.get('dni')?.value;
    if (!dni) {
      return null;
    }
    if (!/^\d{8}$/.test(dni)) {
      return { dniInvalid: true };
    }
    return null;
  }


  // ✅ CARGA DE DOCENTES
  cargarDocentes(): void {
    console.log('🔄 Iniciando carga de docentes...');
    console.log('🔗 Endpoint configurado:', 'http://localhost:3000/docentes'); // Ajustar endpoint
    console.log('🔧 Interceptors que se ejecutarán automáticamente:');
    console.log('   1. 🔑 AuthInterceptor → Agrega token JWT');
    console.log('   2. 📝 LoggingInterceptor → Registra request');
    console.log('   3. ⏳ LoadingInterceptor → Muestra spinner');
    console.log('   4. 🚨 ErrorInterceptor → Maneja errores (si ocurren)');

    this.loading = true;

    console.log('📡 Llamando this.docentesService.getDocentes()...');
    this.docentesService.getDocentes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ INTERCEPTORS COMPLETADOS - Datos recibidos del endpoint:');
          console.log('📊 Cantidad de docentes:', data.length);
          console.log('🔍 Datos completos recibidos:', data);

          this.docentes = data;
          this.filteredDocentes = [...data];
          this.updatePaginatedDocentes();
          this.loading = false;

          if (data.length === 0) {
            console.warn('⚠️ No se encontraron docentes en la base de datos');
            console.log('💡 Asegúrate de que el backend esté activo y tenga datos');
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
          this.handleError(`Error al cargar docentes: ${error.message}`);
          this.showEmptyState();
        }
      });
  }

  // ✅ FILTRADO DE COLEGIOS
  filterColegios(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDocentes = [...this.docentes];
    } else {
      this.filteredDocentes = this.docentes.filter(docente =>
        docente.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        docente.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) //||
        //(docente.dni && docente.dni.includes(this.searchTerm)) // Asumiendo que DNI es string y existe
      );
    }
    this.currentPage = 1;
    this.updatePaginatedDocentes();
  }

  // ✅ ACTUALIZACIÓN DE PAGINACIÓN
  updatePaginatedDocentes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDocentes = this.filteredDocentes.slice(startIndex, endIndex);
  }

  // ✅ CAMBIO DE PÁGINA
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedDocentes();
  }

  // ✅ CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado'): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // ✅ CREAR NUEVO DOCENTE
  createDocente(): void {
    this.activeTab = 'nuevo';
    this.isEditing = false;
    this.editingDocenteId = undefined;
    this.docenteForm.reset();
    this.docenteForm.patchValue({
      estado: true
      // Si tienes campos de array como nivelesEducativos o turnos en docente, inicialízalos aquí
      // nivelesEducativos: [],
      // turnos: []
    });
  }

  // ✅ GUARDAR DOCENTE
  saveDocente(): void {
    if (this.docenteForm.invalid) {
      this.markFormGroupTouched();
      this.handleError('Por favor corrige los errores en el formulario');
      return;
    }

    this.loading = true;
    const formData = this.docenteForm.value;

    if (this.isEditing && this.editingDocenteId) {
      // Actualizar docente existente
      const updateData: UpdateDocenteDto = {
        id_docente: this.editingDocenteId,
        ...formData
      };

      this.docentesService.actualizarDocente(this.editingDocenteId, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Docente actualizado exitosamente');
            this.cargarDocentes();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al actualizar el docente');
            console.error('Error:', error);
          }
        });
    } else {
      // Crear nuevo docente
      const createData: CreateDocenteDto = formData;

      this.docentesService.crearDocente(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Docente creado exitosamente');
            this.cargarDocentes();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al crear el docente');
            console.error('Error:', error);
          }
        });
    }
  }

  // ✅ EDITAR DOCENTE
  editDocente(id_docente: number): void {
    const docente = this.docentes.find(d => d.id_docente === id_docente);
    if (!docente) {
      this.handleError('Docente no encontrado');
      return;
    }

    this.isEditing = true;
    this.editingDocenteId = id_docente;
    this.activeTab = 'nuevo';

    this.docenteForm.patchValue({
      nombre: docente.nombres, // Asumiendo que el campo es 'nombres' en la interfaz Docente
      apellido: docente.apellido, // Asumiendo que el campo es 'apellido' en la interfaz Docente
      //dni: docente.dni,
      telefono: docente.telefono,
      correo: docente.correo,
      direccion: docente.direccion,
      //departamento: docente.departamento,
      //provincia: docente.provincia,
      //distrito: docente.distrito,
      titulo: docente.titulo, // Campo específico de docente
      especialidad: docente.especialidad, // Campo específico de docente
      //fechaContratacion: docente.fechaContratacion, // Campo específico de docente
      estado: docente.estado
      // Ajustar si docente tiene nivelesEducativos o turnos directamente
      // nivelesEducativos: docente.nivelesEducativos || [],
      // turnos: docente.turnos || []
    });
  }

  // ✅ ELIMINAR DOCENTE
  deleteDocente(id_docente: number): void {
    const docente = this.docentes.find(d => d.id_docente === id_docente);
    if (!docente) {
      this.handleError('Docente no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Docente?',
      text: `¿Estás seguro de que deseas eliminar a "${docente.nombres} ${docente.apellido}"?`,
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
        this.docentesService.eliminarDocente(id_docente)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              this.handleSuccess('Docente eliminado exitosamente');
              this.cargarDocentes();
            },
            error: (error) => {
              this.loading = false;
              this.handleError('Error al eliminar el docente');
              console.error('Error:', error);
            }
          });
      }
    });
  }

  // ✅ VER DETALLES DEL DOCENTE
  viewDocente(id_docente: number): void {
    const docente = this.docentes.find(d => d.id_docente === id_docente);
    if (!docente) {
      this.handleError('Docente no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Docente`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${docente.nombres}</p>
          <p><strong>Apellidos:</strong> ${docente.apellido}</p>
          <p><strong>DNI:</strong> </p>
          <p><strong>Dirección:</strong> ${docente.direccion}</p>
          <p><strong>Teléfono:</strong> ${docente.telefono}</p>
          <p><strong>Correo:</strong> ${docente.correo}</p>
          <p><strong>Ubicación:</strong> </p>
          <p><strong>Título:</strong> ${docente.titulo || 'No especificado'}</p>
          <p><strong>Especialidad:</strong> ${docente.especialidad || 'No especificado'}</p>
          <p><strong>Fecha Contratación:</strong> </p>
          <p><strong>Estado:</strong> ${docente.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });
  }

  // ✅ CANCELAR EDICIÓN
  cancelEdit(): void {
    this.isEditing = false;
    this.editingDocenteId = undefined;
    this.docenteForm.reset();
    this.docenteForm.patchValue({
      estado: true
      // Limpiar campos de array si aplican
      // nivelesEducativos: [],
      // turnos: []
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
        this.docenteForm.reset();
        this.docenteForm.patchValue({
          estado: true
          // Limpiar campos de array si aplican
          // nivelesEducativos: [],
          // turnos: []
        });
      }
    });
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.docenteForm.controls).forEach(key => {
      const control = this.docenteForm.get(key);
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
    const totalPages = Math.ceil(this.filteredDocentes.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // ✅ GETTER PARA FORMULARIO
  get f() {
    return this.docenteForm.controls;
  }

  // ✅ VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.docenteForm.valid && !this.loading;
  }

  // ✅ MÉTODOS FALTANTES REQUERIDOS POR EL HTML
  onViewDocenteKey(event: KeyboardEvent, id_docente: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.viewDocente(id_docente);
    }
  }

  onEditDocenteKey(event: KeyboardEvent, id_docente: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.editDocente(id_docente);
    }
  }

  onDeleteDocenteKey(event: KeyboardEvent, id_docente: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.deleteDocente(id_docente);
    }
  }

  onPhotoChange(event: Event): void { // Renombrado de onLogoChange a onPhotoChange para docentes
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Foto seleccionada:', file.name);
      // Aquí implementarías la lógica para subir la foto del docente
    }
  }

  cancelCreate(): void {
    this.cancelEdit();
  }

  // ✅ PROPIEDADES ADICIONALES PARA EL TEMPLATE HTML
  private showEmptyState(): void {
    this.docentes = [];
    this.filteredDocentes = [];
    this.paginatedDocentes = [];

    console.log('📋 Estado vacío configurado');
    console.log('💡 Para cargar datos reales:');
    console.log('   1. Asegúrate de que el backend esté corriendo en http://localhost:3000');
    console.log('   2. Verifica que el endpoint /docentes esté disponible'); // Ajustar endpoint
    console.log('   3. Revisa que haya datos en la base de datos');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN CON EL ENDPOINT
  testEndpointConnection(): void {
    console.log('🧪 TESTING ENDPOINT CONNECTION...');
    console.log('🔗 URL del endpoint:', 'http://localhost:3000/docentes'); // Ajustar endpoint
    console.log('🔧 Interceptors activos:', ['AuthInterceptor', 'LoggingInterceptor', 'ErrorInterceptor', 'LoadingInterceptor']);

    // Verificar si el servicio está inyectado correctamente
    if (this.docentesService) {
      console.log('✅ DocentesService inyectado correctamente');
    } else {
      console.error('❌ DocentesService NO está inyectado');
    }

    console.log('📡 La carga de datos se realizará automáticamente en cargarDocentes()');
    console.log('🚫 Ya NO se cargan datos de prueba automáticamente');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN DIRECTA CON EL ENDPOINT
  testConnection(): void {
    console.log('🧪 PROBANDO CONEXIÓN DIRECTA CON EL ENDPOINT...');
    console.log('🔗 URL:', 'http://localhost:3000/docentes'); // Ajustar endpoint

    this.loading = true;
    this.docentesService.getDocentes() // Usar el servicio de docentes
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
              console.log(`👨‍🏫 Docente ${index + 1}:`, item); // Icono y texto ajustado
            });
          }

          // Forzar actualización de datos
          this.docentes = response;
          this.filteredDocentes = [...response];
          this.updatePaginatedDocentes();
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
    console.warn('📝 Los datos reales deben venir del endpoint: http://localhost:3000/docentes'); // Ajustar endpoint

    const testDocentes: Docente[] = [
      {
        id_docente: 1,
        nombres: 'Ana María',
        apellido: 'Pérez García',
        //dni: '12345678',
        direccion: 'Calle Falsa 123, Miraflores',
        telefono: '912345678',
        correo: 'ana.perez@example.com',
        //departamento: 'Lima',
        //provincia: 'Lima',
        //distrito: 'Miraflores',
        titulo: 'Lic. en Educación Primaria',
        especialidad: 'Matemáticas',
        //fechaContratacion: new Date('2020-03-01'),
        estado: true
      },
      {
        id_docente: 2,
        nombres: 'Juan Carlos',
        apellido: 'López Fernández',
        //dni: '87654321',
        direccion: 'Av. Siempre Viva 456, San Isidro',
        telefono: '987654321',
        correo: 'juan.lopez@example.com',
        //departamento: 'Lima',
        //provincia: 'Lima',
        //distrito: 'San Isidro',
        titulo: 'Prof. en Educación Secundaria',
        especialidad: 'Comunicación',
        //fechaContratacion: new Date('2018-08-15'),
        estado: true
      }
    ];

    console.log('📊 Aplicando datos de prueba:', testDocentes);
    this.docentes = testDocentes;
    this.filteredDocentes = [...testDocentes];
    this.updatePaginatedDocentes();
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
    this.cargarDocentes();
  }
}
