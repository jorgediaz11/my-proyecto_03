import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area, AreasService } from 'src/app/services/areas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-areas',
  templateUrl: './areas-gen.component.html',
  styleUrls: ['./areas-gen.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AreasGenComponent implements OnInit {
  Math = Math;
  areas: Area[] = [];
  filteredAreas: Area[] = [];
  paginatedAreas: Area[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingAreaId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  areaForm!: FormGroup;
  private fb = inject(FormBuilder);
  private areasService = inject(AreasService);

  ngOnInit(): void {
    this.initForm();
    this.cargarAreas();
  }

  cargarAreas(): void {
    this.loading = true;
    this.areasService.getAreas().subscribe({
      next: (data: Area[]) => {
        this.areas = data;
        this.filteredAreas = [...data];
        this.updatePaginatedAreas();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar áreas:', error);
      }
    });
  }

  private initForm(): void {
    this.areaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      estado: [true, [Validators.required]],
      id_grado: [null]
    });
  }

  filterAreas(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAreas = [...this.areas];
    } else {
      this.filteredAreas = this.areas.filter(area =>
        (area.nombre || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedAreas();
  }

  updatePaginatedAreas(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAreas = this.filteredAreas.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedAreas();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.areaForm.reset({ estado: true });
    }
  }

  viewArea(id_area: number): void {
    const area = this.areas.find(a => a.id_area === id_area);
    if (area) {
      Swal.fire({
        title: `Detalles del Área`,
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${area.id_area}</p>
            <p><strong>Nombre:</strong> ${area.nombre}</p>
            <p><strong>Estado:</strong> ${area.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  editArea(id_area: number): void {
    this.isEditing = true;
    this.editingAreaId = id_area;
    const area = this.areas.find(a => a.id_area === id_area);
    if (area) {
      this.areaForm.patchValue({
        nombre: area.nombre,
        descripcion: area.descripcion,
        estado: area.estado,
        id_grado: area.id_grado
      });
      this.selectTab('nuevo');
    }
  }

  deleteArea(id_area: number): void {
    const area = this.areas.find(a => a.id_area === id_area);
    if (!area) {
      this.handleError('Área no encontrada');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Área?',
      text: `¿Estás seguro de que deseas eliminar el área "${area.nombre}"?`,
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
        this.areasService.eliminarArea(id_area).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Área eliminada correctamente');
            this.cargarAreas();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el área');
            console.error('Error:', error);
          }
        });
      }
    });
  }

  detailArea(id_area: number): void {
    const area = this.areas.find(a => a.id_area === id_area);
    if (area) {
      Swal.fire({
        title: 'Detalle área',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${area.id_area}</p>
            <p><strong>Nombre:</strong> ${area.nombre}</p>
            <p><strong>Estado:</strong> ${area.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

  onSubmit(): void {
    if (this.areaForm.invalid) return;
    const areaData = this.areaForm.value;
    if (this.isEditing && this.editingAreaId) {
      // Editar
      this.areasService.actualizarArea(this.editingAreaId, areaData).subscribe({
        next: () => {
          this.cargarAreas();
          this.isEditing = false;
          this.editingAreaId = undefined;
          this.areaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar área:', error);
        }
      });
    } else {
      // Crear
      this.areasService.crearArea(areaData).subscribe({
        next: () => {
          this.cargarAreas();
          this.areaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear área:', error);
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
