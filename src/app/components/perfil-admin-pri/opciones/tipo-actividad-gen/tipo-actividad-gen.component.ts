import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoActividadService,TipoActividad } from '../../../../services/tipo-actividad.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// interface TipoActividad {
//   id_tipo_actividad?: number;
//   nombre: string;
//   estado?: boolean;
// }

@Component({
    selector: 'app-tipo-actividad',
    templateUrl: './tipo-actividad-gen.component.html',
    styleUrls: ['./tipo-actividad-gen.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ]    
})
export class TipoActividadGenComponent implements OnInit {
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

  viewTipoActividad(id_tipo_actividad: number): void {
    const ta = this.tipoActividades.find(t => t.id_tipo_actividad === id_tipo_actividad);
    if (!ta) {
      this.handleError('Tipo de actividad no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Tipo de Actividad`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${ta.nombre}</p>
          <p><strong>Estado:</strong> ${ta.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

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

  deleteTipoActividad(id_tipo_actividad: number): void {
    const ta = this.tipoActividades.find(n => n.id_tipo_actividad === id_tipo_actividad);
    if (!ta) {
      this.handleError('Tipo de actividad no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Nivel?',
      text: `¿Estás seguro de que deseas eliminar el nivel "${ta.nombre}"?`,
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
        this.tipoActividadService.eliminarTipoActividad(id_tipo_actividad).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Tipo de actividad eliminado correctamente');
            this.cargarTipoActividades();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el tipo de actividad');
            console.error('Error:', error);
          }
        });
      }
    });
  }

  detailTipoActividad(id_tipo_actividad: number): void {
    const ta = this.tipoActividades.find(p => p['id_tipo_actividad'] === id_tipo_actividad);
    if (ta) {
      Swal.fire({
        title: 'Detalle tipo_actividad',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${ta['id_tipo_actividad']}</p>
            <p><strong>Nombre:</strong> ${ta.nombre}</p>
            <p><strong>Estado:</strong> ${ta.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
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
