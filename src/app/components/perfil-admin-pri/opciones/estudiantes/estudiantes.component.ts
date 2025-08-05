import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { ColegiosService, Colegio } from 'src/app/services/colegios.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Estudiante, EstudiantesService, CreateEstudianteDto, UpdateEstudianteDto } from 'src/app/services/estudiantes.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({  // Cambié 'app-estudiantes' a 'app-estudiantes'
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit, OnDestroy {
  // Servicio de estudiantes
  private estudiantesService = inject(EstudiantesService);
  private colegiosService = inject(ColegiosService);
  // ✅ PROPIEDADES ESENCIALES
  estudiantes: Estudiante[] = [];
  filteredEstudiantes: Estudiante[] = [];
  paginatedEstudiantes: Estudiante[] = [];

  colegios: Colegio[] = [];
  filtroColegio: string = '';

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
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // ✅ FORMULARIO REACTIVO
  estudianteForm!: FormGroup;

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // ✅ TRACKBY FUNCTION FOR PERFORMANCE
  trackByEstudianteId(index: number, estudiante: Estudiante): number {
    return estudiante.id_estudiante || index;
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
  // Estas opciones se mantienen si el estudiante puede ser asignado a niveles o turnos
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
    this.cargarEstudiantes();
    this.testEndpointConnection();
    this.cargarColegios();
  }

  cargarColegios(): void {
    this.colegiosService.getColegiosClientes().subscribe({
      next: (data) => {
        this.colegios = data;
      },
      error: (err) => {
        console.error('Error al cargar colegios clientes:', err);
      }
    });
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
    this.filterEstudiantes(); // Cambiado a filterEstudiantes
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
    this.filterEstudiantes(); // Cambiado a filterEstudiantes
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.estudianteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]], // Cambiado a 'nombres'
      apellido: ['', [Validators.required, Validators.minLength(3)]], // Cambiado a 'apellido'
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // DNI para estudiantes
      fechaNacimiento: ['', [Validators.required]], // Fecha de nacimiento
      genero: ['', [Validators.required]], // Género del estudiante
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      telefonoContacto: ['', [Validators.pattern(/^9\d{8}$/)]], // Teléfono de contacto (puede ser opcional)
      correoContacto: ['', [Validators.email]], // Correo de contacto (puede ser opcional)
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      grado: ['', [Validators.required]], // Grado del estudiante
      seccion: ['', [Validators.required]], // Sección del estudiante
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

  // ✅ CARGA DE ESTUDIANTES
  cargarEstudiantes(): void {
    console.log('🔄 Iniciando carga de estudiantes...');
    console.log('🔗 Endpoint configurado:', 'http://localhost:3000/estudiantes'); // Ajustar endpoint
    console.log('🔧 Interceptors que se ejecutarán automáticamente:');
    console.log('   1. 🔑 AuthInterceptor → Agrega token JWT');
    console.log('   2. 📝 LoggingInterceptor → Registra request');
    console.log('   3. ⏳ LoadingInterceptor → Muestra spinner');
    console.log('   4. 🚨 ErrorInterceptor → Maneja errores (si ocurren)');

    this.loading = true;

    console.log('📡 Llamando this.estudiantesService.getEstudiantes()...');
    this.estudiantesService.getEstudiantes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ INTERCEPTORS COMPLETADOS - Datos recibidos del endpoint:');
          console.log('📊 Cantidad de estudiantes:', data.length);
          console.log('🔍 Datos completos recibidos:', data);

          this.estudiantes = data;
          this.filteredEstudiantes = [...data];
          this.updatePaginatedEstudiantes();
          this.loading = false;

          if (data.length === 0) {
            console.warn('⚠️ No se encontraron estudiantes en la base de datos');
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
          this.handleError(`Error al cargar estudiantes: ${error.message}`);
          this.showEmptyState();
        }
      });
  }

  // ✅ FILTRADO DE ESTUDIANTES
  filterEstudiantes(): void {
    let filtered = [...this.estudiantes];
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(estudiante =>
        estudiante.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        estudiante.apellido.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.filtroColegio) {
      filtered = filtered.filter(estudiante => String(estudiante.id_colegio) === this.filtroColegio);
    }
    this.filteredEstudiantes = filtered;
    this.currentPage = 1;
    this.updatePaginatedEstudiantes();
  }

  // ✅ ACTUALIZACIÓN DE PAGINACIÓN
  updatePaginatedEstudiantes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEstudiantes = this.filteredEstudiantes.slice(startIndex, endIndex);
  }

  // ✅ CAMBIO DE PÁGINA
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEstudiantes();
  }

  // ✅ CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // ✅ CREAR NUEVO ESTUDIANTE
  createEstudiante(): void {
    this.activeTab = 'nuevo';
    this.isEditing = false;
    this.editingEstudianteId = undefined;
    this.estudianteForm.reset();
    this.estudianteForm.patchValue({
      estado: true
      // Limpiar campos de array si aplican, como si el estudiante tiene niveles/turnos directos
    });
  }

  // ✅ GUARDAR ESTUDIANTE
  saveEstudiante(): void {
    if (this.estudianteForm.invalid) {
      this.markFormGroupTouched();
      this.handleError('Por favor corrige los errores en el formulario');
      return;
    }

    this.loading = true;
    const formData = this.estudianteForm.value;

    if (this.isEditing && this.editingEstudianteId) {
      // Actualizar estudiante existente
      const updateData: UpdateEstudianteDto = {
        id_estudiante: this.editingEstudianteId,
        ...formData
      };

      this.estudiantesService.actualizarEstudiante(this.editingEstudianteId, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Estudiante actualizado exitosamente');
            this.cargarEstudiantes();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al actualizar el estudiante');
            console.error('Error:', error);
          }
        });
    } else {
      // Crear nuevo estudiante
      const createData: CreateEstudianteDto = formData;

      this.estudiantesService.crearEstudiante(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Estudiante creado exitosamente');
            this.cargarEstudiantes();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al crear el estudiante');
            console.error('Error:', error);
          }
        });
    }
  }

  // ✅ EDITAR ESTUDIANTE
  editEstudiante(id_estudiante: number): void {
    const estudiante = this.estudiantes.find(e => e.id_estudiante === id_estudiante);
    if (!estudiante) {
      this.handleError('Estudiante no encontrado');
      return;
    }

    this.isEditing = true;
    this.editingEstudianteId = id_estudiante;
    this.activeTab = 'nuevo';

    this.estudianteForm.patchValue({
      nombres: estudiante.nombres,
      apellido: estudiante.apellido,
    });
  }

  // ✅ ELIMINAR ESTUDIANTE
  deleteEstudiante(id_estudiante: number): void {
    const estudiante = this.estudiantes.find(e => e.id_estudiante === id_estudiante);
    if (!estudiante) {
      this.handleError('Estudiante no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Estudiante?',
      text: `¿Estás seguro de que deseas eliminar a "${estudiante.nombres} ${estudiante.apellido}"?`,
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
        this.estudiantesService.eliminarEstudiante(id_estudiante)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              this.handleSuccess('Estudiante eliminado exitosamente');
              this.cargarEstudiantes();
            },
            error: (error) => {
              this.loading = false;
              this.handleError('Error al eliminar el estudiante');
              console.error('Error:', error);
            }
          });
      }
    });
  }

  // ✅ VER DETALLES DEL ESTUDIANTE
  viewEstudiante(id_estudiante: number): void {
    const estudiante = this.estudiantes.find(e => e.id_estudiante === id_estudiante);
    if (!estudiante) {
      this.handleError('Estudiante no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Estudiante`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${estudiante.nombres}</p>
          <p><strong>apellido:</strong> ${estudiante.apellido}</p>
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
    this.estudianteForm.reset();
    this.estudianteForm.patchValue({
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
        this.estudianteForm.reset();
        this.estudianteForm.patchValue({
          estado: true
        });
      }
    });
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.estudianteForm.controls).forEach(key => {
      const control = this.estudianteForm.get(key);
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
    const totalPages = Math.ceil(this.filteredEstudiantes.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // ✅ GETTER PARA FORMULARIO
  get f() {
    return this.estudianteForm.controls;
  }

  // ✅ VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.estudianteForm.valid && !this.loading;
  }

  // ✅ MÉTODOS FALTANTES REQUERIDOS POR EL HTML
  onViewEstudianteKey(event: KeyboardEvent, id_estudiante: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.viewEstudiante(id_estudiante);
    }
  }

  onEditEstudianteKey(event: KeyboardEvent, id_estudiante: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.editEstudiante(id_estudiante);
    }
  }

  onDeleteEstudianteKey(event: KeyboardEvent, id_estudiante: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.deleteEstudiante(id_estudiante);
    }
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Foto seleccionada:', file.name);
      // Aquí implementarías la lógica para subir la foto del estudiante
    }
  }

  cancelCreate(): void {
    this.cancelEdit();
  }

  // ✅ PROPIEDADES ADICIONALES PARA EL TEMPLATE HTML
  private showEmptyState(): void {
    this.estudiantes = [];
    this.filteredEstudiantes = [];
    this.paginatedEstudiantes = [];

    console.log('📋 Estado vacío configurado');
    console.log('💡 Para cargar datos reales:');
    console.log('   1. Asegúrate de que el backend esté corriendo en http://localhost:3000');
    console.log('   2. Verifica que el endpoint /estudiantes esté disponible'); // Ajustar endpoint
    console.log('   3. Revisa que haya datos en la base de datos');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN CON EL ENDPOINT
  testEndpointConnection(): void {
    console.log('🧪 TESTING ENDPOINT CONNECTION...');
    console.log('🔗 URL del endpoint:', 'http://localhost:3000/estudiantes'); // Ajustar endpoint
    console.log('🔧 Interceptors activos:', ['AuthInterceptor', 'LoggingInterceptor', 'ErrorInterceptor', 'LoadingInterceptor']);

    // Verificar si el servicio está inyectado correctamente
    if (this.estudiantesService) {
      console.log('✅ EstudiantesService inyectado correctamente');
    } else {
      console.error('❌ EstudiantesService NO está inyectado');
    }

    console.log('📡 La carga de datos se realizará automáticamente en cargarEstudiantes()');
    console.log('🚫 Ya NO se cargan datos de prueba automáticamente');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN DIRECTA CON EL ENDPOINT
  testConnection(): void {
    console.log('🧪 PROBANDO CONEXIÓN DIRECTA CON EL ENDPOINT...');
    console.log('🔗 URL:', 'http://localhost:3000/estudiantes'); // Ajustar endpoint

    this.loading = true;
    this.estudiantesService.getEstudiantes() // Usar el servicio de estudiantes
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
              console.log(`🧑‍🎓 Estudiante ${index + 1}:`, item); // Icono y texto ajustado
            });
          }

          // Forzar actualización de datos
          //this.estudiantes = Array.isArray(response) ? response : response.data;
          //this.filteredEstudiantes = [...(Array.isArray(response) ? response : response.data)];
          this.updatePaginatedEstudiantes();
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
    console.warn('📝 Los datos reales deben venir del endpoint: http://localhost:3000/estudiantes'); // Ajustar endpoint

    const testEstudiantes: Estudiante[] = [
      {
        id_estudiante: 1,
        nombres: 'María Alejandra',
        apellido: 'González Flores',
        correo: 'maria.gonzalez@example.com',
        estado: true,
        id_perfil: 1,
        id_colegio: 1,
        direccion: 'Av. Las Flores 123',
        telefono: '912345679',
        fecha_nacimiento: '2007-05-15',
        foto_perfil: 'default.jpg',
        ultimo_acceso: '2024-06-01T10:00:00Z'
      },
      {
        id_estudiante: 2,
        nombres: 'Pedro Miguel',
        apellido: 'Ramírez Soto',
        correo: 'pedro.ramirez@example.com',
        estado: true,
        id_perfil: 1,
        id_colegio: 1,
        direccion: 'Av. Los Olivos 456',
        telefono: '912345678',
        fecha_nacimiento: '2006-08-22',
        foto_perfil: 'default.jpg',
        ultimo_acceso: '2024-06-01T11:00:00Z'
      }
    ];

    console.log('📊 Aplicando datos de prueba:', testEstudiantes);
    this.estudiantes = testEstudiantes;
    this.filteredEstudiantes = [...testEstudiantes];
    this.updatePaginatedEstudiantes();
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
    this.cargarEstudiantes();
  }
}
