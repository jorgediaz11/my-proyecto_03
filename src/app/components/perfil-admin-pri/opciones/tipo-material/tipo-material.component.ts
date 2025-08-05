import { Component, OnInit, inject } from '@angular/core';
import { TipoMaterialService, TipoMaterial } from '../../../../services/tipo-material.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// interface TipoMaterial {
//   id_tipo_material?: number;
//   nombre: string;
//   estado?: boolean;
// }

@Component({
  selector: 'app-tipo-material',
  templateUrl: './tipo-material.component.html',
  styleUrls: ['./tipo-material.component.css']
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

  viewTipoMaterial(id: number): void {
    const tm = this.tipoMateriales.find(t => t.id_tipo_material === id);
    if (tm) {
      alert(`Ver tipo_material:\nID: ${tm.id_tipo_material}\nNombre: ${tm.nombre}`);
    }
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

  deleteTipoMaterial(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de material?')) {
      this.tipoMaterialService.eliminarTipoMaterial(id).subscribe({
        next: () => {
          this.cargarTipoMateriales();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar tipo_material:', error);
        }
      });
    }
  }

  detailTipoMaterial(id: number): void {
    const tm = this.tipoMateriales.find(t => t.id_tipo_material === id);
    if (tm) {
      alert(`Detalle tipo_material:\nID: ${tm.id_tipo_material}\nNombre: ${tm.nombre}\nEstado: ${tm.estado ? 'Activo' : 'Inactivo'}`);
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
}
