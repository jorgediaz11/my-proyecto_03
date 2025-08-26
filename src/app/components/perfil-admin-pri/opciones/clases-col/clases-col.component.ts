
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ClasesColService, ClaseCol as ClaseColApi, CreateClaseColDto, UpdateClaseColDto } from 'src/app/services/clases-col.service';
import { ColegiosService, Colegio } from 'src/app/services/colegios.service';
import { ClaseColDetalle } from 'src/app/services/clases-col.service';
import Swal from 'sweetalert2';

// Interfaz local para visualización (puedes ajustarla si necesitas mostrar más campos)
export interface ClaseCol {
  id_clases?: number;
  id_colegio: number;
  id_docente: number;
  id_nivel: number;
  id_grado: number;
  id_seccion: number;
  id_curso: number;
  nombre?: string; // Agregado para evitar error de propiedad
  //grado?: string; // Agregado para evitar error de propiedad
  //seccion?: string; // Agregado para evitar error de propiedad
  observaciones?: string | null;
  estado: boolean;
}

@Component({
    selector: 'app-clases-col',
    templateUrl: './clases-col.component.html',
    styleUrl: './clases-col.component.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})

export class ClasesColComponent implements OnInit, OnDestroy {
  // PROPIEDADES ESENCIALES
  clases: ClaseCol[] = [];
  filteredClases: ClaseCol[] = [];
  paginatedClases: ClaseCol[] = [];
  clasesDetalle: ClaseColDetalle[] = [];

  // CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  isEditing = false;
  editingClaseId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // FORMULARIO REACTIVO
  claseForm!: FormGroup;

  // CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // UBIGEO
  private fb = inject(FormBuilder);
  private clasesColService = inject(ClasesColService);
  private colegiosService = inject(ColegiosService);

  colegios: Colegio[] = [];
  filtroColegio: string = '';

  // PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // OPCIONES DE NIVELES Y TURNOS
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

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    //this.cargarClasesCol();
    this.cargarColegios();
    this.cargarClasesColDetalle(); // <-- Agrega aquí si lo necesitas
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

  cargarClasesCol(): void {
    this.loading = true;
    this.clasesColService.getClasesCol().subscribe({
      next: (data: ClaseColApi[]) => {
        this.clases = data.map(item => ({
          ...item,
          //nombre: item.nombre ?? '', // Asegura que 'nombre' siempre esté presente
          //grado: item.grado ?? '',
          //seccion: item.seccion ?? '',
          observaciones: item.observaciones ?? null,
          estado: item.estado ?? true
        }));
        this.filteredClases = [...this.clases];
        this.updatePaginatedClases();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.handleError('Error al cargar clases');
      }
    });
  }

  cargarClasesColDetalle(): void {
    this.loading = true;
    this.clasesColService.getClasesColDetalle().subscribe({
    next: (data: ClaseColDetalle[]) => {
      this.clasesDetalle = data;
      this.loading = false; // <-- Agrega esto
    },
      error: () => {
        this.loading = false;
        this.handleError('Error al cargar el detalle de clases');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TRACKBY FUNCTION
  trackByClaseId(index: number, clase: ClaseCol): number {
    return clase.id_clases || index;
  }

  // FECHA EN ESPAÑOL
  get todayES(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.claseForm = this.fb.group({
      //nombre: ['', [Validators.required, Validators.minLength(3)]],
      //grado: ['', [Validators.required]],
      //seccion: ['', [Validators.required]],
      //turno: ['', [Validators.required]],
      id_colegio: [null, [Validators.required]],
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      estado: [true, [Validators.required]],
      observaciones: ['']
    });
  }

  // FILTRADO DE CLASES
  filterClases(): void {
    let filtered = [...this.clases];
    if (this.filtroColegio) {
      filtered = filtered.filter(clase => String(clase.id_colegio) === this.filtroColegio);
    }
    this.filteredClases = filtered;
    this.currentPage = 1;
    this.updatePaginatedClases();
  }

  // ACTUALIZACIÓN DE PAGINACIÓN
  updatePaginatedClases(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClases = this.filteredClases.slice(startIndex, endIndex);
  }

  // CAMBIO DE PÁGINA
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedClases();
  }

  // CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // CREAR NUEVA CLASE
  createClase(): void {
    this.activeTab = 'nuevo';
    this.isEditing = false;
    this.editingClaseId = undefined;
    this.claseForm.reset();
    this.claseForm.patchValue({
      estado: true
    });
  }

  // GUARDAR CLASE
  saveClase(): void {
    if (this.claseForm.invalid) {
      this.markFormGroupTouched();
      this.handleError('Por favor corrige los errores en el formulario');
      return;
    }
    this.loading = true;
    const formData = this.claseForm.value;
    if (this.isEditing && this.editingClaseId) {
      // Actualizar clase existente
      const updateData: UpdateClaseColDto = { ...formData };
      this.clasesColService.actualizarClaseCol(this.editingClaseId, updateData).subscribe({
        next: () => {
          this.handleSuccess('Clase actualizada exitosamente');
          this.cargarClasesCol();
          this.cancelEdit();
        },
        error: () => {
          this.loading = false;
          this.handleError('Error al actualizar la clase');
        }
      });
    } else {
      // Crear nueva clase
      const createData: CreateClaseColDto = { ...formData };
      this.clasesColService.crearClaseCol(createData).subscribe({
        next: () => {
          this.handleSuccess('Clase creada exitosamente');
          this.cargarClasesCol();
          this.cancelEdit();
        },
        error: () => {
          this.loading = false;
          this.handleError('Error al crear la clase');
        }
      });
    }
  }

  // EDITAR CLASE
  editClase(id_clases: number): void {
    const clase = this.clases.find(c => c.id_clases === id_clases);
    if (!clase) {
      this.handleError('Clase no encontrada');
      return;
    }
    this.isEditing = true;
    this.editingClaseId = id_clases;
    this.activeTab = 'nuevo';
    this.claseForm.patchValue(clase);
  }

  deleteClase(id_clases: number): void {
    const clase = this.clases.find(c => c.id_clases === id_clases);
    if (!clase) {
      this.handleError('Clase no encontrada');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Clase?',
      text: `¿Estás seguro de que deseas eliminar la clase "${clase.nombre ?? id_clases}"?`,
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
        this.clasesColService.eliminarClaseCol(id_clases).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Clase eliminada correctamente');
            this.cargarClasesCol();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar la clase');
            console.error('Error:', error);
          }
        });
      }
    });
  }

  viewClase(id_clases: number): void {
    alert('Ver detalles de la clase: ' + id_clases);
    const clase = this.clases.find(p => p.id_clases === id_clases);
    if (clase) {
      Swal.fire({
        title: 'Detalle perfil',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${clase.id_clases}</p>
            <p><strong>Estado:</strong> ${clase.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  detailClase(id_clases: number): void {
    alert('Ver detalles de la clase 02 : ' + id_clases);
    const clase = this.clases.find(p => p.id_clases === id_clases);
    if (clase) {
      Swal.fire({
        title: 'Detalle perfil',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${clase.id_clases}</p>
            <p><strong>Estado:</strong> ${clase.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  // CANCELAR EDICIÓN
  cancelEdit(): void {
    this.isEditing = false;
    this.editingClaseId = undefined;
    this.claseForm.reset();
    this.claseForm.patchValue({
      estado: true
    });
    this.activeTab = 'tabla';
  }

  // LIMPIAR FORMULARIO
  resetForm(): void {
    this.claseForm.reset();
    this.claseForm.patchValue({
      estado: true
    });
  }

  // MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.claseForm.controls).forEach(key => {
      const control = this.claseForm.get(key);
      control?.markAsTouched();
    });
  }

  // PAGINACIÓN - TOTAL DE PÁGINAS
  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredClases.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // GETTER PARA FORMULARIO
  get f() {
    return this.claseForm.controls;
  }

  // VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.claseForm.valid && !this.loading;
  }

  // MÉTODOS PARA EL LOGO (NO IMPLEMENTADO)
  // onLogoChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const file = input.files?.[0];
  //   if (file) {
  //     // Aquí implementarías la lógica para subir el logo
  //     alert('Logo seleccionado: ' + file.name);
  //   }
  // }

  // MÉTODO DE FILTRO DE COLEGIOS (placeholder, sin lógica)
  //filterDocentes(): void {
    // Aquí se implementará el filtrado de docentes por colegio si se requiere
  //}

  changePageDetalle(page: number): void {
    this.currentPage = page;
  }

  get filteredClasesDetalle(): ClaseColDetalle[] {
    // Aplica aquí tus filtros sobre clasesDetalle
    // Ejemplo: por colegio
    if (this.filtroColegio) {
      return this.clasesDetalle.filter(c => c.id_colegio === Number(this.filtroColegio));
    }
    return this.clasesDetalle;
  }

  get paginatedClasesDetalle(): ClaseColDetalle[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredClasesDetalle.slice(start, start + this.itemsPerPage);
  }

  get totalClasesDetalle(): number {
    return this.filteredClasesDetalle.length;
  }

  get totalPagesDetalle(): number[] {
    return Array(Math.ceil(this.totalClasesDetalle / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
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

}
