import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeccionesService } from '../../../../services/secciones.service';
import Swal from 'sweetalert2';

interface Seccion {
  id_seccion?: number;
  nombre: string;
  estado: boolean;
}

@Component({
    selector: 'app-secciones',
    templateUrl: './secciones-gen.component.html',
    styleUrls: ['./secciones-gen.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SeccionesGenComponent implements OnInit {
  Math = Math;
  secciones: Seccion[] = [];
  filteredSecciones: Seccion[] = [];
  paginatedSecciones: Seccion[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingSeccionId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  seccionForm!: FormGroup;
  private fb = inject(FormBuilder);
  private seccionesService = inject(SeccionesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarSecciones();
  }

  cargarSecciones(): void {
    this.loading = true;
    this.seccionesService.getSecciones().subscribe({
      next: (data: Seccion[]) => {
        // Solo aceptar objetos con id_seccion definido
        this.secciones = (data || []).filter(s => s.id_seccion !== undefined).map(s => ({
          id_seccion: s.id_seccion,
          nombre: s.nombre,
          estado: s.estado
        }));
        this.filteredSecciones = [...this.secciones];
        this.updatePaginatedSecciones();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar secciones:', error);
      }
    });
  }

  private initForm(): void {
    this.seccionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      estado: [true, [Validators.required]]
    });
  }

  filterSecciones(): void {
    if (!this.searchTerm.trim()) {
      this.filteredSecciones = [...this.secciones];
    } else {
      this.filteredSecciones = this.secciones.filter(seccion =>
        seccion.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedSecciones();
  }

  updatePaginatedSecciones(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSecciones = this.filteredSecciones.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedSecciones();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.seccionForm.reset({ estado: true });
    }
  }

  viewSeccion(id_seccion: number): void {
    const seccion = this.secciones.find(e => e.id_seccion === id_seccion);
    if (!seccion) {
      this.handleError('Sección no encontrada');
      return;
    }

    Swal.fire({
      title: `Detalles de la Sección`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${seccion.nombre}</p>
          <p><strong>Estado:</strong> ${seccion.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

  }  

  editSeccion(id_seccion: number): void {
    this.isEditing = true;
    this.editingSeccionId = id_seccion;
    const seccion = this.secciones.find(s => s.id_seccion === id_seccion);
    if (seccion) {
      this.seccionForm.patchValue({
        nombre: seccion.nombre,
        estado: seccion.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteSeccion(id_seccion: number): void {
    const seccion = this.secciones.find(p => p.id_seccion === id_seccion);
    if (!seccion) {
      this.handleError('Sección no encontrada');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Sección?',
      text: `¿Estás seguro de que deseas eliminar la sección "${seccion.nombre}"?`,
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
        this.seccionesService.eliminarSeccion(id_seccion).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Sección eliminada correctamente');
            this.cargarSecciones();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar la sección');
            console.error('Error:', error);
          }
        });
      }
    });
  }


  detailSeccion(id_seccion: number): void {
    const seccion = this.secciones.find(p => p.id_seccion === id_seccion);
    if (seccion) {
      Swal.fire({
        title: 'Detalle sección',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${seccion.id_seccion}</p>
            <p><strong>Nombre:</strong> ${seccion.nombre}</p>
            <p><strong>Estado:</strong> ${seccion.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }


  onSubmit(): void {
    if (this.seccionForm.invalid) return;
    const seccionData = this.seccionForm.value;
    if (this.isEditing && this.editingSeccionId) {
      // Editar
      this.seccionesService.actualizarSeccion(this.editingSeccionId, seccionData).subscribe({
        next: () => {
          this.cargarSecciones();
          this.isEditing = false;
          this.editingSeccionId = undefined;
          this.seccionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar sección:', error);
        }
      });
    } else {
      // Crear
      this.seccionesService.crearSeccion(seccionData).subscribe({
        next: () => {
          this.cargarSecciones();
          this.seccionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear sección:', error);
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
