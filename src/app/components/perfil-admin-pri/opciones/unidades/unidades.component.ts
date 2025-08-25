import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnidadesService } from '../../../../services/unidades.service';
import { NivelesService, Nivel } from '../../../../services/niveles.service';
import { GradosService, Grado } from '../../../../services/grados.service';
import { CursosService, Curso } from '../../../../services/cursos.service';
import Swal from 'sweetalert2';

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
  styleUrls: ['./unidades.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
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
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingUnidadId?: number;
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
        this.unidades = (data || [])
          .filter(s => s.id_unidad !== undefined)
          .map(s => ({ ...s }))
          .sort((a, b) => (a.id_unidad ?? 0) - (b.id_unidad ?? 0));
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
      estado: [true, [Validators.required]],
      descripcion: [''],
      orden: [null, [Validators.required, Validators.min(1)]]
    });
  }

  filterUnidades(): void {
  let resultado = [...this.unidades].sort((a, b) => (a.id_unidad ?? 0) - (b.id_unidad ?? 0));
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
      // Solo resetear si NO estamos editando
      if (!this.isEditing) {
        this.unidadForm.reset({ estado: true });
      }
    }
  }

  viewUnidad(id_unidad: number): void {
    const unidad = this.unidades.find(e => e.id_unidad === id_unidad);
    if (!unidad) {
      this.handleError('Unidad no encontrada');
      return;
    }

    Swal.fire({
      title: `Detalles del Nivel`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${unidad.nombre}</p>
          <p><strong>Estado:</strong> ${unidad.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

  }

  editUnidad(id_unidad: number): void {
    this.isEditing = true;
    this.editingUnidadId = id_unidad;
    const unidad = this.unidades.find(s => s.id_unidad === id_unidad);
    if (unidad) {
      this.selectTab('nuevo');
      this.unidadForm.patchValue({
        nombre: unidad.nombre,
        estado: unidad.estado,
        descripcion: unidad.descripcion ?? '',
        orden: unidad.orden ?? null
      });
      // Usar el id_curso de la unidad seleccionada para la edición
      this.filtroCurso = unidad.id_curso ? String(unidad.id_curso) : '';
    }
  }

  deleteUnidad(id_unidad: number): void {
    const unidad = this.unidades.find(n => n.id_unidad === id_unidad);
    if (!unidad) {
      this.handleError('Unidad no encontrada');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Nivel?',
      text: `¿Estás seguro de que deseas eliminar la unidad "${unidad.nombre}"?`,
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
        this.unidadesService.eliminarUnidad(id_unidad).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Nivel eliminado correctamente');
            this.cargarNiveles();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el nivel');
            console.error('Error:', error);
          }
        });
      }
    });
  }  


  detailUnidad(id_unidad: number): void {
    const unidad = this.unidades.find(s => s.id_unidad === id_unidad);
    if (unidad) {
      Swal.fire({
        title: 'Detalle Unidad',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${unidad.id_unidad}</p>
            <p><strong>Nombre:</strong> ${unidad.nombre}</p>
            <p><strong>Estado:</strong> ${unidad.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  onSubmit(): void {
    if (this.unidadForm.invalid) return;
    // Asegurar que id_curso esté presente
    const cursoId = Number(this.filtroCurso);
    const seccionData = {
      ...this.unidadForm.value,
      id_curso: cursoId > 0 ? cursoId : undefined
    };
    if (this.isEditing && this.editingUnidadId) {
      // Editar
      this.unidadesService.actualizarUnidad(this.editingUnidadId, seccionData).subscribe({
        next: () => {
          this.cargarUnidades();
          this.isEditing = false;
          this.editingUnidadId = undefined;
          this.unidadForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar unidad:', error);
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

}
