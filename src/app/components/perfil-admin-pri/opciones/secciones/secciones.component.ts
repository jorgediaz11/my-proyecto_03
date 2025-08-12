import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeccionesService } from '../../../../services/secciones.service';

interface Seccion {
  id_seccion?: number;
  nombre: string;
  estado: boolean;
}

@Component({
    selector: 'app-secciones',
    templateUrl: './secciones.component.html',
    styleUrls: ['./secciones.component.css'],
    standalone: false
})
export class SeccionesComponent implements OnInit {
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
    const seccion = this.secciones.find(s => s.id_seccion === id_seccion);
    if (seccion) {
      alert(`Ver sección:\nID: ${seccion.id_seccion}\nNombre: ${seccion.nombre}`);
    }
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
    if (confirm('¿Estás seguro de que deseas eliminar esta sección?')) {
      this.seccionesService.eliminarSeccion(id_seccion).subscribe({
        next: () => {
          this.cargarSecciones();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar sección:', error);
        }
      });
    }
  }

  detailSeccion(id_seccion: number): void {
    const seccion = this.secciones.find(s => s.id_seccion === id_seccion);
    if (seccion) {
      alert(`Detalle sección:\nID: ${seccion.id_seccion}\nNombre: ${seccion.nombre}\nEstado: ${seccion.estado ? 'Activo' : 'Inactivo'}`);
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
}
