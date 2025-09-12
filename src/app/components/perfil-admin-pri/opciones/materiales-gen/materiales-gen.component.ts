import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';
import { MaterialesService, Material } from '../../../../services/materiales.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { TipoMaterialService, TipoMaterial } from '../../../../services/tipo-material.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-materiales',
    templateUrl: './materiales-gen.component.html',
    styleUrls: ['./materiales-gen.component.css'],
    standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class MaterialesGenComponent implements OnInit {
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
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // Tipos de material para el selector
  tiposMaterial: TipoMaterial[] = [];
  selectedTipoMaterial: number | null = null;

  materialForm!: FormGroup;
  private fb = inject(FormBuilder);
  private materialService = inject(MaterialesService);
  private tipoMaterialService = inject(TipoMaterialService);


  // Devuelve el id del material, sea id_material o id
  getMaterialId(material: Material): number | string {
    return material.id_material !== undefined ? material.id_material : '';
  }

  ngOnInit(): void {
    this.initForm();
    this.cargarMateriales();
    this.cargarTiposMaterial();
  }

  cargarTiposMaterial(): void {
    this.tipoMaterialService.getTipoMateriales().subscribe({
      next: (tipos: TipoMaterial[]) => {
        this.tiposMaterial = tipos.filter(t => t.estado);
      },
      error: (error: unknown) => {
        console.error('Error al cargar tipos de material:', error);
      }
    });
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
    let materialesFiltrados = [...this.materiales];
    if (this.searchTerm.trim()) {
      materialesFiltrados = materialesFiltrados.filter(material =>
        material.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.selectedTipoMaterial) {
      materialesFiltrados = materialesFiltrados.filter(material => {
        // Puede venir como idTipoMaterial o id_tipo_material
        return (
          (material as Material).idTipoMaterial === this.selectedTipoMaterial ||
          // @ts-expect-error: id_tipo_material may exist in some responses
          material['id_tipo_material'] === this.selectedTipoMaterial
        );
      });
    }
    this.filteredMateriales = materialesFiltrados;
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

  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
  }

  viewMaterial(id_material: number): void {
      const material = this.materiales.find(e => e['id_material'] === id_material);
      if (!material) {
        this.handleError('Material no encontrado');
        return;
      }

      Swal.fire({
        title: `Detalles del Material`,
        html: `
          <div class="text-left">
            <p><strong>Nombres:</strong> ${material.nombre}</p>
            <p><strong>Estado:</strong> ${material.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });

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

  deleteMaterial(id_material: number): void {
    const material = this.materiales.find(n => n.id_material === id_material);
    if (!material) {
      this.handleError('Material no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Material?',
      text: `¿Estás seguro de que deseas eliminar el material "${material.nombre}"?`,
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
        this.materialService.eliminarMaterial(id_material).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Material eliminado correctamente');
            this.cargarMateriales();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el material');
            console.error('Error:', error);
          }
        });
      }
    });
  }


  detailMaterial(id_material: number): void {
    const material = this.materiales.find(g => g.id_material === id_material);
    if (material) {
      Swal.fire({
        title: 'Detalle material',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${material.id_material}</p>
            <p><strong>Nombre:</strong> ${material.nombre}</p>
            <p><strong>Estado:</strong> ${material.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
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
