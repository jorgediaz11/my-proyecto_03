import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadesService, Actividad, CreateActividadDto, UpdateActividadDto } from '../../../../services/actividades.service';
import { ColegiosService, Colegio } from '../../../../services/colegios.service';
import { TipoActividadService, TipoActividad } from '../../../../services/tipo-actividad.service';
import { NivelesService, Nivel } from '../../../../services/niveles.service';
import { GradosService } from '../../../../services/grados.service';
import { CursosService } from '../../../../services/cursos.service';
import Swal from 'sweetalert2';
import { ActividadesDetalleService } from '../../../../services/actividades-detalle.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-actividades',
    templateUrl: './actividades.component.html',
    styleUrls: ['./actividades.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ]
})
export class ActividadesComponent implements OnInit {
  // ✅ PROPIEDADES ESENCIALES
  actividades: Actividad[] = [];
  filteredActividades: Actividad[] = [];
  paginatedActividades: Actividad[] = [];
  niveles: Nivel[] = [];
  grados: { id_grado: number; nombre: string; nivel?: { id_nivel: number; nombre: string } }[] = [];
  cursos: { id_curso: number; nombre: string; grado?: { id_grado: number; nombre: string } }[] = [];
  filtroNivel = '';
  filtroGrado = '';
  filtroCurso = '';

  // ✅ CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  filtroTipo = '';
  filtroColegio = '';
  showForm = false;
  isEditing = false;
  editingActividadId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // ✅ FORMULARIO REACTIVO
  actividadForm!: FormGroup;

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math; // Para Math.min en paginación

  // ✅ CONFIGURACIÓN DE TIPOS
  tipos: TipoActividad[] = [];

  // ✅ COLEGIOS
  colegios: Colegio[] = [];

  // ✅ INYECCIÓN DE DEPENDENCIAS CON INJECT()
  private actividadesService = inject(ActividadesService);
  private fb = inject(FormBuilder);
  private colegiosService = inject(ColegiosService);
  private tipoActividadService = inject(TipoActividadService);
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);
  private cursosService = inject(CursosService);
  private actividadesDetalleService = inject(ActividadesDetalleService);

  constructor() {
    // Inicialización de propiedades si es necesario
  }

  // ✅ LIFECYCLE HOOKS
  ngOnInit(): void {
    this.initForm();
    this.cargarColegios();
    this.cargarTipos();
    this.cargarActividades();
    this.getNiveles();
    this.getGrados();
    this.getCursos();
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.actividadForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      fecha: ['', [Validators.required]],
      id_tipo: [1, [Validators.required]],
      id_colegio: [1, [Validators.required, Validators.min(1)]],
      estado: ['1', [Validators.required]]
    });
  }

  // ✅ CARGA DE DATOS
  cargarActividades(): void {
    this.loading = true;
    this.actividadesService.getActividades().subscribe({
      next: (actividades: Actividad[]) => {
        this.actividades = actividades || [];
        this.filteredActividades = [...this.actividades];
        this.updatePagination();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar actividades:', error);
        let msg = 'Error al cargar las actividades';
        const err = error as unknown;

        if (err && typeof err === 'object' && 'status' in err && (err as { status?: number }).status) {
          msg += `\nStatus: ${(err as { status?: number }).status}`;
        }
        if (
          err &&
          typeof err === 'object' &&
          'error' in err &&
          (err as { error?: { message?: string } }).error &&
          (err as { error?: { message?: string } }).error!.message
        ) {
          msg += `\nMensaje: ${(err as { error?: { message?: string } }).error!.message}`;
        } else if (err && typeof err === 'object' && 'message' in err && (err as { message?: string }).message) {
          msg += `\nMensaje: ${(err as { message?: string }).message}`;
        }

        this.showError(msg);
      }
    });
  }

  cargarColegios(): void {
    this.colegiosService.getColegiosClientes().subscribe({
      next: (colegios: Colegio[]) => {
        this.colegios = colegios || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar colegios:', error);
      }
    });
  }

  cargarTipos(): void {
    this.tipoActividadService.getTipoActividades().subscribe({
      next: (tipos: TipoActividad[]) => {
        this.tipos = tipos.filter(t => t.estado); // solo activos
      },
      error: (error: unknown) => {
        console.error('Error al cargar tipos de actividad:', error);
      }
    });
  }

  getNiveles(): void {
    this.nivelesService.getNiveles().subscribe({
      next: (niveles: Nivel[]) => {
        this.niveles = niveles || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar niveles:', error);
      }
    });
  }

  getGrados(): void {
    this.gradosService.getGrados().subscribe({
      next: (grados: { id_grado: number; nombre: string; nivel?: { id_nivel: number; nombre: string } }[]) => {
        this.grados = grados || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar grados:', error);
      }
    });
  }

  getCursos(): void {
    this.cursosService.getCursos().subscribe({
      next: (cursos: { id_curso: number; nombre: string; grado?: { id_grado: number; nombre: string } }[]) => {
        this.cursos = cursos || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar cursos:', error);
      }
    });
  }

  // ✅ MANEJO DE FILTROS
  onNivelChange(): void {
    this.filtroGrado = '';
    this.filtroCurso = '';
    this.cursos = [];

    if (this.filtroNivel) {
      const nivelId = Number(this.filtroNivel);
      this.gradosService.getGrados().subscribe({
        next: (grados: { id_grado: number; nombre: string; nivel?: { id_nivel: number; nombre: string } }[]) => {
          this.grados = grados.filter(g => typeof g.nivel === 'object' && g.nivel && 'id_nivel' in g.nivel && g.nivel.id_nivel === nivelId);
        },
        error: (err) => {
          console.error('Error cargando grados', err);
          this.grados = [];
        }
      });
    } else {
      this.grados = [];
    }
  }

  onGradoChange(): void {
    this.filtroCurso = '';

    if (this.filtroGrado) {
      const gradoId = Number(this.filtroGrado);
      this.cursosService.getCursos().subscribe({
        next: (cursos: { id_curso: number; nombre: string; grado?: { id_grado: number; nombre: string } }[]) => {
          this.cursos = cursos.filter(c => typeof c.grado === 'object' && c.grado && 'id_grado' in c.grado && c.grado.id_grado === gradoId);
        },
        error: (err) => {
          console.error('Error cargando cursos', err);
          this.cursos = [];
        }
      });
    } else {
      this.cursos = [];
    }
  }

  onCursoChange(): void {
    // Puede agregar lógica adicional si es necesario
  }

  filterActividades(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    let filtered = [...this.actividades];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(actividad =>
        actividad.titulo?.toLowerCase().includes(searchTerm) ||
        actividad.descripcion?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por tipo
    if (this.filtroTipo) {
      filtered = filtered.filter(actividad => actividad.id_tipo_actividad === Number(this.filtroTipo));
    }

    // Filtro por colegio
    if (this.filtroColegio) {
      filtered = filtered.filter(actividad => actividad.id_colegio === Number(this.filtroColegio));
    }

    this.filteredActividades = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  // ✅ PAGINACIÓN
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedActividades = this.filteredActividades.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    const totalPages = this.getTotalPages().length;
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredActividades.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // ✅ OPERACIONES CRUD
  createActividad(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingActividadId = undefined;
    this.activeTab = 'nuevo';
  }

  editActividad(id_actividad: number): void {
    this.loading = true;
    this.actividadesService.getActividadById(id_actividad).subscribe({
      next: (actividad: Actividad) => {
        this.isEditing = true;
        this.editingActividadId = id_actividad;
        this.activeTab = 'nuevo';

        this.actividadForm.patchValue({
          nombre: actividad.titulo,
          descripcion: actividad.descripcion,
          fecha: actividad.fecha_creacion,
          id_tipo: actividad.id_tipo_actividad,
          id_colegio: actividad.id_colegio || 1,
          estado: actividad.estado ? '1' : '0'
        });

        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar actividad:', error);
        this.showError('Error al cargar la actividad para edición');
      }
    });
  }

  deleteActividad(id_actividad: number): void {
    Swal.fire({
      title: '¿Eliminar Actividad?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.actividadesService.eliminarActividad(id_actividad).subscribe({
          next: () => {
            this.cargarActividades();
            this.showSuccess('Actividad eliminada correctamente');
          },
          error: (error: unknown) => {
            this.loading = false;
            console.error('Error al eliminar actividad:', error);
            this.showError('Error al eliminar la actividad');
          }
        });
      }
    });
  }

  // ✅ VISTA DE DETALLES
  viewActividad(id_actividad: number): void {
    Swal.fire({
      title: 'Cargando...',
      html: '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Cargando detalle de la actividad...</div>',
      showConfirmButton: false,
      allowOutsideClick: false,
      width: 900,
      heightAuto: false,
      customClass: {
        popup: 'swal-contenido-actividad'
      }
    });

    // Define a more specific interface for detalle actividad
    interface DetalleActividad {
      nombre_actividad: string;
      descripcion?: string;
      tipo_actividad: string;
      puntaje_actividad: string;
      opciones?: {
        nombre_opcion: string;
        es_correcta?: boolean;
        par_relacion?: string;
      }[];
    }

    this.actividadesDetalleService.getDetalleActividad(id_actividad).subscribe(
      (actividad: DetalleActividad) => {
        let html = `<div class='actividad-detalle-container' style='text-align:left;max-width:800px;'>`;
        html += `<h2 class='text-xl font-bold mb-2'>${actividad.nombre_actividad}</h2>`;

        if (actividad.descripcion) {
          html += `<div class='mb-2 text-gray-700'>${actividad.descripcion}</div>`;
        }

        html += `<div class='text-xs text-gray-500 mb-1'>Tipo: ${actividad.tipo_actividad} | Puntaje: ${actividad.puntaje_actividad}</div>`;

        if (actividad.opciones && actividad.opciones.length > 0) {
          html += `<div class='font-semibold text-green-700 mb-1'>Opciones</div><ul class='list-disc pl-5'>`;

          if (actividad.tipo_actividad === 'SELECCION') {
            actividad.opciones.forEach((opcion) => {
              html += `<li class='mb-1'><span class='text-gray-600'>${opcion.nombre_opcion}`;
              if (opcion.es_correcta) {
                html += ` <span class='text-green-600 font-bold'>(Correcta)</span>`;
              }
              html += `</span></li>`;
            });
          } else if (actividad.tipo_actividad === 'RELACION') {
            actividad.opciones.forEach((opcion) => {
              html += `<li class='mb-1'><span class='text-gray-600'>${opcion.nombre_opcion} <span class='text-blue-600'>→</span> ${opcion.par_relacion}</span></li>`;
            });
          } else {
            actividad.opciones.forEach((opcion) => {
              html += `<li class='mb-1'><span class='text-gray-600'>${opcion.nombre_opcion}</span></li>`;
            });
          }

          html += `</ul>`;
        } else {
          html += `<div class='text-sm text-gray-400 italic'>No hay opciones registradas para esta actividad.</div>`;
        }

        html += `</div>`;

        Swal.fire({
          title: 'Detalle de la Actividad',
          html: `<div style="max-height:700px;overflow:auto;">${html}</div>`,
          icon: 'info',
          width: 900,
          heightAuto: false,
          customClass: {
            popup: 'swal-contenido-actividad'
          }
        });
      },
      () => {
        Swal.fire({
          title: 'Error',
          html: 'No se pudo cargar el detalle de la actividad.',
          icon: 'error',
          width: 500
        });
      }
    );
  }

  detailActividad(id_actividad: number): void {
    const actividad = this.actividades.find(a => a.id_actividad === id_actividad);
    if (actividad) {
      Swal.fire({
        title: 'Detalle actividad',
        html: `<div><strong>ID:</strong> ${actividad.id_actividad}</div>
               <div><strong>Nombre:</strong> ${actividad.titulo}</div>
               <div><strong>Descripción:</strong> ${actividad.descripcion}</div>
               <div><strong>Estado:</strong> ${actividad.estado ? 'Activo' : 'Inactivo'}</div>`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4EAD4F'
      });
    }
  }

  // ✅ SUBMIT FORMULARIO
  onSubmit(): void {
    if (this.actividadForm.invalid) {
      this.markFormGroupTouched();
      this.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    this.loading = true;
    const formData = this.prepareFormData();

    if (this.isEditing && this.editingActividadId) {
      this.updateActividadLogic(formData as UpdateActividadDto);
    } else {
      this.createActividadLogic(formData as CreateActividadDto);
    }
  }

  // ✅ LÓGICA DE CREACIÓN Y ACTUALIZACIÓN
  private createActividadLogic(formData: CreateActividadDto): void {
    this.actividadesService.crearActividad(formData as Actividad).subscribe({
      next: () => {
        this.cargarActividades();
        this.resetForm();
        this.activeTab = 'tabla';
        this.showSuccess('Actividad creada correctamente');
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al crear actividad:', error);
        this.showError('Error al crear la actividad');
      }
    });
  }

  private updateActividadLogic(formData: UpdateActividadDto): void {
    this.actividadesService.actualizarActividad(this.editingActividadId!, formData).subscribe({
      next: () => {
        this.cargarActividades();
        this.resetForm();
        this.activeTab = 'tabla';
        this.showSuccess('Actividad actualizada correctamente');
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al actualizar actividad:', error);
        this.showError('Error al actualizar la actividad');
      }
    });
  }

  // ✅ UTILIDADES
  private prepareFormData(): CreateActividadDto | UpdateActividadDto {
    const formValue = this.actividadForm.value;

    if (!this.isEditing) {
      return {
        titulo: formValue.titulo.trim(),
        descripcion: formValue.descripcion.trim(),
        fecha: formValue.fecha,
        id_tipo_actividad: Number(formValue.id_tipo),
        id_colegio: Number(formValue.id_colegio),
        estado: formValue.estado === '1'
      } as CreateActividadDto;
    } else {
      return {
        id_actividad: this.editingActividadId!,
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion.trim(),
        fecha: formValue.fecha,
        id_tipo: Number(formValue.id_tipo),
        id_colegio: Number(formValue.id_colegio),
        estado: formValue.estado === '1'
      } as UpdateActividadDto;
    }
  }

  resetForm(): void {
    this.actividadForm.reset({
      id_tipo: 1,
      id_colegio: 1,
      estado: '1'
    });
    this.isEditing = false;
    this.editingActividadId = undefined;
  }

  getTipoName(id_tipo: number): string {
    const tipo = this.tipos.find(t => t.id_tipo_actividad === id_tipo);
    return tipo ? tipo.nombre : 'Sin definir';
  }

  trackByActividadId(index: number, actividad: Actividad): number | undefined {
    return actividad.id_actividad;
  }

  // ✅ NAVEGACIÓN Y UI
  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.editingActividadId = undefined;
      this.actividadForm.reset({
        id_tipo: 1,
        id_colegio: 1,
        estado: '1'
      });
    }
  }

  onPageChange(page: number): void {
    this.changePage(page);
  }

  // ✅ FECHA EN ESPAÑOL PARA EL TEMPLATE
  get todayES(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // ✅ HELPERS
  private markFormGroupTouched(): void {
    Object.keys(this.actividadForm.controls).forEach(key => {
      const control = this.actividadForm.get(key);
      control?.markAsTouched();
    });
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  private resetFilters(): void {
    this.searchTerm = '';
    this.filtroTipo = '';
    this.filtroColegio = '';
    this.cargarActividades();
  }
}
