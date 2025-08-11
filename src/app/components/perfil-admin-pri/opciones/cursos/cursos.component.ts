import { Component, OnInit, inject } from '@angular/core';
import { CursosService, Curso } from '../../../../services/cursos.service';
import { CursosDetalleService } from 'src/app/services/cursos-detalle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
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
  tipo?: 'interno' | 'externo'; // <--- agrega esto

  // Formularios
  cursoForm!: FormGroup;

  private cursosService = inject(CursosService);
  private cursosDetalleService = inject(CursosDetalleService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.getCursos();
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      codigo: [''],
      nivel: ['', Validators.required],
      grado: [''],
      horasSemanales: [null],
      creditos: [null],
      area: ['', Validators.required],
      esObligatorio: [false],
      estado: [true, Validators.required],
      id_colegio: [null]
    });
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

  onTipoCursoChange() {
    this.currentPage = 1;
    this.filtrarPorTipoCurso();
  }

  filtrarPorTipoCurso() {
    if (this.tipoCurso === 'ambos') {
      this.filteredCursos = this.cursos.slice();
    } else {
      this.filteredCursos = this.cursos.filter(curso => curso.tipo_curso === this.tipoCurso);
    }
    this.setPaginatedCursos();
  }

  viewCurso(id_curso: number): void {
    const curso = this.cursos.find(c => c.id_curso === id_curso);
    if (curso) {
      Swal.fire({
        title: 'Detalles del Curso',
        html: `
          <strong>Nombre:</strong> ${curso.nombre}<br>
          <strong>Código:</strong> ${curso.id_curso}<br>
          <strong>Nivel:</strong> ${curso.nivel}<br>
          <strong>Área:</strong> ${curso.area}<br>
          <strong>Grado:</strong> ${curso.grado}<br>
          <strong>Horas Semanales:</strong> ${curso.horasSemanales}<br>
          <strong>Créditos:</strong> ${curso.creditos}<br>
          <strong>Obligatorio:</strong> ${curso.esObligatorio ? 'Sí' : 'No'}<br>
          <strong>Estado:</strong> ${curso.estado ? 'Activo' : 'Inactivo'}<br>
          <strong>Descripción:</strong> ${curso.descripcion || '-'}
        `,
        icon: 'info'
      });
    }
  }

  editCurso(id_curso: number): void {
    Swal.fire('Editar', `Funcionalidad de edición de curso (por implementar).\nID del curso: ${id_curso}`, 'info');
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
        let html = `<div class='cursos-detalle-container'>`;
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
                html += `<li class='mb-1'><span class='font-medium'>${leccion.titulo}</span>: <span class='text-gray-500'>${leccion.contenido}</span></li>`;
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
          html,
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
