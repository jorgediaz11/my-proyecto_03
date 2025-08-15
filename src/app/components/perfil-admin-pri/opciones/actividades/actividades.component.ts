import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActividadesService, Actividad, CreateActividadDto, UpdateActividadDto } from '../../../../services/actividades.service';
import { ColegiosService, Colegio } from '../../../../services/colegios.service';
import { TipoActividadService, TipoActividad } from '../../../../services/tipo-actividad.service';
import { NivelesService } from '../../../../services/niveles.service';
import { GradosService } from '../../../../services/grados.service';
import { CursosService } from '../../../../services/cursos.service';
import Swal from 'sweetalert2';
import { ActividadesDetalleService } from '../../../../services/actividades-detalle.service';

@Component({
    selector: 'app-actividades',
    templateUrl: './actividades.component.html',
    styleUrls: ['./actividades.component.css'],
    standalone: false
})

export class ActividadesComponent implements OnInit {
  // ✅ PROPIEDADES ESENCIALES
  actividades: Actividad[] = [];
  filteredActividades: Actividad[] = [];
  paginatedActividades: Actividad[] = [];
    niveles: any[] = [];
    grados: any[] = [];
    cursos: any[] = [];
    filtroNivel: string = '';
    filtroGrado: string = '';
    filtroCurso: string = '';

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

  // ✅ FECHA EN ESPAÑOL PARA EL TEMPLATE
  get todayES(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // ✅ CONFIGURACIÓN DE TIPOS
  tipos: TipoActividad[] = [];

  // ✅ INYECCIÓN DE DEPENDENCIAS CON INJECT()
  private actividadesService = inject(ActividadesService);
  private fb = inject(FormBuilder);
  private colegiosService = inject(ColegiosService);
  private tipoActividadService = inject(TipoActividadService);
    private nivelesService = inject(NivelesService);
    private gradosService = inject(GradosService);
    private cursosService = inject(CursosService);
  private actividadesDetalleService = inject(ActividadesDetalleService);

  // ✅ COLEGIOS
  colegios: Colegio[] = [];

  constructor() {
    this.initForm();
  }


    // Mostrar detalles de la actividad
    detailActividad(id_actividad: number): void {
      const actividad = this.actividades.find(a => a.id_actividad === id_actividad);
      if (actividad) {
        Swal.fire({
          title: 'Detalle actividad',
          html: `<div><strong>ID:</strong> ${actividad.id_actividad}</div>
                 <div><strong>Nombre:</strong> ${actividad.nombre}</div>
                 <div><strong>Descripción:</strong> ${actividad.descripcion}</div>
                 <div><strong>Estado:</strong> ${actividad.estado ? 'Activo' : 'Inactivo'}</div>`,
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4EAD4F'
        });
      }
    }

    // Paginación desde el HTML
    onPageChange(page: number): void {
      this.changePage(page);
    }

    // Cambiar de pestaña y resetear el formulario
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
  ngOnInit(): void {
    this.cargarColegios();
    this.cargarTipos();
    this.cargarActividades();
    this.getNiveles();
    this.getGrados();
    this.getCursos();
  }
  // Métodos para cargar selectores
  getNiveles(): void {
    this.nivelesService.getNiveles().subscribe({
      next: (niveles: any[]) => {
        this.niveles = niveles || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar niveles:', error);
      }
    });
  }

  getGrados(): void {
    this.gradosService.getGrados().subscribe({
      next: (grados: any[]) => {
        this.grados = grados || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar grados:', error);
      }
    });
  }

  getCursos(): void {
    this.cursosService.getCursos().subscribe({
      next: (cursos: any[]) => {
        this.cursos = cursos || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar cursos:', error);
      }
    });
  }

  onNivelChange(): void {
    this.filtroGrado = '';
    this.filtroCurso = '';
    this.cursos = [];
    if (this.filtroNivel) {
      const nivelId = Number(this.filtroNivel);
      this.gradosService.getGrados().subscribe({
        next: (grados: any[]) => {
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
        next: (cursos: any[]) => {
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

  // ✅ INICIALIZACIÓN DEL FORMULARIO

  private initForm(): void {
    this.actividadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      fecha: ['', [Validators.required]],
      id_tipo: [1, [Validators.required]],
      id_colegio: [1, [Validators.required, Validators.min(1)]],
      estado: ['1', [Validators.required]]
    });
  }

  // ✅ VALIDADOR DE CONTRASEÑAS

  // (Si se requiere validación personalizada, agregar aquí)

  // ✅ CARGA DE USUARIOS

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
        // Mostrar detalles del error en consola y en el alert
        console.error('Error al cargar actividades:', error);
        let msg = 'Error al cargar las actividades';
        const err = error as any;
        if (err && typeof err === 'object' && 'status' in err && err.status) {
          msg += `\nStatus: ${err.status}`;
        }
        if (err && typeof err === 'object' && err.error && err.error.message) {
          msg += `\nMensaje: ${err.error.message}`;
        } else if (err && typeof err === 'object' && err.message) {
          msg += `\nMensaje: ${err.message}`;
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

  // ✅ FILTRADO

  filterActividades(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    let filtered = [...this.actividades];
    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(actividad =>
        actividad.nombre?.toLowerCase().includes(searchTerm) ||
        actividad.descripcion?.toLowerCase().includes(searchTerm)
      );
    }
    // Filtro por tipo
    if (this.filtroTipo) {
      filtered = filtered.filter(actividad => actividad.id_tipo === Number(this.filtroTipo));
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

  // ✅ CREAR USUARIO

  createActividad(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingActividadId = undefined;
    this.activeTab = 'nuevo';
  }

  // ✅ EDITAR USUARIO

  editActividad(id_actividad: number): void {
    this.loading = true;
    this.actividadesService.getActividadById(id_actividad).subscribe({
      next: (actividad: Actividad) => {
        this.isEditing = true;
        this.editingActividadId = id_actividad;
        this.activeTab = 'nuevo';

        this.actividadForm.patchValue({
          nombre: actividad.nombre,
          descripcion: actividad.descripcion,
          fecha: actividad.fecha,
          id_tipo: actividad.id_tipo,
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

  // ✅ VER USUARIO

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

  this.actividadesDetalleService.getDetalleActividad(id_actividad).subscribe(
    (actividad: any) => {
      let html = `<div class='actividad-detalle-container' style='text-align:left;max-width:800px;'>`;
      html += `<h2 class='text-xl font-bold mb-2'>${actividad.nombre_actividad}</h2>`;
      if (actividad.descripcion) {
        html += `<div class='mb-2 text-gray-700'>${actividad.descripcion}</div>`;
      }
      html += `<div class='text-xs text-gray-500 mb-1'>Tipo: ${actividad.tipo_actividad} | Puntaje: ${actividad.puntaje_actividad}</div>`;
      if (actividad.opciones && actividad.opciones.length > 0) {
        html += `<div class='font-semibold text-green-700 mb-1'>Opciones</div><ul class='list-disc pl-5'>`;
        if (actividad.tipo_actividad === 'SELECCION') {
          actividad.opciones.forEach((opcion: any, i: number) => {
            html += `<li class='mb-1'><span class='text-gray-600'>${String.fromCharCode(65 + i)}. ${opcion.nombre_opcion}`;
            if (opcion.es_correcta) {
              html += ` <span class='text-green-600 font-bold'>(Correcta)</span>`;
            }
            html += `</span></li>`;
          });
        } else if (actividad.tipo_actividad === 'RELACION') {
          actividad.opciones.forEach((opcion: any) => {
            html += `<li class='mb-1'><span class='text-gray-600'>${opcion.nombre_opcion} <span class='text-blue-600'>→</span> ${opcion.par_relacion}</span></li>`;
          });
        } else {
          actividad.opciones.forEach((opcion: any, i: number) => {
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

  // ✅ ELIMINAR USUARIO

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

  // ✅ CREAR USUARIO - LOGICA

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

  // ✅ ACTUALIZAR USUARIO - LOGICA

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
      // Actualizar actividad existente
      this.updateActividadLogic(formData as UpdateActividadDto);
    } else {
      // Crear nueva actividad
      this.createActividadLogic(formData as CreateActividadDto);
    }
  }

  // ✅ PREPARAR DATOS - VERSIÓN CORREGIDA

  private prepareFormData(): CreateActividadDto | UpdateActividadDto {
    const formValue = this.actividadForm.value;

    if (!this.isEditing) {
      // Crear nueva actividad: incluir todos los campos requeridos
      const actividadData: CreateActividadDto = {
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion.trim(),
        fecha: formValue.fecha,
        id_tipo: Number(formValue.id_tipo),
        id_colegio: Number(formValue.id_colegio),
        estado: formValue.estado === '1'
      };
      return actividadData;
    } else {
      // Actualizar actividad: incluir id_actividad y campos que pueden cambiar
      const actividadData: UpdateActividadDto = {
        id_actividad: this.editingActividadId!,
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion.trim(),
        fecha: formValue.fecha,
        id_tipo: Number(formValue.id_tipo),
        id_colegio: Number(formValue.id_colegio),
        estado: formValue.estado === '1'
      };
      return actividadData;
    }
  }

  // ✅ RESET FORM

  resetForm(): void {
    this.actividadForm.reset({
      id_tipo: 1,
      id_colegio: 1,
      estado: '1'
    });
    this.isEditing = false;
    this.editingActividadId = undefined;
  }

  // ✅ UTILIDADES

  getTipoName(id_tipo: number): string {
    const tipo = this.tipos.find(t => t.id_tipo_actividad === id_tipo);
    return tipo ? tipo.nombre : 'Sin definir';
  }


  trackByActividadId(index: number, actividad: Actividad): number | undefined {
    return actividad.id_actividad;
  }


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
