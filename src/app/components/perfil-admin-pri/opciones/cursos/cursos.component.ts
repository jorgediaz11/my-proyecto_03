import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CursosService, Curso } from '../../../../services/cursos.service';
import { CursosDetalleService } from 'src/app/services/cursos-detalle.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})

export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  filteredCursos: Curso[] = [];
  paginatedCursos: Curso[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchCurso = '';
  activeTab: 'tabla' | 'nuevo' = 'tabla';
  showForm = false;
  loading = false;

  tipoCurso = 'ambos';

  // Niveles y grados para los selectores
  niveles: Nivel[] = [];
  grados: Grado[] = [];
  allGrados: Grado[] = [];
  selectedNivel: number | '' = '';
  selectedGrado: number | '' = '';

  // Formularios
  cursoForm!: FormGroup;
  editandoCurso = false;

  private cursosService = inject(CursosService);
  private cursosDetalleService = inject(CursosDetalleService);
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.getNiveles();
    this.getCursos();
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo_libro: [''],
      area: ['', Validators.required],
      grado: ['', Validators.required],
      estado: [true, Validators.required],
      tipo_curso: ['', Validators.required],
      id_colegio: [null],
      cantidad_unidades: [null, [Validators.min(1)]],
      cantidad_lecciones_por_unidad: [null, [Validators.min(1)]]
    });
  }
  getNiveles() {
    this.nivelesService.getNiveles().subscribe({
      next: (niveles) => {
        this.niveles = niveles.filter(n => n.estado);
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los niveles', 'error');
      }
    });
  }
  onNivelChange() {
    this.selectedGrado = '';
    if (this.selectedNivel) {
      // Filtrar grados por nivel seleccionado
      this.gradosService.getGrados().subscribe({
        next: (grados) => {
          this.grados = grados.filter(g => g.nivel && typeof g.nivel === 'object' && g.nivel.id_nivel === Number(this.selectedNivel) && g.estado);
        },
        error: () => {
          Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
        }
      });
    } else {
      // Si no hay nivel seleccionado, mostrar todos los grados activos
      this.gradosService.getGrados().subscribe({
        next: (grados) => {
          this.grados = grados.filter(g => g.estado);
        },
        error: () => {
          Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
        }
      });
    }
    this.filtrarCursos();
  }


  // Eliminado: lógica de niveles y mapeo grado-nivel

  // Eliminado: lógica de cambio de nivel

  onGradoChange() {
    this.filtrarCursos();
  }

  onTipoCursoChange() {
    this.currentPage = 1;
    this.filtrarCursos();
  }

  filtrarCursos() {
    this.filteredCursos = this.cursos.filter(curso => {
      let match = true;
      // Filtrar por grado
      if (this.selectedGrado) {
        match = match && curso.grado && curso.grado.id_grado === Number(this.selectedGrado);
      }
      // Filtrar por tipo de curso (Interno, Externo, Ambos)
      if (this.tipoCurso !== 'ambos') {
        match = match && (typeof curso.tipo_curso === 'string' && curso.tipo_curso.toLowerCase() === this.tipoCurso.toLowerCase());
      }
      return match;
    });
    this.currentPage = 1;
    this.setPaginatedCursos();
  }

  getCursos() {
    this.loading = true;
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.filteredCursos = data;
        this.setPaginatedCursos();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los cursos', 'error');
      }
    });
  }

  setPaginatedCursos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCursos = this.filteredCursos.slice(start, end);
  }

  onSearch() {
    const term = this.searchCurso.toLowerCase();
    this.filteredCursos = this.cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(term) ||
      (curso.codigo_libro && curso.codigo_libro.toLowerCase().includes(term))
    );
    this.currentPage = 1;
    this.setPaginatedCursos();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.setPaginatedCursos();
  }

  onSubmit() {
    if (this.cursoForm.invalid) return;
    const newCurso = this.cursoForm.value;
    this.cursosService.crearCurso(newCurso).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Curso creado correctamente', 'success');
        this.getCursos();
        this.activeTab = 'tabla';
        this.cursoForm.reset();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el curso', 'error');
      }
    });
  }

  // Métodos auxiliares para paginación en el template
  getTotalPages(): number {
    return Math.ceil(this.filteredCursos.length / this.itemsPerPage) || 1;
  }

  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredCursos.length);
  }

  getPagesArray(): number[] {
    return Array(this.getTotalPages()).fill(0);
  }

  // (Métodos reemplazados por filtrarCursos y onTipoCursoChange actualizados)

  viewCurso(id_curso: number): void {
    const curso = this.cursos.find(c => c.id_curso === id_curso);
    if (curso) {
      Swal.fire({
        title: 'Detalles del Curso',
        html: `
          <strong>Nombre:</strong> ${curso.nombre}<br>
          <strong>ID:</strong> ${curso.id_curso}<br>
          <strong>Área:</strong> ${curso.area?.nombre}<br>
          <strong>Grado:</strong> ${curso.grado?.nombre}<br>
          <strong>Código Libro:</strong> ${curso.codigo_libro ?? '-'}<br>
          <strong>Tipo de Curso:</strong> ${curso.tipo_curso}<br>
          <strong>Estado:</strong> ${curso.estado ? 'Activo' : 'Inactivo'}<br>
        `,
        icon: 'info'
      });
    }
  }

  editCurso(id_curso: number): void {
    this.editandoCurso = true;
    const curso = this.cursos.find(c => c.id_curso === id_curso);
    if (!curso) {
      Swal.fire('Error', 'No se encontró el curso', 'error');
      return;
    }
    // Cambiar a la pestaña de edición
    this.activeTab = 'nuevo';
    // Resetear el formulario antes de cargar los datos
    this.cursoForm.reset();
    // Extraer valores simples para el formulario
    const gradoValue = curso.grado && typeof curso.grado === 'object' ? curso.grado.id_grado ?? '' : curso.grado ?? '';
    const areaValue = curso.area && typeof curso.area === 'object' ? curso.area.id_area ?? '' : curso.area ?? '';
    // Cargar los datos del curso en el formulario
    this.cursoForm.patchValue({
      nombre: curso.nombre ?? '',
      codigo_libro: curso.codigo_libro ?? '',
      area: areaValue,
      grado: gradoValue,
      estado: curso.estado ?? true,
      tipo_curso: curso.tipo_curso ?? '',
      id_colegio: curso.id_colegio ?? null
    });
    // Opcional: mostrar alerta de seguimiento
    Swal.fire({
      title: 'Datos cargados para edición',
      html: `<pre style='text-align:left'>${JSON.stringify(curso, null, 2)}</pre>`,
      icon: 'info',
      confirmButtonText: 'Continuar'
    });
  }

  cancelarEdicion(): void {
    this.editandoCurso = false;
    this.cursoForm.reset();
    this.activeTab = 'tabla';
  }

  deleteCurso(id_curso: number): void {
    Swal.fire({
      title: '¿Eliminar Curso?',
      text: `Esta acción no se puede deshacer.\nID del curso: ${id_curso}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado', `El curso ha sido eliminado.\nID del curso: ${id_curso}`, 'success');
      }
    });
  }

  viewContenido(id_curso: number): void {
    Swal.fire({
      title: 'Cargando...',
      html: '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Cargando detalle del curso...</div>',
      showConfirmButton: false,
      allowOutsideClick: false,
      width: 1000,
      heightAuto: false,
      customClass: {
        popup: 'swal-contenido-curso'
      }
    });

    interface LeccionApi {
      titulo_leccion: string;
      contenido_leccion: string;
    }
    interface UnidadApi {
      nombre_unidad: string;
      orden_unidad: number;
      descripcion_unidad: string;
      lecciones: LeccionApi[];
    }
    interface CursoApi {
      nombre_curso: string;
      descripcion_curso: string;
      unidades: UnidadApi[];
    }
    this.cursosDetalleService.getDetalleCurso(id_curso).subscribe(
      (curso: CursoApi) => {
        // Mapear campos del backend a los nombres esperados
        const mappedCurso = {
          nombre: curso.nombre_curso,
          descripcion: curso.descripcion_curso,
          unidades: (curso.unidades || []).map((unidad: UnidadApi) => ({
            nombre: unidad.nombre_unidad,
            orden: unidad.orden_unidad,
            descripcion: unidad.descripcion_unidad,
            lecciones: (unidad.lecciones || []).map((leccion: LeccionApi) => ({
              titulo: leccion.titulo_leccion,
              contenido: leccion.contenido_leccion
            }))
          }))
        };
        let html = `<div class='cursos-detalle-container' style='text-align:left;max-width:900px;'>`;
        html += `<h2 class='text-xl font-bold mb-2'>${mappedCurso.nombre}</h2>`;
        html += `<div class='mb-2 text-gray-700'>${mappedCurso.descripcion || ''}</div>`;
        if (mappedCurso.unidades && mappedCurso.unidades.length > 0) {
          mappedCurso.unidades.forEach((unidad) => {
            html += `<div class='mb-4 p-2 bg-white rounded shadow border'>`;
            html += `<div class='font-semibold text-green-700 mb-1'>Unidad ${unidad.orden}: <span class='font-bold'>${unidad.nombre}</span></div>`;
            html += `<div class='text-gray-600 mb-1'>${unidad.descripcion || ''}</div>`;
            if (unidad.lecciones && unidad.lecciones.length > 0) {
              html += `<div class='font-semibold text-green-600 mb-1'>Lecciones</div><ul class='list-disc pl-5'>`;
              unidad.lecciones.forEach((leccion) => {
                html += `<li class='mb-1' style='text-align:left;'><span class='font-medium'>${leccion.titulo}</span>: <span class='text-gray-500'>${leccion.contenido}</span></li>`;
              });
              html += `</ul>`;
            } else {
              html += `<div class='text-sm text-gray-400 italic'>No hay lecciones en esta unidad.</div>`;
            }
            html += `</div>`;
          });
        } else {
          html += `<div class='text-sm text-gray-400 italic'>No hay unidades registradas para este curso.</div>`;
        }
        html += `</div>`;
        Swal.fire({
          title: 'Contenido del Curso',
          html: `<div style="max-height:800px;overflow:auto;">${html}</div>`,
          icon: 'info',
          width: 1000,
          heightAuto: false,
          customClass: {
            popup: 'swal-contenido-curso'
          }
        });
      },
      () => {
        Swal.fire({
          title: 'Error',
          html: 'No se pudo cargar el detalle del curso.',
          icon: 'error',
          width: 500
        });
      }
    );
  }

}
