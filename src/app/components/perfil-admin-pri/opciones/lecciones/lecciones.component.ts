import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Leccion, LeccionesService } from 'src/app/services/lecciones.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { CursosService, Curso } from 'src/app/services/cursos.service';
import { Unidad, UnidadesService } from 'src/app/services/unidades.service';
// import { leccionesService } from 'src/app/services/unidades.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.component.html',
  styleUrls: ['./lecciones.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LeccionesComponent implements OnInit {
  // Listas para selects
  niveles: Nivel[] = [];
  grados: Grado[] = [];
  cursos: Curso[] = [];
  unidades: Unidad[] = [];

  // Selección actual
  filtroNivel = '';
  filtroGrado = '';
  filtroCurso = '';
  filtroUnidad = '';

  // Servicios
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);
  private cursosService = inject(CursosService);
  Math = Math;
  private unidadesService = inject(UnidadesService);
  lecciones: Leccion[] = [];
  filteredLecciones: Leccion[] = [];
  paginatedLecciones: Leccion[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingLeccionId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  leccionForm!: FormGroup;
  private fb = inject(FormBuilder);
  private leccionesService = inject(LeccionesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarLecciones();
    this.cargarNiveles();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    // Solo desactivar edición si NO se está editando una lección
    if (tab === 'nuevo' && !this.editingLeccionId) {
      this.isEditing = false;
      // Se elimina el reset para evitar borrar los datos cargados por patchValue
    }
  }

  cargarUnidades(): void {
    if (!this.filtroCurso) {
      this.unidades = [];
      this.filtroUnidad = '';
      return;
    }
    this.unidadesService.getUnidadesPorCurso(Number(this.filtroCurso)).subscribe({
      next: (unidades) => {
        this.unidades = unidades;
      },
      error: (error: unknown) => {
        this.unidades = [];
        this.filtroUnidad = '';
        console.error('Error al cargar unidades:', error);
      }
    });
  }

  cargarLecciones(): void {
    // Siempre cargar todas las lecciones al inicio
    this.loading = true;
    this.leccionesService.getLecciones().subscribe({
      next: (lecciones) => {
        this.lecciones = lecciones.sort((a, b) => (a.id_leccion ?? 0) - (b.id_leccion ?? 0));
        this.filterLecciones();
        this.loading = false;
        alert(`Se cargaron ${this.lecciones.length} lecciones.`);
      },
      error: (error: unknown) => {
        this.lecciones = [];
        this.filteredLecciones = [];
        this.paginatedLecciones = [];
        this.loading = false;
        console.error('Error al cargar lecciones:', error);
      }
    });
  }

  private initForm(): void {
    this.leccionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(1)]],
      contenido: ['', [Validators.required]],
      estado: [true, [Validators.required]],
      id_unidad: ['']
    });
  }

  filterLecciones(): void {
    let resultado = [...this.lecciones];
    if (this.searchTerm.trim()) {
      resultado = resultado.filter(leccion =>
        leccion.titulo.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredLecciones = resultado;
    this.currentPage = 1;
    this.updatePaginatedLecciones();
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
    this.filtroUnidad = '';
    this.grados = [];
    this.cursos = [];
    this.unidades = [];
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
  }

  onGradoChange(): void {
    this.filtroCurso = '';
    this.filtroUnidad = '';
    this.cursos = [];
    this.unidades = [];
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
  }

  onCursoChange(): void {
    this.filtroUnidad = '';
    this.unidades = [];
    if (this.filtroCurso) {
      this.cargarUnidades();
    }
  }

  onUnidadChange(): void {
    if (this.filtroUnidad) {
      this.cargarLecciones();
    } else {
      this.lecciones = [];
      this.filteredLecciones = [];
      this.paginatedLecciones = [];
    }
  }

  updatePaginatedLecciones(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLecciones = this.filteredLecciones.slice(startIndex, endIndex);
  }

  editLeccion(id: number): void {
    //alert('editLeccion: id recibido = ' + id);
    this.isEditing = true;
    this.editingLeccionId = id;
    //alert('editLeccion: = ' + this.editingLeccionId);
    const leccion = this.lecciones.find(s => s.id_leccion === id);
    //alert('leccion: ' + JSON.stringify(leccion, null, 2));
    if (leccion) {
      this.leccionForm.patchValue({
        titulo: leccion.titulo,
        contenido: leccion.contenido,
        estado: leccion.estado,
        id_unidad: leccion.id_unidad ?? this.filtroUnidad ?? ''
      });
      this.selectTab('nuevo');
    }
  }

  detailLeccion(id: number): void {
    const leccion = this.lecciones.find(s => s.id_leccion === id);
    if (leccion) {
      alert(`Detalle lección:\nID: ${leccion.id_leccion}\nTítulo: ${leccion.titulo}\nEstado: ${leccion.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.leccionForm.invalid) return;
    // Log para ver los valores actuales del FormGroup
    // console.log('Valores actuales del FormGroup:', this.leccionForm.value);
    // alert('Valores actuales del FormGroup: ' + JSON.stringify(this.leccionForm.value, null, 2));
    // Mostrar estado de edición y el id
    // alert('Estado edición: isEditing=' + this.isEditing + ', editingLeccionId=' + this.editingLeccionId);
    // Crear objeto limpio sin id_leccion ni id_unidad (solo para update)
    // El backend solo permite modificar título, contenido y estado, no la unidad
    const seccionData: Partial<Leccion> = { ...this.leccionForm.value };
    // Validar que los campos requeridos no sean undefined
    if (typeof seccionData.titulo === 'undefined') seccionData.titulo = '';
    if (typeof seccionData.contenido === 'undefined') seccionData.contenido = '';
    if (typeof seccionData.estado === 'undefined') seccionData.estado = true;
    // Log para depuración
    console.log('Actualizando lección:', {
      id: this.editingLeccionId,
      data: seccionData
    });
    // alert('Actualizando lección con id: ' + this.editingLeccionId + '\nObjeto enviado: ' + JSON.stringify(seccionData, null, 2));
    // Mostrar el body exacto antes de enviar
    // console.log('Body enviado al update:', JSON.stringify(seccionData, null, 2));
    // alert('Body enviado al update:\n' + JSON.stringify(seccionData, null, 2));
    if (this.isEditing && this.editingLeccionId) {
      // Editar
      this.leccionesService.actualizarLeccion(this.editingLeccionId, seccionData).subscribe({
        next: () => {
          alert('¡Lección actualizada correctamente!');
          this.cargarLecciones();
          this.isEditing = false;
          this.editingLeccionId = undefined;
          this.leccionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar sección:', error);
          alert('¡Error al actualizar la lección!\n' + JSON.stringify(error, null, 2));
        }
      });
    } else {
      // Crear
      const createDto = {
        titulo: typeof seccionData.titulo === 'string' ? seccionData.titulo : '',
        contenido: typeof seccionData.contenido === 'string' ? seccionData.contenido : '',
        estado: typeof seccionData.estado === 'boolean' ? seccionData.estado : true,
        id_unidad: typeof seccionData.id_unidad === 'number' ? seccionData.id_unidad : undefined,
        descripcion: typeof seccionData.descripcion === 'string' ? seccionData.descripcion : undefined,
        orden: typeof seccionData.orden === 'number' ? seccionData.orden : undefined
      };
      this.leccionesService.crearLeccion(createDto).subscribe({
        next: () => {
          this.cargarLecciones();
          this.leccionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear sección:', error);
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedLecciones();
  }

  viewLeccion(id: number): void {
    const leccion = this.lecciones.find((s: Leccion) => s.id_leccion === id);
    if (leccion) {
      alert(`Vista de lección:\nID: ${leccion.id_leccion}\nTítulo: ${leccion.titulo}\nContenido: ${leccion.contenido}`);
    }
  }

  deleteLeccion(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta lección?')) {
      this.leccionesService.eliminarLeccion(id).subscribe({
        next: () => {
          this.cargarLecciones();
          alert('Lección eliminada correctamente');
        },
        error: (error: unknown) => {
          alert('Error al eliminar la lección');
          console.error('Error al eliminar lección:', error);
        }
      });
    }
  }


}
