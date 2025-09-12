
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Perfil, PerfilesService } from '../../../../services/perfiles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfiles-gen.component.html',
  styleUrls: ['./perfiles-gen.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PerfilGenComponent implements OnInit {
  // Propiedades principales
  perfiles: Perfil[] = [];
  filteredPerfiles: Perfil[] = [];
  paginatedPerfiles: Perfil[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingPerfilId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';
  Math = Math;

  perfilForm!: FormGroup;
  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilesService);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarPerfiles();
  }

  cargarPerfiles(): void {
    this.loading = true;
    this.perfilService.getPerfiles().subscribe({
      next: (perfiles: Perfil[]) => {
        this.perfiles = perfiles || [];
        this.filteredPerfiles = [...this.perfiles];
        this.updatePagination();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar perfiles:', error);
      }
    });
  }

  // Inicialización del formulario
  private initForm(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      estado: [true, [Validators.required]]
    });
  }

  // Filtrado
  filterPerfiles(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    let filtered = [...this.perfiles];
    if (searchTerm) {
      filtered = filtered.filter(perfil =>
        perfil.nombre.toLowerCase().includes(searchTerm) ||
        perfil.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    this.filteredPerfiles = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  // Paginación
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPerfiles = this.filteredPerfiles.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    const totalPages = this.getTotalPages().length;
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredPerfiles.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Crear perfil
  createPerfil(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingPerfilId = undefined;
    this.activeTab = 'nuevo';
  }

  // Editar perfil
  editPerfil(id: number): void {
    this.isEditing = true;
    this.editingPerfilId = id;
    this.activeTab = 'nuevo';
    const perfil = this.perfiles.find(p => p.id === id);
    if (perfil) {
      this.perfilForm.patchValue({
        nombre: perfil.nombre,
        descripcion: perfil.descripcion,
        estado: perfil.estado
      });
    }
  }

  // Ver perfil
  viewPerfil(id: number): void {
    const perfil = this.perfiles.find(e => e.id === id);
    if (!perfil) {
      this.handleError('Perfil no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Perfil`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${perfil.nombre}</p>
          <p><strong>Apellidos:</strong> ${perfil.descripcion}</p>
          <p><strong>Estado:</strong> ${perfil.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

  }

  // ELIMINAR PERFIL
  deletePerfil(id: number): void {
    const perfil = this.perfiles.find(p => p.id === id);
    if (!perfil) {
      this.handleError('Perfil no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Perfil?',
      text: `¿Estás seguro de que deseas eliminar el perfil "${perfil.nombre}"?`,
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
        this.perfilService.eliminarPerfil(id).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Perfil eliminado correctamente');
            this.cargarPerfiles();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el perfil');
            console.error('Error:', error);
          }
        });
      }
    });
  }

  // Submit formulario
  onSubmit(): void {
    if (this.perfilForm.invalid) {
      this.markFormGroupTouched();
      this.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }
    this.loading = true;
    const formValue = this.perfilForm.value;
    if (this.isEditing && this.editingPerfilId) {
      // Actualizar perfil
      this.perfilService.actualizarPerfil(this.editingPerfilId, formValue).subscribe({
        next: () => {
          this.cargarPerfiles();
          this.resetForm();
          this.activeTab = 'tabla';
          this.showSuccess('Perfil actualizado correctamente');
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al actualizar perfil:', error);
          this.showError('Error al actualizar el perfil');
        }
      });
    } else {
      // Crear nuevo perfil
      this.perfilService.crearPerfil(formValue).subscribe({
        next: () => {
          this.cargarPerfiles();
          this.resetForm();
          this.activeTab = 'tabla';
          this.showSuccess('Perfil creado correctamente');
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al crear perfil:', error);
          this.showError('Error al crear el perfil');
        }
      });
    }
  }

  // Reset form
  resetForm(): void {
    this.perfilForm.reset({
      estado: true
    });
    this.isEditing = false;
    this.editingPerfilId = undefined;
  }

  // Utilidades
  markFormGroupTouched(): void {
    Object.keys(this.perfilForm.controls).forEach(key => {
      const control = this.perfilForm.get(key);
      control?.markAsTouched();
    });
  }

  showError(message: string): void {
    alert(message);
  }

  showSuccess(message: string): void {
    alert(message);
  }

  // Informativo (detalle)
  detailPerfil(id: number): void {
    const perfil = this.perfiles.find(p => p.id === id);
    if (perfil) {
      Swal.fire({
        title: 'Detalle perfil',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${perfil.id}</p>
            <p><strong>Nombre:</strong> ${perfil.nombre}</p>
            <p><strong>Descripción:</strong> ${perfil.descripcion}</p>
            <p><strong>Estado:</strong> ${perfil.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  trackByPerfilId(index: number, perfil: Perfil): number | undefined {
    return perfil.id;
  }

  // ✅ CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // Método para cancelar la edición y limpiar el formulario
  cancelEdit(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingPerfilId = undefined;
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
