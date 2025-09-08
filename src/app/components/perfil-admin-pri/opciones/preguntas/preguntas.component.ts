import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pregunta, PreguntasService } from 'src/app/services/preguntas.service';
import { CuestionariosService, Cuestionario } from 'src/app/services/cuestionarios.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { CursosService, Curso } from 'src/app/services/cursos.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoPreguntaService, TipoPregunta } from 'src/app//services/tipo-pregunta.service';
import Swal from 'sweetalert2';

// Estructuras de datos
interface Opcion {
  texto: string;
  correcta: boolean;
}

interface ParRelacion {
  elementoA: string;
  elementoB: string;
}

interface Preguntare {
  tipo: string;
  titulo: string;
  enunciado: string;
  puntaje: number;
  // Campos específicos por tipo
  respuestaCorrecta?: string;
  tipoRespuesta?: string;
  opciones?: Opcion[];
  multiple?: boolean;
  paresRelacion?: ParRelacion[];
  longitudMinima?: number;
  longitudMaxima?: number;
  rubrica?: string;
  formatosPermitidos?: string[];
  tamanoMaximo?: number;
  instrucciones?: string;
}

@Component({
    selector: 'app-preguntas',
    templateUrl: './preguntas.component.html',
    styleUrls: ['./preguntas.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PreguntasComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enunciado de la pregunta',
    translate: 'no',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo']
    ]
  };
  Math = Math;
  preguntas: Pregunta[] = [];
  filteredPreguntas: Pregunta[] = [];
  paginatedPreguntas: Pregunta[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingPreguntaId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // Selectores y datos para filtrado escalonado
  niveles: Nivel[] = [];
  grados: Grado[] = [];
  cursos: Curso[] = [];
  filtroNivel = '';
  filtroGrado = '';
  filtroCurso = '';

  tiposPregunta: TipoPregunta[] = [];
  cuestionarios: Cuestionario[] = [];
  filteredCuestionarios: Cuestionario[] = [];
  selectedCuestionario: number | '' = '';

  preguntaForm!: FormGroup;
  private fb = inject(FormBuilder);
  private preguntasService = inject(PreguntasService);
  private cuestionariosService = inject(CuestionariosService);
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);
  private cursosService = inject(CursosService);
  private tipoPreguntaService = inject(TipoPreguntaService);


  // Variables del componente
  tipoPreguntaSeleccionado = 'VALOR';
  pregunta: Preguntare = {
    tipo: 'VALOR',
    titulo: '',
    enunciado: '',
    puntaje: 1
  };

  ngOnInit(): void {
    this.initForm();
    this.cargarPreguntas();
    this.cargarCuestionarios();
    this.cargarNiveles();
    this.cargarTiposPregunta(); // <-- Agrega esta línea
  }

  cargarTiposPregunta(): void {
    this.tipoPreguntaService.getTiposPregunta().subscribe({
      next: (data: TipoPregunta[]) => {
        this.tiposPregunta = data;
      },
      error: (error: unknown) => {
        console.error('Error al cargar tipos de pregunta:', error);
      }
    });
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
    this.filtrarCuestionarios();
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
    this.filtrarCuestionarios();
  }

  onCursoChange(): void {
    this.filtrarCuestionarios();
  }

  cargarCuestionarios(): void {
    this.cuestionariosService.getCuestionarios().subscribe({
      next: (data: Cuestionario[]) => {
        this.cuestionarios = data;
        this.filtrarCuestionarios();
      },
      error: (error: unknown) => {
        console.error('Error al cargar cuestionarios:', error);
      }
    });
  }

  filtrarCuestionarios(): void {
    let resultado = [...this.cuestionarios];
    if (this.filtroCurso) {
      const cursoId = Number(this.filtroCurso);
      resultado = resultado.filter(c => c.id_curso === cursoId);
    }
    this.filteredCuestionarios = resultado;
    // Si el cuestionario seleccionado ya no está en la lista, lo deseleccionamos
    if (this.selectedCuestionario && !this.filteredCuestionarios.some(c => c.id_cuestionario === this.selectedCuestionario)) {
      this.selectedCuestionario = '';
    }
    // Solo filtrar preguntas si NO estamos en la pestaña 'nuevo'
    if (this.activeTab !== 'nuevo') {
      this.filterPreguntas();
    }
  }

  cargarPreguntas(): void {
    this.loading = true;
    this.preguntasService.getPreguntas().subscribe({
      next: (data: Pregunta[]) => {
        this.preguntas = data;
        this.filteredPreguntas = [...data];
        this.updatePaginatedPreguntas();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar preguntas:', error);
      }
    });
  }

  private initForm(): void {
    this.preguntaForm = this.fb.group({
      enunciado: ['', [Validators.required, Validators.minLength(2)]],
      tipo_pregunta: ['', [Validators.required]],
      puntaje: ['', [Validators.required]],
      orden: [1, [Validators.required]],
      estado: [true, [Validators.required]],
      id_cuestionario: [null, [Validators.required]]
    });
  }

  filterPreguntas(): void {
    let resultado = [...this.preguntas];
    // Filtro por texto
    if (this.searchTerm.trim()) {
      resultado = resultado.filter(pregunta =>
        (pregunta.enunciado || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    // Filtro por cuestionario seleccionado
    if (this.selectedCuestionario) {
      resultado = resultado.filter(p => p.id_cuestionario === this.selectedCuestionario);
    }
    this.filteredPreguntas = resultado;
    this.currentPage = 1;
    this.updatePaginatedPreguntas();
  }

  updatePaginatedPreguntas(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPreguntas = this.filteredPreguntas.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPreguntas();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    if (tab === 'nuevo') {
      // Solo resetea el formulario si NO estás editando
      if (!this.isEditing) {
        this.selectedCuestionario = '';
        this.preguntaForm.reset({
          enunciado: '',
          tipo_pregunta: '',
          puntaje: '',
          orden: 1,
          estado: true,
          id_cuestionario: null
        });
      }
    }
  }

  viewPregunta(id_pregunta: number): void {
    const pregunta = this.preguntas.find(e => e['id_pregunta'] === id_pregunta);
    if (!pregunta) {
      this.handleError('Pregunta no encontrada');
      return;
    }

    Swal.fire({
      title: `Detalles de la Pregunta`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${pregunta.enunciado}</p>
          <p><strong>Estado:</strong> ${pregunta.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

  }

  editPregunta(id_pregunta: number): void {
    //alert('Nro de Pregunta : ' + id_pregunta);
    if (typeof id_pregunta !== 'number') return;
    this.isEditing = true;
    this.editingPreguntaId = id_pregunta;
    const pregunta = this.preguntas.find(p => p.id_pregunta === id_pregunta);
    if (pregunta) {
      this.preguntaForm.patchValue({
        enunciado: pregunta.enunciado,
        tipo_pregunta: pregunta.tipo_pregunta,
        puntaje: pregunta.puntaje,
        orden: pregunta.orden,
        estado: pregunta.estado,
        id_cuestionario: pregunta.id_cuestionario
      });
      this.selectTab('nuevo');
    }
  }

  deletePregunta(id_pregunta: number): void {
    const pregunta = this.preguntas.find(n => n.id_pregunta === id_pregunta);
    if (!pregunta) {
      this.handleError('Pregunta no encontrada');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Pregunta?',
      text: `¿Estás seguro de que deseas eliminar la pregunta "${pregunta.enunciado}"?`,
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
        this.preguntasService.eliminarPregunta(pregunta.id_pregunta).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Pregunta eliminada correctamente');
            this.cargarPreguntas();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar la pregunta');
            console.error('Error:', error);
          }
        });
      }
    });
  }

  detailPregunta(id_pregunta: number): void {
    if (typeof id_pregunta !== 'number') return;
    const pregunta = this.preguntas.find(p => p.id_pregunta === id_pregunta);
    if (pregunta) {
      Swal.fire({
        title: 'Detalle pregunta',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${pregunta.id_pregunta}</p>
            <p><strong>Enunciado:</strong> ${pregunta.enunciado}</p>
            <p><strong>Estado:</strong> ${pregunta.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  onSubmit(): void {
    if (this.preguntaForm.invalid) return;
    const preguntaData = this.preguntaForm.value;
    if (this.isEditing && this.editingPreguntaId) {
      // Editar
      this.preguntasService.actualizarPregunta(this.editingPreguntaId, preguntaData).subscribe({
        next: () => {
          this.cargarPreguntas();
          this.isEditing = false;
          this.editingPreguntaId = undefined;
          this.preguntaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar pregunta:', error);
        }
      });
    } else {
      // Crear
      this.preguntasService.crearPregunta(preguntaData).subscribe({
        next: () => {
          this.cargarPreguntas();
          this.preguntaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear pregunta:', error);
        }
      });
    }
  }

  getPagesArray(): number[] {
    const totalPages = Math.ceil(this.filteredPreguntas.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  // Métodos principales
  cambiarTipoPregunta(): void {
    // Reiniciar la pregunta según el nuevo tipo
    this.inicializarPreguntaPorTipo();
  }

  inicializarPreguntaPorTipo(): void {
    // Configurar campos específicos según el tipo
    switch(this.tipoPreguntaSeleccionado) {
      case 'SELECCION':
        this.pregunta.opciones = [{texto: '', correcta: false}];
        this.pregunta.multiple = false;
        break;
      case 'RELACION':
        this.pregunta.paresRelacion = [{elementoA: '', elementoB: ''}];
        break;
      case 'EVALUATIVO_TEXTO':
        this.pregunta.longitudMinima = 0;
        this.pregunta.longitudMaxima = 1000;
        break;
      case 'EVALUATIVO_ARCHIVO':
        this.pregunta.formatosPermitidos = ['pdf'];
        this.pregunta.tamanoMaximo = 10;
        break;
    }
  }

  agregarOpcion(): void {
    if (!this.pregunta.opciones) {
      this.pregunta.opciones = [];
    }
    this.pregunta.opciones.push({ texto: '', correcta: false });
  }

  eliminarOpcion(index: number): void {
    if (this.pregunta.opciones) {
      this.pregunta.opciones.splice(index, 1);
    }
  }

  agregarPar(): void {
    if (!this.pregunta.paresRelacion) {
      this.pregunta.paresRelacion = [];
    }
    this.pregunta.paresRelacion.push({ elementoA: '', elementoB: '' });
  }

  eliminarPar(index: number): void {
    if (this.pregunta.paresRelacion) {
      this.pregunta.paresRelacion.splice(index, 1);
    }
  }

  guardarPregunta(): void {
    // Validar según el tipo de pregunta
    //if (this.validarPregunta()) {
      // Guardar la pregunta
    //}
  }

}
