import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Familia, FamilasService, CreateFamiliaDto, UpdateFamiliaDto } from 'src/app/services/familia.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-grupofam',
  templateUrl: './grupofam.component.html',
  styleUrls: ['./grupofam.component.css']
})
export class GrupofamComponent implements OnInit, OnDestroy {
  // Servicio de familias
  private familiaService = inject(FamilasService);
  // ✅ PROPIEDADES ESENCIALES
  familias: Familia[] = [];
  filteredFamilias: Familia[] = [];
  paginatedFamilias: Familia[] = [];
  // Ejemplo de cómo consumir familia_estudiantes:
  getEstudiantesDeFamilia(familia: Familia): number[] {
    return familia.familia_estudiantes;
  }

  // ✅ CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  isEditing = false;
  editingEstudianteId?: number;
  editingFamiliaId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  // ✅ FORMULARIO REACTIVO
  familiaForm!: FormGroup;

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // ✅ TRACKBY FUNCTION FOR PERFORMANCE
  trackByFamiliaId(index: number, familia: Familia): number {
    return familia.id_familia || index;
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
  // Estas opciones se mantienen si el familia puede ser asignado a niveles o turnos
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
    this.cargarFamilias();
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
    this.filterFamilias(); // Cambiado a filterFamilias
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
    this.filterFamilias(); // Cambiado a filterFamilias
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.familiaForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]], // Cambiado a 'nombres'
      apellido: ['', [Validators.required, Validators.minLength(3)]], // Cambiado a 'apellido'
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // DNI para familias
      fechaNacimiento: ['', [Validators.required]], // Fecha de nacimiento
      genero: ['', [Validators.required]], // Género del familia
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      telefonoContacto: ['', [Validators.pattern(/^9\d{8}$/)]], // Teléfono de contacto (puede ser opcional)
      correoContacto: ['', [Validators.email]], // Correo de contacto (puede ser opcional)
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      grado: ['', [Validators.required]], // Grado del familia
      seccion: ['', [Validators.required]], // Sección del familia
      estado: [true, [Validators.required]]
    });
  }

  // ✅ VALIDADOR PERSONALIZADO para DNI (ejemplo, ajustar según necesidad)
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

  // ✅ CARGA DE FAMILIAS
  cargarFamilias(): void {
    console.log('🔄 Iniciando carga de familias...');
    console.log('🔗 Endpoint configurado:', 'http://localhost:3000/familias'); // Ajustar endpoint
    console.log('🔧 Interceptors que se ejecutarán automáticamente:');
    console.log('   1. 🔑 AuthInterceptor → Agrega token JWT');
    console.log('   2. 📝 LoggingInterceptor → Registra request');
    console.log('   3. ⏳ LoadingInterceptor → Muestra spinner');
    console.log('   4. 🚨 ErrorInterceptor → Maneja errores (si ocurren)');

    this.loading = true;

    console.log('📡 Llamando this.familiaService.getFamilias()...');
    this.familiaService.getFamilias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ INTERCEPTORS COMPLETADOS - Datos recibidos del endpoint:');
          console.log('📊 Cantidad de familias:', data.length);
          console.log('🔍 Datos completos recibidos:', data);

          this.familias = data;
          this.filteredFamilias = [...data];
          this.updatePaginatedFamilias();
          this.loading = false;

          if (data.length === 0) {
            console.warn('⚠️ No se encontraron familias en la base de datos');
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
          this.handleError(`Error al cargar familias: ${error.message}`);
          this.showEmptyState();
        }
      });
  }

  // ✅ FILTRADO DE FAMILIAS
  filterFamilias(): void {
    if (!this.searchTerm.trim()) {
      this.filteredFamilias = [...this.familias];
    } else {
      this.filteredFamilias = this.familias.filter(familia =>
        familia.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        familia.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) //||
        //(familia.dni && familia.dni.includes(this.searchTerm))
      );
    }
    this.currentPage = 1;
    this.updatePaginatedFamilias();
  }

  // ✅ ACTUALIZACIÓN DE PAGINACIÓN
  updatePaginatedFamilias(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFamilias = this.filteredFamilias.slice(startIndex, endIndex);
  }

  // ✅ CAMBIO DE PÁGINA
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedFamilias();
  }

  // ✅ CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado'): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // ✅ CREAR NUEVO FAMILIA
  createFamilia(): void {
    this.activeTab = 'nuevo';
    this.isEditing = false;
    this.editingEstudianteId = undefined;
    this.familiaForm.reset();
    this.familiaForm.patchValue({
      estado: true
      // Limpiar campos de array si aplican, como si el familia tiene niveles/turnos directos
    });
  }

  // ✅ GUARDAR FAMILIA
  saveFamilia(): void {
    if (this.familiaForm.invalid) {
      this.markFormGroupTouched();
      this.handleError('Por favor corrige los errores en el formulario');
      return;
    }

    this.loading = true;
    const formData = this.familiaForm.value;

    if (this.isEditing && this.editingFamiliaId) {
      // Actualizar familia existente
      const updateData: UpdateFamiliaDto = {
        id_familia: this.editingFamiliaId,
        ...formData
      };

      this.familiaService.actualizarFamilia(this.editingFamiliaId, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Familia actualizado exitosamente');
            this.cargarFamilias();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al actualizar el familia');
            console.error('Error:', error);
          }
        });
    } else {
      // Crear nuevo familia
      const createData: CreateFamiliaDto = formData;

      this.familiaService.crearFamilia(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Familia creado exitosamente');
            this.cargarFamilias();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al crear el familia');
            console.error('Error:', error);
          }
        });
    }
  }

  // ✅ EDITAR FAMILIA
  editFamilia(id_familia: number): void {
    const familia = this.familias.find(e => e.id_familia === id_familia);
    if (!familia) {
      this.handleError('Familia no encontrado');
      return;
    }

    this.isEditing = true;
    this.editingFamiliaId = id_familia;
    this.activeTab = 'nuevo';

    this.familiaForm.patchValue({
      nombres: familia.nombres,
      apellido: familia.apellido,
    });
  }

  // ✅ ELIMINAR FAMILIA
  deleteFamilia(id_familia: number): void {
    const familia = this.familias.find(e => e.id_familia === id_familia);
    if (!familia) {
      this.handleError('Familia no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Familia?',
      text: `¿Estás seguro de que deseas eliminar a "${familia.nombres} ${familia.apellido}"?`,
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
        this.familiaService.eliminarFamilia(id_familia)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              this.handleSuccess('Familia eliminado exitosamente');
              this.cargarFamilias();
            },
            error: (error) => {
              this.loading = false;
              this.handleError('Error al eliminar el familia');
              console.error('Error:', error);
            }
          });
      }
    });
  }

  // ✅ VER DETALLES DEL FAMILIA
  viewFamilia(id_familia: number): void {
    const familia = this.familias.find(e => e.id_familia === id_familia);
    if (!familia) {
      this.handleError('Familia no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Familia`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${familia.nombres}</p>
          <p><strong>apellido:</strong> ${familia.apellido}</p>
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
    this.editingEstudianteId = undefined;
    this.familiaForm.reset();
    this.familiaForm.patchValue({
      estado: true
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
        this.familiaForm.reset();
        this.familiaForm.patchValue({
          estado: true
        });
      }
    });
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.familiaForm.controls).forEach(key => {
      const control = this.familiaForm.get(key);
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
    const totalPages = Math.ceil(this.filteredFamilias.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // ✅ GETTER PARA FORMULARIO
  get f() {
    return this.familiaForm.controls;
  }

  // ✅ VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.familiaForm.valid && !this.loading;
  }

  // ✅ MÉTODOS FALTANTES REQUERIDOS POR EL HTML
  onViewEstudianteKey(event: KeyboardEvent, id_estudiante: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.viewFamilia(id_estudiante);
    }
  }

  onEditEstudianteKey(event: KeyboardEvent, id_estudiante: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.editFamilia(id_estudiante);
    }
  }

  onDeleteEstudianteKey(event: KeyboardEvent, id_estudiante: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.deleteFamilia(id_estudiante);
    }
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Foto seleccionada:', file.name);
      // Aquí implementarías la lógica para subir la foto del familia
    }
  }

  cancelCreate(): void {
    this.cancelEdit();
  }

  // ✅ PROPIEDADES ADICIONALES PARA EL TEMPLATE HTML
  private showEmptyState(): void {
    this.familias = [];
    this.filteredFamilias = [];
    this.paginatedFamilias = [];

    console.log('📋 Estado vacío configurado');
    console.log('💡 Para cargar datos reales:');
    console.log('   1. Asegúrate de que el backend esté corriendo en http://localhost:3000');
    console.log('   2. Verifica que el endpoint /familias esté disponible'); // Ajustar endpoint
    console.log('   3. Revisa que haya datos en la base de datos');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN CON EL ENDPOINT
  testEndpointConnection(): void {
    console.log('🧪 TESTING ENDPOINT CONNECTION...');
    console.log('🔗 URL del endpoint:', 'http://localhost:3000/familias'); // Ajustar endpoint
    console.log('🔧 Interceptors activos:', ['AuthInterceptor', 'LoggingInterceptor', 'ErrorInterceptor', 'LoadingInterceptor']);

    // Verificar si el servicio está inyectado correctamente
    if (this.familiaService) {
      console.log('✅ FamiliaService inyectado correctamente');
    } else {
      console.error('❌ FamiliaService NO está inyectado');
    }

    console.log('📡 La carga de datos se realizará automáticamente en cargarFamilias()');
    console.log('🚫 Ya NO se cargan datos de prueba automáticamente');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN DIRECTA CON EL ENDPOINT
  testConnection(): void {
    console.log('🧪 PROBANDO CONEXIÓN DIRECTA CON EL ENDPOINT...');
    console.log('🔗 URL:', 'http://localhost:3000/familias'); // Ajustar endpoint

    this.loading = true;
    this.familiaService.getFamilias() // Usar el servicio de familias
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
              console.log(`🧑‍🎓 Familia ${index + 1}:`, item); // Icono y texto ajustado
            });
          }

          // Forzar actualización de datos
          //this.familias = Array.isArray(response) ? response : response.data;
          //this.filteredEstudiantes = [...(Array.isArray(response) ? response : response.data)];
          this.updatePaginatedFamilias();
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('❌ ERROR EN CONEXIÓN:');
          if (typeof error === 'object' && error !== null) {
            const errObj = error as { status?: number; message?: string; url?: string };
            console.error('🔍 Status:', errObj.status);
            console.error('🔍 Message:', errObj.message);
            console.error('🔍 URL:', errObj.url);
            console.error('🔍 Error completo:', errObj);
            this.handleError(`Error de conexión: ${errObj.message || 'Error desconocido'}`);
          } else {
            console.error('🔍 Error completo:', error);
            this.handleError('Error de conexión: Error desconocido');
          }
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
    console.warn('📝 Los datos reales deben venir del endpoint: http://localhost:3000/familias'); // Ajustar endpoint

    const testFamilias: Familia[] = [
      {
        id_familia: 1,
        nombres: 'González Flores',
        apellido: 'González Flores',
        familia_estudiantes: [1],
        estado: true,
        estudiante_codigo: 'EST001',
        foto_perfil: '',
        id_perfil: 1,
        id_colegio: 1
      },
      {
        id_familia: 2,
        nombres: 'Ramírez Soto',
        apellido: 'Ramírez Soto',
        familia_estudiantes: [2],
        estado: true,
        estudiante_codigo: 'EST002',
        foto_perfil: '',
        id_perfil: 2,
        id_colegio: 1
      },
      {
        id_familia: 3,
        nombres: 'Ramírez Soto',
        apellido: 'Ramírez Soto',
        familia_estudiantes: [2, 3],
        estado: true,
        estudiante_codigo: 'EST003',
        foto_perfil: '',
        id_perfil: 3,
        id_colegio: 1
      }
    ];

    console.log('📊 Aplicando datos de prueba:', testFamilias);
    this.familias = testFamilias;
    this.filteredFamilias = [...testFamilias];
    this.updatePaginatedFamilias();
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
    this.cargarFamilias();
  }
}
