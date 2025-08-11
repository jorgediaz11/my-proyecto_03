
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuestionariosService, Cuestionario } from 'src/app/services/cuestionarios.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { CursosService, Curso } from 'src/app/services/cursos.service';

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

  viewCuestionario(id_cuestionario: number): void {
    const cuestionario = this.cuestionarios.find(c => c.id_cuestionario === id_cuestionario);
    if (cuestionario) {
      alert(`Ver cuestionario:\nID: ${cuestionario.id_cuestionario}\nTítulo: ${cuestionario.titulo}`);
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
}
