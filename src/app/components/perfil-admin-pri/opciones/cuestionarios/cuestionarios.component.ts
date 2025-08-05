
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuestionariosService, Cuestionario } from 'src/app/services/cuestionarios.service';

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

  cuestionarioForm!: FormGroup;
  private fb = inject(FormBuilder);
  private cuestionariosService = inject(CuestionariosService);

  ngOnInit(): void {
    this.initForm();
    this.cargarCuestionarios();
  }

  cargarCuestionarios(): void {
    this.loading = true;
    this.cuestionariosService.getCuestionarios().subscribe({
      next: (data) => {
        this.cuestionarios = data;
        this.filteredCuestionarios = [...data];
        this.updatePaginatedCuestionarios();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
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
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredCuestionarios = [...this.cuestionarios];
    } else {
      this.filteredCuestionarios = this.cuestionarios.filter(cuestionario =>
        cuestionario.titulo.toLowerCase().includes(term)
      );
    }
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
