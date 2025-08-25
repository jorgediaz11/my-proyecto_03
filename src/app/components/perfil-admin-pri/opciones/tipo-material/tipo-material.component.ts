import { Component, OnInit, inject } from '@angular/core';
import { TipoMaterialService, TipoMaterial } from '../../../../services/tipo-material.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// interface TipoMaterial {
//   id_tipo_material?: number;
//   nombre: string;
//   estado?: boolean;
// }

@Component({
    selector: 'app-tipo-material',
    templateUrl: './tipo-material.component.html',
    styleUrls: ['./tipo-material.component.css'],
    standalone: false
})
export class TipoMaterialComponent implements OnInit {
  Math = Math;
  tipoMateriales: TipoMaterial[] = [];
  filteredTipoMateriales: TipoMaterial[] = [];
  paginatedTipoMateriales: TipoMaterial[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingTipoMaterialId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  tipoMaterialForm!: FormGroup;
  private fb = inject(FormBuilder);
  private tipoMaterialService = inject(TipoMaterialService);

  ngOnInit(): void {
    this.initForm();
    this.cargarTipoMateriales();
  }

  cargarTipoMateriales(): void {
    this.loading = true;
    this.tipoMaterialService.getTipoMateriales().subscribe({
      next: (data: TipoMaterial[]) => {
        this.tipoMateriales = data;
        this.filteredTipoMateriales = [...data];
        this.updatePaginatedTipoMateriales();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar tipo_material:', error);
      }
    });
  }

  private initForm(): void {
    this.tipoMaterialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      estado: [true, [Validators.required]]
    });
  }

  filterTipoMaterial(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTipoMateriales = [...this.tipoMateriales];
    } else {
      this.filteredTipoMateriales = this.tipoMateriales.filter(tm =>
        tm.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedTipoMateriales();
  }

  updatePaginatedTipoMateriales(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTipoMateriales = this.filteredTipoMateriales.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTipoMateriales();
  }

  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
  }

  viewTipoMaterial(id_tipo_material: number): void {
    const tm = this.tipoMateriales.find(e => e['id_tipo_material'] === id_tipo_material);
    if (!tm) {
      this.handleError('Nivel no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Nivel`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${tm.nombre}</p>
          <p><strong>Estado:</strong> ${tm.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

  }

  editTipoMaterial(id: number): void {
    this.isEditing = true;
    this.editingTipoMaterialId = id;
    const tm = this.tipoMateriales.find(t => t.id_tipo_material === id);
    if (tm) {
      this.tipoMaterialForm.patchValue({
        nombre: tm.nombre,
        descripcion: tm.descripcion,
        estado: tm.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteTipoMaterial(id_tipo_material: number): void {
    const tipoMaterial = this.tipoMateriales.find(n => n.id_tipo_material === id_tipo_material);
    if (!tipoMaterial) {
      this.handleError('Tipo de material no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Tipo de Material?',
      text: `¿Estás seguro de que deseas eliminar el tipo de material "${tipoMaterial.nombre}"?`,
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
        this.tipoMaterialService.eliminarTipoMaterial(id_tipo_material).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Tipo de material eliminado correctamente');
            this.cargarTipoMateriales();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el tipo de material');
            console.error('Error:', error);
          }
        });
      }
    });
  }  

  detailTipoMaterial(id_tipo_material: number): void {
    const tm = this.tipoMateriales.find(t => t.id_tipo_material === id_tipo_material);
    if (tm) {
      Swal.fire({
        title: 'Detalle tipo_material',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${tm.id_tipo_material}</p>
            <p><strong>Nombre:</strong> ${tm.nombre}</p>
            <p><strong>Estado:</strong> ${tm.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  onSubmit(): void {
    if (this.tipoMaterialForm.invalid) return;
    const formValue = this.tipoMaterialForm.value;
    this.loading = true;
    if (this.isEditing && this.editingTipoMaterialId) {
      this.tipoMaterialService.actualizarTipoMaterial(this.editingTipoMaterialId, formValue).subscribe({
        next: () => {
          this.cargarTipoMateriales();
          this.isEditing = false;
          this.editingTipoMaterialId = undefined;
          this.tipoMaterialForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al actualizar tipo_material:', error);
        }
      });
    } else {
      this.tipoMaterialService.crearTipoMaterial(formValue).subscribe({
        next: () => {
          this.cargarTipoMateriales();
          this.tipoMaterialForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al crear tipo_material:', error);
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
