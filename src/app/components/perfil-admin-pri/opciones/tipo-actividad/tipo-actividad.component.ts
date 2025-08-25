import { Component, OnInit, inject } from '@angular/core';
import { TipoActividadService,TipoActividad } from '../../../../services/tipo-actividad.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// interface TipoActividad {
//   id_tipo_actividad?: number;
//   nombre: string;
//   estado?: boolean;
// }

@Component({
    selector: 'app-tipo-actividad',
    templateUrl: './tipo-actividad.component.html',
    styleUrls: ['./tipo-actividad.component.css'],
    standalone: false
})
export class TipoActividadComponent implements OnInit {
  Math = Math;
  tipoActividades: TipoActividad[] = [];
  filteredTipoActividades: TipoActividad[] = [];
  paginatedTipoActividades: TipoActividad[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingTipoActividadId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  tipoActividadForm!: FormGroup;
  private fb = inject(FormBuilder);
  private tipoActividadService = inject(TipoActividadService);

  ngOnInit(): void {
    this.initForm();
    this.cargarTipoActividades();
  }

  cargarTipoActividades(): void {
    this.loading = true;
    this.tipoActividadService.getTipoActividades().subscribe({
      next: (data: TipoActividad[]) => {
        this.tipoActividades = data;
        this.filteredTipoActividades = [...data];
        this.updatePaginatedTipoActividades();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar tipo_actividad:', error);
      }
    });
  }

  private initForm(): void {
    this.tipoActividadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      estado: [true, [Validators.required]]
    });
  }

  filterTipoActividad(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTipoActividades = [...this.tipoActividades];
    } else {
      this.filteredTipoActividades = this.tipoActividades.filter(tm =>
        tm.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedTipoActividades();
  }

  updatePaginatedTipoActividades(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTipoActividades = this.filteredTipoActividades.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTipoActividades();
  }

  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
  }

  viewTipoActividad(id: number): void {
    const tm = this.tipoActividades.find(t => t.id_tipo_actividad === id);
    if (tm) {
      alert(`Ver tipo_actividad:\nID: ${tm.id_tipo_actividad}\nNombre: ${tm.nombre}`);
    }
  }

  editTipoActividad(id: number): void {
    this.isEditing = true;
    this.editingTipoActividadId = id;
    const tm = this.tipoActividades.find(t => t.id_tipo_actividad === id);
    if (tm) {
      this.tipoActividadForm.patchValue({
        nombre: tm.nombre,
        descripcion: tm.descripcion,
        estado: tm.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteTipoActividad(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de actividad?')) {
      this.tipoActividadService.eliminarTipoActividad(id).subscribe({
        next: () => {
          this.cargarTipoActividades();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar tipo_actividad:', error);
        }
      });
    }
  }

  detailTipoActividad(id: number): void {
    const ta = this.tipoActividades.find(t => t.id_tipo_actividad === id);
    if (ta) {
      alert(`Detalle tipo_actividad:\nID: ${ta.id_tipo_actividad}\nNombre: ${ta.nombre}\nEstado: ${ta.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.tipoActividadForm.invalid) return;
    const formValue = this.tipoActividadForm.value;
    this.loading = true;
    if (this.isEditing && this.editingTipoActividadId) {
      this.tipoActividadService.actualizarTipoActividad(this.editingTipoActividadId, formValue).subscribe({
        next: () => {
          this.cargarTipoActividades();
          this.isEditing = false;
          this.editingTipoActividadId = undefined;
          this.tipoActividadForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al actualizar tipo_actividad:', error);
        }
      });
    } else {
      this.tipoActividadService.crearTipoActividad(formValue).subscribe({
        next: () => {
          this.cargarTipoActividades();
          this.tipoActividadForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al crear tipo_actividad:', error);
        }
      });
    }
  }

  // ...existing code...
}
