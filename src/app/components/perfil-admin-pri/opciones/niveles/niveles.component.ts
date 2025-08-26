import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NivelesService, Nivel } from '../../../../services/niveles.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-niveles',
    templateUrl: './niveles.component.html',
    styleUrls: ['./niveles.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class NivelesComponent implements OnInit {
  Math = Math;
  niveles: Nivel[] = [];
  filteredNiveles: Nivel[] = [];
  paginatedNiveles: Nivel[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingNivelId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  nivelForm!: FormGroup;
  private fb = inject(FormBuilder);
  private nivelesService = inject(NivelesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarNiveles();
  }

  cargarNiveles(): void {
    this.loading = true;
    this.nivelesService.getNiveles().subscribe({
      next: (data: Nivel[]) => {
        this.niveles = data;
        this.filteredNiveles = [...data];
        this.updatePaginatedNiveles();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar niveles:', error);
      }
    });
  }

  private initForm(): void {
    this.nivelForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      estado: [true, [Validators.required]]
    });
  }

  filterNiveles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredNiveles = [...this.niveles];
    } else {
      this.filteredNiveles = this.niveles.filter(nivel =>
        nivel.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedNiveles();
  }

  updatePaginatedNiveles(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedNiveles = this.filteredNiveles.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedNiveles();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.nivelForm.reset({ estado: true });
    }
  }

  viewNivel(id: number): void {
    const nivel = this.niveles.find(e => e['id'] === id);
    if (!nivel) {
      this.handleError('Nivel no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Nivel`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${nivel.nombre}</p>
          <p><strong>Estado:</strong> ${nivel.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

  }

  editNivel(id_nivel: number): void {
    this.isEditing = true;
    this.editingNivelId = id_nivel;
    const nivel = this.niveles.find(n => n.id_nivel === id_nivel);
    if (nivel) {
      this.nivelForm.patchValue({
        nombre: nivel.nombre,
        estado: nivel.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteNivel(id_nivel: number): void {
    const nivel = this.niveles.find(n => n.id_nivel === id_nivel);
    if (!nivel) {
      this.handleError('Nivel no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Nivel?',
      text: `¿Estás seguro de que deseas eliminar el nivel "${nivel.nombre}"?`,
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
        this.nivelesService.deleteNivel(id_nivel).subscribe({
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

  detailNivel(id_nivel: number): void {
    const nivel = this.niveles.find(p => p['id_nivel'] === id_nivel);
    if (nivel) {
      Swal.fire({
        title: 'Detalle nivel',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${nivel['id']}</p>
            <p><strong>Nombre:</strong> ${nivel.nombre}</p>
            <p><strong>Estado:</strong> ${nivel.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  onSubmit(): void {
    if (this.nivelForm.invalid) return;
    const nivelData = this.nivelForm.value;
    if (this.isEditing && this.editingNivelId) {
      // Editar
      this.nivelesService.updateNivel(this.editingNivelId, nivelData).subscribe({
        next: () => {
          this.cargarNiveles();
          this.isEditing = false;
          this.editingNivelId = undefined;
          this.nivelForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar nivel:', error);
        }
      });
    } else {
      // Crear
      this.nivelesService.addNivel(nivelData).subscribe({
        next: () => {
          this.cargarNiveles();
          this.nivelForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear nivel:', error);
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
