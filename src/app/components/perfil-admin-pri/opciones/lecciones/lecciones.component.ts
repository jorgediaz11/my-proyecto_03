import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Leccion, LeccionesService } from 'src/app/services/lecciones.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { CursosService, Curso } from 'src/app/services/cursos.service';
import { Unidad } from 'src/app/services/unidades.service';
// import { leccionesService } from 'src/app/services/unidades.service';

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.component.html',
  styleUrls: ['./lecciones.component.css']
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
  this.cargarNiveles();
  this.cargarNiveles();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.leccionForm.reset({ estado: true });
    }
  }

  cargarUnidades(): void {
    if (!this.filtroCurso) {
      this.unidades = [];
      this.filtroUnidad = '';
      return;
    }
    // Aquí deberías llamar a tu servicio de unidades por curso
    // this.unidadesService.getUnidadesPorCurso(this.filtroCurso).subscribe(...)
    // Simulación temporal:
    this.unidades = [];
    this.filtroUnidad = '';
  }

  cargarLecciones(): void {
    if (!this.filtroUnidad) {
      this.lecciones = [];
      this.filteredLecciones = [];
      this.paginatedLecciones = [];
      return;
    }
    this.loading = true;
    this.leccionesService.getLeccionesPorUnidad(Number(this.filtroUnidad)).subscribe({
      next: (lecciones) => {
        this.lecciones = lecciones;
        this.filterLecciones();
        this.loading = false;
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
      estado: [true, [Validators.required]]
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
    this.cargarLecciones();
  }

  updatePaginatedLecciones(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLecciones = this.filteredLecciones.slice(startIndex, endIndex);
  }

  editLeccion(id: number): void {
    this.isEditing = true;
    this.editingLeccionId = id;
    const leccion = this.lecciones.find(s => s.id_leccion === id);
    if (leccion) {
      this.leccionForm.patchValue({
        titulo: leccion.titulo,
        contenido: leccion.contenido,
        estado: leccion.estado
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
    const seccionData = this.leccionForm.value;
    if (this.isEditing && this.editingLeccionId) {
      // Editar
      this.leccionesService.actualizarLeccion(this.editingLeccionId, seccionData).subscribe({
        next: () => {
          this.cargarLecciones();
          this.isEditing = false;
          this.editingLeccionId = undefined;
          this.leccionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar sección:', error);
        }
      });
    } else {
      // Crear
    this.leccionesService.crearLeccion(seccionData).subscribe({
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

}
