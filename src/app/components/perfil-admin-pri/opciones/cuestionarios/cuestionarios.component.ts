
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuestionariosService, Cuestionario } from 'src/app/services/cuestionarios.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { CursosService, Curso } from 'src/app/services/cursos.service';
import { CuestionarioDetalleService } from 'src/app/services/cuestionario-detalle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuestionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cuestionarios.component.html',
  styleUrls: ['./cuestionarios.component.css']
})
export class CuestionariosComponent implements OnInit {
  Math = Math;
  cuestionarios: Cuestionario[] = [];
  filteredCuestionarios: Cuestionario[] = [];
  paginatedCuestionarios: Cuestionario[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingCuestionarioId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // Selectores de nivel, grado y curso
  niveles: Nivel[] = [];
  grados: Grado[] = [];
  cursos: Curso[] = [];
  filtroNivel = '';
  filtroGrado = '';
  filtroCurso = '';

  cuestionarioForm!: FormGroup;
  private fb = inject(FormBuilder);
  private cuestionariosService = inject(CuestionariosService);
  private cuestionarioDetalleService = inject(CuestionarioDetalleService); // <-- AGREGA AQUÍ
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);
  private cursosService = inject(CursosService);

  ngOnInit(): void {
    this.initForm();
    this.cargarCuestionarios();
    this.cargarNiveles();
  }

  cargarNiveles(): void {
    this.nivelesService.getNiveles().subscribe({
      next: (niveles) => {
        this.niveles = niveles;
      },
      error: (err) => {
        console.error('Error cargando niveles', err);
      }
    });
  }

  onNivelChange(): void {
    this.filtroGrado = '';
    this.filtroCurso = '';
    this.grados = [];
    this.cursos = [];
    if (this.filtroNivel) {
      const nivelId = Number(this.filtroNivel);
      this.gradosService.getGrados().subscribe({
        next: (grados) => {
          this.grados = grados.filter(g => typeof g.nivel === 'object' && g.nivel && 'id_nivel' in g.nivel && g.nivel.id_nivel === nivelId);
        },
        error: (err) => {
          console.error('Error cargando grados', err);
        }
      });
    }
    this.filterCuestionarios();
  }

  onGradoChange(): void {
    this.filtroCurso = '';
    this.cursos = [];
    if (this.filtroGrado) {
      const gradoId = Number(this.filtroGrado);
      this.cursosService.getCursos().subscribe({
        next: (cursos) => {
          this.cursos = cursos.filter(c => c.grado && c.grado.id_grado === gradoId);
        },
        error: (err) => {
          console.error('Error cargando cursos', err);
        }
      });
    }
    this.filterCuestionarios();
  }

  onCursoChange(): void {
    this.filterCuestionarios();
  }

  cargarCuestionarios(): void {
  this.loading = true;
  console.log('[Cuestionarios] loading:', this.loading);
    this.cuestionariosService.getCuestionarios().subscribe({
      next: (data) => {
        this.cuestionarios = data;
        this.filteredCuestionarios = [...data];
        this.updatePaginatedCuestionarios();
  this.loading = false;
  console.log('[Cuestionarios] loading:', this.loading);
      },
      error: (error) => {
  this.loading = false;
  console.log('[Cuestionarios] loading:', this.loading);
        console.error('Error al cargar cuestionarios:', error);
      }
    });
  }

  private initForm(): void {
    this.cuestionarioForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      estado: [true, [Validators.required]]
    });
  }

  filterCuestionarios(): void {
    let resultado = [...this.cuestionarios];
    // Filtro por texto
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      resultado = resultado.filter(cuestionario =>
        cuestionario.titulo.toLowerCase().includes(term)
      );
    }
    // Filtro por curso (único campo disponible en el modelo)
    if (this.filtroCurso) {
      const cursoId = Number(this.filtroCurso);
      resultado = resultado.filter(cuestionario => cuestionario.id_curso === cursoId);
    }
    this.filteredCuestionarios = resultado;
    this.currentPage = 1;
    this.updatePaginatedCuestionarios();
  }

  updatePaginatedCuestionarios(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCuestionarios = this.filteredCuestionarios.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedCuestionarios();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.editingCuestionarioId = undefined;
      this.cuestionarioForm.reset({ estado: true });
    }
  }

  editCuestionario(id_cuestionario: number): void {
    this.isEditing = true;
    this.editingCuestionarioId = id_cuestionario;
    const cuestionario = this.cuestionarios.find(c => c.id_cuestionario === id_cuestionario);
    if (cuestionario) {
      this.cuestionarioForm.patchValue({
        titulo: cuestionario.titulo,
        descripcion: cuestionario.descripcion,
        estado: cuestionario.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteCuestionario(id_cuestionario: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cuestionario?')) {
      this.cuestionariosService.deleteCuestionario(id_cuestionario).subscribe({
        next: () => {
          this.cargarCuestionarios();
        },
        error: (error) => {
          console.error('Error al eliminar cuestionario:', error);
        }
      });
    }
  }

  detailCuestionario(id_cuestionario: number): void {
    const cuestionario = this.cuestionarios.find(c => c.id_cuestionario === id_cuestionario);
    if (cuestionario) {
      alert(`Detalle cuestionario:\nID: ${cuestionario.id_cuestionario}\nTítulo: ${cuestionario.titulo}\nEstado: ${cuestionario.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.cuestionarioForm.invalid) return;
    const cuestionarioData = this.cuestionarioForm.value;
    if (this.isEditing && this.editingCuestionarioId) {
      this.cuestionariosService.updateCuestionario(this.editingCuestionarioId, cuestionarioData).subscribe({
        next: () => {
          this.cargarCuestionarios();
          this.isEditing = false;
          this.editingCuestionarioId = undefined;
          this.cuestionarioForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error) => {
          console.error('Error al actualizar cuestionario:', error);
        }
      });
    } else {
      this.cuestionariosService.addCuestionario(cuestionarioData).subscribe({
        next: () => {
          this.cargarCuestionarios();
          this.cuestionarioForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error) => {
          console.error('Error al crear cuestionario:', error);
        }
      });
    }
  }

  viewCuestionario(id_cuestionario: number): void {
    Swal.fire({
      title: 'Cargando...',
      html: '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Cargando detalle del cuestionario...</div>',
      showConfirmButton: false,
      allowOutsideClick: false,
      width: 900,
      heightAuto: false,
      customClass: {
        popup: 'swal-contenido-cuestionario'
      }
    });

    this.cuestionarioDetalleService.getDetalleCuestionario(id_cuestionario).subscribe(
      (cuestionarioApi) => {
        // Mapeo seguro de la respuesta a la estructura esperada por la UI
        const cuestionario = {
          nombre_cuestionario: cuestionarioApi.nombre_cuestionario,
          descripcion: cuestionarioApi.descripcion || '',
          preguntas: (cuestionarioApi.preguntas || []).map(preguntaApi => ({
            nombre_pregunta: preguntaApi.nombre_pregunta,
            tipo_pregunta: preguntaApi.tipo_pregunta,
            puntaje_pregunta: Number(preguntaApi.puntaje_pregunta),
            opciones: (preguntaApi.opciones || []).map(opcionApi => ({
              nombre_opcion: opcionApi.nombre_opcion,
              es_correcta: opcionApi.es_correcta,
              par_relacion: opcionApi.par_relacion || ''
            }))
          }))
        };
        let html = `<div class='cuestionario-detalle-container' style='text-align:left;max-width:800px;'>`;
        html += `<h2 class='text-xl font-bold mb-2'>${cuestionario.nombre_cuestionario}</h2>`;
        if (cuestionario.descripcion) {
          html += `<div class='mb-2 text-gray-700'>${cuestionario.descripcion}</div>`;
        }
        if (cuestionario.preguntas && cuestionario.preguntas.length > 0) {
          html += `<div class='font-semibold text-green-700 mb-1'>Preguntas</div><ol class='list-decimal pl-5'>`;
          cuestionario.preguntas.forEach((pregunta) => {
            html += `<li class='mb-3'><span class='font-medium'>${pregunta.nombre_pregunta}</span>`;
            html += `<div class='text-xs text-gray-500 mb-1'>Tipo: ${pregunta.tipo_pregunta} | Puntaje: ${pregunta.puntaje_pregunta}</div>`;
            // Opciones de respuesta
            if (pregunta.opciones && pregunta.opciones.length > 0) {
              if (pregunta.tipo_pregunta === 'SELECCION') {
                html += `<ul class='list-disc pl-5 mt-1'>`;
                pregunta.opciones.forEach((opcion, i: number) => {
                  html += `<li class='mb-1'><span class='text-gray-600'>${String.fromCharCode(65 + i)}. ${opcion.nombre_opcion}`;
                  if (opcion.es_correcta) {
                    html += ` <span class='text-green-600 font-bold'>(Correcta)</span>`;
                  }
                  html += `</span></li>`;
                });
                html += `</ul>`;
              } else if (pregunta.tipo_pregunta === 'RELACION') {
                html += `<ul class='list-disc pl-5 mt-1'>`;
                pregunta.opciones.forEach((opcion) => {
                  html += `<li class='mb-1'><span class='text-gray-600'>${opcion.nombre_opcion} <span class='text-blue-600'>→</span> ${opcion.par_relacion}</span></li>`;
                });
                html += `</ul>`;
              }
            }
            html += `</li>`;
          });
          html += `</ol>`;
        } else {
          html += `<div class='text-sm text-gray-400 italic'>No hay preguntas registradas para este cuestionario.</div>`;
        }
        html += `</div>`;
        Swal.fire({
          title: 'Detalle del Cuestionario',
          html: `<div style="max-height:700px;overflow:auto;">${html}</div>`,
          icon: 'info',
          width: 900,
          heightAuto: false,
          customClass: {
            popup: 'swal-contenido-cuestionario'
          }
        });
      },
      () => {
        Swal.fire({
          title: 'Error',
          html: 'No se pudo cargar el detalle del cuestionario.',
          icon: 'error',
          width: 500
        });
      }
    );
  }
}
