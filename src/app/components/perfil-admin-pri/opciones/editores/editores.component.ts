import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { ColegiosService, Colegio } from 'src/app/services/colegios.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Editor, EditoresService, CreateEditorDto, UpdateEditorDto } from 'src/app/services/editores.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editores',
  templateUrl: './editores.component.html',
  styleUrls: ['./editores.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditoresComponent implements OnInit, OnDestroy {
  // Servicio de editores
  private editoresService = inject(EditoresService);
  private colegiosService = inject(ColegiosService);
  //private familiaService = inject(EditoresService); // <-- Add this line to inject the service used for familia operations
  //private ubigeoService = inject(UbigeoService);
  // ✅ PROPIEDADES ESENCIALES
  editores: Editor[] = [];
  filteredEditores: Editor[] = [];
  paginatedEditores: Editor[] = [];

  colegios: Colegio[] = [];
  filtroColegio = '';
  filtroEditor = '';
  //filteredEditores: Editor[] = [];

  // Ejemplo de cómo consumir editor:
  // Método eliminado porque no se utiliza y el parámetro 'editor' no es usado.

  // ✅ CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  isEditing = false;
  editingEditorId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // ✅ FORMULARIO REACTIVO
  editorForm!: FormGroup;

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // ✅ TRACKBY FUNCTION FOR PERFORMANCE
  trackByEditorId(index: number, editor: Editor): number {
    return editor.id_editor || index;
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
  // Estas opciones se mantienen si el editores puede ser asignado a niveles o turnos
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
    this.cargarEditores();
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
    this.filterEditores(); // Cambiado a filterEditores
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
    this.filterEditores(); // Cambiado a filterEditores
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.editorForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.email]],
      telefono: [''],
      fecha_nacimiento: [''],
      estado: [true, Validators.required], // boolean
      colegio: [null, Validators.required], // number (por [ngValue]="col.id_colegio")
      foto_perfil: [''],
      ultimo_acceso: ['']
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

  // ✅ CARGA DE EDITORES
  cargarEditores(): void {
    console.log('🔄 Iniciando carga de editores...');
    console.log('🔗 Endpoint configurado:', 'http://localhost:3000/editores'); // Ajustar endpoint
    console.log('🔧 Interceptors que se ejecutarán automáticamente:');
    console.log('   1. 🔑 AuthInterceptor → Agrega token JWT');
    console.log('   2. 📝 LoggingInterceptor → Registra request');
    console.log('   3. ⏳ LoadingInterceptor → Muestra spinner');
    console.log('   4. 🚨 ErrorInterceptor → Maneja errores (si ocurren)');

    this.loading = true;

    console.log('📡 Llamando this.editoresService.getEditores()...');
    this.editoresService.getEditores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          // Si la respuesta es un array directo
          if (Array.isArray(data)) {
            console.log('✅ INTERCEPTORS COMPLETADOS - Datos recibidos del endpoint:');
            console.log('📊 Cantidad de editores:', data.length);
            console.log('🔍 Datos completos recibidos:', data);
            this.editores = data;
            this.filteredEditores = [...data];
            this.updatePaginatedEditores();
            this.loading = false;
            if (data.length === 0) {
              console.warn('⚠️ No se encontraron editores en la base de datos');
              this.showEmptyState();
            }
          } else if (data && Array.isArray(data.data)) {
            // Si la respuesta es un objeto con propiedad data
            console.log('✅ INTERCEPTORS COMPLETADOS - Datos recibidos del endpoint:');
            console.log('📊 Cantidad de editores:', data.data.length);
            console.log('🔍 Datos completos recibidos:', data);
            this.editores = data.data;
            this.filteredEditores = [...data.data];
            this.updatePaginatedEditores();
            this.loading = false;
            if (data.data.length === 0) {
              console.warn('⚠️ No se encontraron editores en la base de datos');
              this.showEmptyState();
            }
          } else {
            // Respuesta inesperada
            this.loading = false;
            console.error('❌ Respuesta inesperada del endpoint:', data);
            this.handleError('Error al cargar editores: respuesta inesperada del servidor');
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
          this.handleError(`Error al cargar editores: ${error.message}`);
          this.showEmptyState();
        }
      });
  }

  // ✅ FILTRADO DE EDITORES

  // ✅ ACTUALIZACIÓN DE PAGINACIÓN DE EDITORES
  updatePaginatedEditores(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEditores = this.filteredEditores.slice(startIndex, endIndex);
  }

  // ✅ ACTUALIZACIÓN DE PAGINACIÓN
  // updatePaginatedEditores(): void {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.paginatedEditores = this.filteredEditores.slice(startIndex, endIndex);
  // }

  // ✅ CAMBIO DE PÁGINA
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEditores();
  }

  // ✅ CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // ✅ CREAR NUEVO EDITOR
  createEditor(): void {
    this.activeTab = 'nuevo';
    this.isEditing = false;
    this.editingEditorId = undefined;
    this.editorForm.reset();
    this.editorForm.patchValue({
      estado: true,
      foto_perfil: '',
      ultimo_acceso: ''
    });
  }

  // ✅ GUARDAR FAMILIA
  saveEditor(): void {
    if (this.editorForm.invalid) {
      this.markFormGroupTouched();
      this.handleError('Por favor corrige los errores en el formulario');
      return;
    }

    this.loading = true;
    const formData = this.editorForm.value;

    if (this.isEditing && this.editingEditorId) {
      // Actualizar editores existente
      const updateData: UpdateEditorDto = {
        id_editor: this.editingEditorId,
        ...formData
      };

      this.editoresService.actualizarEditor(this.editingEditorId, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Editor actualizado exitosamente');
            this.cargarEditores();
            this.cancelEdit();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al actualizar el editores');
            console.error('Error:', error);
          }
        });
    } else {
      // Crear nuevo editores
      const createData: CreateEditorDto = formData;

      this.editoresService.crearEditor(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Editor creado exitosamente');
            this.cargarEditores();
            this.cancelEdit();
          },
          error: (error) => {
            this.loading = false;
            this.handleError('Error al crear el editores');
            console.error('Error:', error);
          }
        });
    }
  }

  // ✅ EDITAR EDITORES
  editEditor(id_editor: number): void {
    const editores = this.editores.find(e => e.id_editor === id_editor);
    if (!editores) {
      this.handleError('Editor no encontrado');
      return;
    }

    this.isEditing = true;
    this.editingEditorId = id_editor;
    this.activeTab = 'nuevo';

    this.editorForm.patchValue({
      nombres: editores.nombres,
      apellido: editores.apellido,
      correo: editores.correo,
      telefono: editores.telefono || '',
      fecha_nacimiento: editores.fecha_nacimiento || '',
      estado: editores.estado,
      colegio: editores.id_colegio || null,
      foto_perfil: editores.foto_perfil || '',
      ultimo_acceso: editores.ultimo_acceso || ''
    });
  }

  // ✅ ELIMINAR EDITOR
  deleteEditor(id_editor: number): void {
    const editores = this.editores.find(e => e.id_editor === id_editor);
    if (!editores) {
      this.handleError('Editor no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Editor?',
      text: `¿Estás seguro de que deseas eliminar a "${editores.nombres} ${editores.apellido}"?`,
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
        this.editoresService.eliminarEditor(id_editor)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              this.handleSuccess('Editor eliminado exitosamente');
              this.cargarEditores();
            },
            error: (error) => {
              this.loading = false;
              this.handleError('Error al eliminar el editores');
              console.error('Error:', error);
            }
          });
      }
    });
  }

  // ✅ VER DETALLES DEL EDITOR
  viewEditor(id_editor: number): void {
    const editor = this.editores.find(e => e.id_editor === id_editor);
    if (!editor) {
      this.handleError('Editor no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Editor`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${editor.nombres}</p>
          <p><strong>Apellidos:</strong> ${editor.apellido}</p>
          <p><strong>Correo:</strong> ${editor.correo}</p>
          <p><strong>Teléfono:</strong> ${editor.telefono || ''}</p>
          <p><strong>Fecha nacimiento:</strong> ${editor.fecha_nacimiento || ''}</p>
          <p><strong>Estado:</strong> ${editor.estado ? 'Activo' : 'Inactivo'}</p>
          <p><strong>Colegio:</strong> ${editor.id_colegio || ''}</p>
          <p><strong>Foto perfil:</strong> ${editor.foto_perfil ? `<img src='${editor.foto_perfil}' alt='Foto perfil' width='60'/>` : 'No disponible'}</p>
          <p><strong>Último acceso:</strong> ${editor.ultimo_acceso || 'No disponible'}</p>
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
    this.editingEditorId = undefined;
    this.editorForm.reset();
    this.editorForm.patchValue({
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
        this.editorForm.reset();
        this.editorForm.patchValue({
          estado: true
        });
      }
    });
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.editorForm.controls).forEach(key => {
      const control = this.editorForm.get(key);
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
    const totalPages = Math.ceil(this.filteredEditores.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // ✅ GETTER PARA FORMULARIO
  get f() {
    return this.editorForm.controls;
  }

  // ✅ VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.editorForm.valid && !this.loading;
  }

  // ✅ MÉTODOS FALTANTES REQUERIDOS POR EL HTML
  onViewEditorKey(event: KeyboardEvent, id_editor: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.viewEditor(id_editor);
    }
  }

  onEditEditorKey(event: KeyboardEvent, id_editor: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.editEditor(id_editor);
    }
  }

  onDeleteEditorKey(event: KeyboardEvent, id_editor: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.deleteEditor(id_editor);
    }
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Foto seleccionada:', file.name);
      // Aquí implementarías la lógica para subir la foto del editores
    }
  }

  cancelCreate(): void {
    this.cancelEdit();
  }

  // ✅ PROPIEDADES ADICIONALES PARA EL TEMPLATE HTML
  private showEmptyState(): void {
    this.editores = [];
    this.filteredEditores= [];
    this.paginatedEditores = [];

    console.log('📋 Estado vacío configurado');
    console.log('💡 Para cargar datos reales:');
    console.log('   1. Asegúrate de que el backend esté corriendo en http://localhost:3000');
    console.log('   2. Verifica que el endpoint /editores esté disponible'); // Ajustar endpoint
    console.log('   3. Revisa que haya datos en la base de datos');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN CON EL ENDPOINT
  testEndpointConnection(): void {
    console.log('🧪 TESTING ENDPOINT CONNECTION...');
    console.log('🔗 URL del endpoint:', 'http://localhost:3000/editores'); // Ajustar endpoint
    console.log('🔧 Interceptors activos:', ['AuthInterceptor', 'LoggingInterceptor', 'ErrorInterceptor', 'LoadingInterceptor']);

    // Verificar si el servicio está inyectado correctamente
    if (this.editoresService) {
      console.log('✅ EditorService inyectado correctamente');
    } else {
      console.error('❌ EditorService NO está inyectado');
    }

    console.log('📡 La carga de datos se realizará automáticamente en cargarEditores()');
    console.log('🚫 Ya NO se cargan datos de prueba automáticamente');
  }

  // ✅ MÉTODO PARA PROBAR LA CONEXIÓN DIRECTA CON EL ENDPOINT
  testConnection(): void {
    console.log('🧪 PROBANDO CONEXIÓN DIRECTA CON EL ENDPOINT...');
    console.log('🔗 URL:', 'http://localhost:3000/editores'); // Ajustar endpoint

    this.loading = true;
    this.editoresService.getEditores() // Usar el servicio de editores
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          const data = response.data; // Array of Editor
          console.log('✅ CONEXIÓN EXITOSA!');
          console.log('📊 Respuesta completa:', response);
          console.log('📋 Tipo de respuesta:', typeof data);
          console.log('🔍 Es array?', Array.isArray(data));

          if (Array.isArray(data)) {
            console.log('📊 Cantidad de elementos:', data.length);
            data.forEach((item: Editor, index: number) => {
              console.log(`🧑‍🎓 Editor ${index + 1}:`, item); // Icono y texto ajustado
            });
          }

          // Forzar actualización de datos
          //this.editores = Array.isArray(data) ? data : data.data;
          //this.filteredEstudiantes = [...(Array.isArray(data) ? data : data.data)];
          this.updatePaginatedEditores();
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
    console.warn('📝 Los datos reales deben venir del endpoint: http://localhost:3000/editores'); // Ajustar endpoint

    const testEditores: Editor[] = [
      {
        id_editor: 1,
        nombres: 'González Flores',
        apellido: 'González Flores',
        estado: true,
        id_perfil: 1,
        id_colegio: 1,
        correo: 'gonzalez.flores@example.com'
      },
      {
        id_editor: 2,
        nombres: 'Ramírez Soto',
        apellido: 'Ramírez Soto',
        estado: true,
        id_perfil: 2,
        id_colegio: 1,
        correo: 'ramirez.soto@example.com'
      },
      {
        id_editor: 3,
        nombres: 'Ramírez Soto',
        apellido: 'Ramírez Soto',
        estado: true,
        id_perfil: 3,
        id_colegio: 1,
        correo: 'ramirez.soto2@example.com'
      }
    ];

    console.log('📊 Aplicando datos de prueba:', testEditores);
    this.editores = testEditores;
    this.filteredEditores = [...testEditores];
    this.updatePaginatedEditores();
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
    this.cargarEditores();
  }

  // ✅ FILTRAR EDITORES SEGÚN CRITERIOS
  filterEditores(): void {
    let filtered = [...this.editores];

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(editor =>
        editor.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        editor.apellido.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filtroColegio) {
      filtered = filtered.filter(editor =>
        editor.id_colegio?.toString() === this.filtroColegio
      );
    }

  // Los filtros de departamento, provincia y distrito se eliminan porque Editor no tiene esas propiedades

    this.filteredEditores = filtered;
    this.currentPage = 1;
    this.updatePaginatedEditores();
  }
}
