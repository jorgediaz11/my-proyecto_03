import { Component, OnInit, inject } from '@angular/core';
import { MaterialService, Material } from '../../../../services/material.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  Math = Math;
  materiales: Material[] = [];
  filteredMateriales: Material[] = [];
  paginatedMateriales: Material[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingGradoId?: number;
  editingMaterialId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  materialForm!: FormGroup;
  private fb = inject(FormBuilder);
  private materialService = inject(MaterialService);

  ngOnInit(): void {
    this.initForm();
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.loading = true;
    this.materialService.getMaterial().subscribe({
      next: (data: Material[]) => {
        this.materiales = data;
        this.filteredMateriales = [...data];
        this.updatePaginatedMateriales();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar material:', error);
      }
    });
  }

  private initForm(): void {
    this.materialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      rutaArchivo: ['', [Validators.required]],
      tamanoBytes: ['', [Validators.required]],
      idTipoMaterial: [null, [Validators.required]],
      idUsuarioCreador: [null, [Validators.required]],
      idConfiguracion: [null],
      estado: [true, [Validators.required]]
    });
  }
  onSubmit(): void {
    if (this.materialForm.invalid) return;
    const formValue = this.materialForm.value;
    this.loading = true;
    if (this.isEditing && this.editingMaterialId) {
      // Actualizar material
      this.materialService.actualizarMaterial(this.editingMaterialId, formValue).subscribe({
        next: () => {
          this.cargarMateriales();
          this.isEditing = false;
          this.editingMaterialId = undefined;
          this.materialForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al actualizar material:', error);
        }
      });
    } else {
      // Crear material
      this.materialService.crearMaterial(formValue).subscribe({
        next: () => {
          this.cargarMateriales();
          this.materialForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al crear material:', error);
        }
      });
    }
  }

  filterMaterial(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMateriales = [...this.materiales];
    } else {
      this.filteredMateriales = this.materiales.filter(material =>
        material.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) //||
        //(material.nivel && String(material.nivel).includes(this.searchTerm))
      );
    }
    this.currentPage = 1;
    this.updatePaginatedMateriales();
  }

  updatePaginatedMateriales(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMateriales = this.filteredMateriales.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedMateriales();
  }

  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado'): void {
    this.activeTab = tab;
  }

  viewMaterial(id: number): void {
    const material = this.materiales.find(g => g.id_material === id);
    if (material) {
      alert(`Ver material:\nID: ${material.id_material}\nNombre: ${material.nombre}`);
    }
  }

  editMaterial(id: number): void {
    this.isEditing = true;
    this.editingMaterialId = id;
    const material = this.materiales.find(g => g.id_material === id);
    if (material) {
      this.materialForm.patchValue({
        nombre: material.nombre,
        descripcion: material.descripcion,
        rutaArchivo: material.rutaArchivo,
        tamanoBytes: material.tamanoBytes,
        idTipoMaterial: material.idTipoMaterial,
        idUsuarioCreador: material.idUsuarioCreador,
        idConfiguracion: material.idConfiguracion,
        estado: material.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteMaterial(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this.materialService.eliminarMaterial(id).subscribe({
        next: () => {
          this.cargarMateriales();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar material:', error);
        }
      });
    }
  }

  detailMaterial(id: number): void {
    const material = this.materiales.find(g => g.id_material === id);
    if (material) {
      alert(`Detalle material:\nID: ${material.id_material}\nNombre: ${material.nombre}\nEstado: ${material.estado ? 'Activo' : 'Inactivo'}`);
    }
  }
}
