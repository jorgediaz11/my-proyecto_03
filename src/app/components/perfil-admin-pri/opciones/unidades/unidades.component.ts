import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnidadesService } from '../../../../services/unidades.service';
import { NivelesService, Nivel } from '../../../../services/niveles.service';
import { GradosService, Grado } from '../../../../services/grados.service';
import { CursosService, Curso } from '../../../../services/cursos.service';

interface Unidad {
  id_unidad?: number;
  id_curso?: number;
  nombre: string;
  orden?: number;
  descripcion?: string;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {
  // Listas para selects
  niveles: Nivel[] = [];
  grados: Grado[] = [];
  cursos: Curso[] = [];

  // Selección actual
  filtroNivel = '';
  filtroGrado = '';
  filtroCurso = '';

  // Servicios
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);
  private cursosService = inject(CursosService);
  Math = Math;
  unidades: Unidad[] = [];
  filteredUnidades: Unidad[] = [];
  paginatedUnidades: Unidad[] = [];
  filteredSecciones: Unidad[] = [];
  paginatedSecciones: Unidad[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingSeccionId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  unidadForm!: FormGroup;
  private fb = inject(FormBuilder);
  private unidadesService = inject(UnidadesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarUnidades();
  this.cargarNiveles();
  }

  cargarUnidades(): void {
    this.loading = true;
    this.unidadesService.getUnidades().subscribe({
      next: (data: Unidad[]) => {
        // Solo aceptar objetos con id_unidad definido y mapear el objeto completo
        this.unidades = (data || []).filter(s => s.id_unidad !== undefined).map(s => ({ ...s }));
        this.filteredUnidades = [...this.unidades];
        this.updatePaginatedUnidades();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar unidades:', error);
      }
    });
  }

  private initForm(): void {
    this.unidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      estado: [true, [Validators.required]]
    });
  }

  filterUnidades(): void {
    let resultado = [...this.unidades];
    // Filtro por texto
    if (this.searchTerm.trim()) {
      resultado = resultado.filter(unidad =>
        unidad.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    // Filtro por nivel
    if (this.filtroNivel) {
      const nivelId = Number(this.filtroNivel);
      resultado = resultado.filter(unidad =>
        (unidad as { id_nivel?: number }).id_nivel === nivelId
      );
    }
    // Filtro por curso (único relevante para unidades)
    if (this.filtroCurso) {
      const cursoId = Number(this.filtroCurso);
      resultado = resultado.filter(unidad => unidad.id_curso === cursoId);
    }
    this.filteredUnidades = resultado;
    this.currentPage = 1;
    this.updatePaginatedUnidades();

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
    this.filterUnidades();
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
    this.filterUnidades();
  }

  onCursoChange(): void {
    if (this.filtroCurso) {
      const cursoId = Number(this.filtroCurso);
      this.unidadesService.getUnidadesPorCurso(cursoId).subscribe({
        next: (unidades) => {
          this.unidades = unidades;
          this.filteredUnidades = [...unidades];
          this.currentPage = 1;
          this.updatePaginatedUnidades();
        },
        error: (err) => {
          this.unidades = [];
          this.filteredUnidades = [];
          this.updatePaginatedUnidades();
          console.error('Error cargando unidades por curso', err);
        }
      });
    } else {
      this.cargarUnidades();
    }
  }

  updatePaginatedUnidades(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUnidades = this.filteredUnidades.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUnidades();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.unidadForm.reset({ estado: true });
    }
  }

  viewSeccion(id: number): void {
    const unidad = this.unidades.find(s => s.id_unidad === id);
    if (unidad) {
      alert(`Ver sección:\nID: ${unidad.id_unidad}\nNombre: ${unidad.nombre}`);
    }
  }

  editSeccion(id: number): void {
    this.isEditing = true;
    this.editingSeccionId = id;
    const unidad = this.unidades.find(s => s.id_unidad === id);
    if (unidad) {
      this.unidadForm.patchValue({
        nombre: unidad.nombre,
        estado: unidad.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteSeccion(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta sección?')) {
      this.unidadesService.eliminarUnidad(id).subscribe({
        next: () => {
          this.cargarUnidades();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar unidad:', error);
        }
      });
    }
  }

  detailSeccion(id: number): void {
    const unidad = this.unidades.find(s => s.id_unidad === id);
    if (unidad) {
      alert(`Detalle sección:\nID: ${unidad.id_unidad}\nNombre: ${unidad.nombre}\nEstado: ${unidad.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.unidadForm.invalid) return;
    const seccionData = this.unidadForm.value;
    if (this.isEditing && this.editingSeccionId) {
      // Editar
      this.unidadesService.actualizarUnidad(this.editingSeccionId, seccionData).subscribe({
        next: () => {
          this.cargarUnidades();
          this.isEditing = false;
          this.editingSeccionId = undefined;
          this.unidadForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar sección:', error);
        }
      });
    } else {
      // Crear
      this.unidadesService.crearUnidad(seccionData).subscribe({
        next: () => {
          this.cargarUnidades();
          this.unidadForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear sección:', error);
        }
      });
    }
  }
}
