import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Leccion, LeccionesService } from 'src/app/services/lecciones.service';

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.component.html',
  // styleUrls: ['./lecciones.component.css']
})
export class LeccionesComponent implements OnInit {
  Math = Math;
  lecciones: Leccion[] = [];
  filteredLecciones: Leccion[] = [];
  paginatedLecciones: Leccion[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingLeccionId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  leccionForm!: FormGroup;
  private fb = inject(FormBuilder);
  private leccionesService = inject(LeccionesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarLecciones();
  }

  cargarLecciones(): void {
    this.loading = true;
    this.leccionesService.getLecciones().subscribe({
      next: (data: Leccion[]) => {
        this.lecciones = data;
        this.filteredLecciones = [...data];
        this.updatePaginatedLecciones();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar lecciones:', error);
      }
    });
  }

  private initForm(): void {
    this.leccionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      contenido: ['', [Validators.required]],
      descripcion: [''],
      orden: [null],
      estado: [true, [Validators.required]],
      id_unidad: [null]
    });
  }

  filterLecciones(): void {
    if (!this.searchTerm.trim()) {
      this.filteredLecciones = [...this.lecciones];
    } else {
      this.filteredLecciones = this.lecciones.filter(leccion =>
        (leccion.titulo || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedLecciones();
  }

  updatePaginatedLecciones(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLecciones = this.filteredLecciones.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedLecciones();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.leccionForm.reset({ estado: true });
    }
  }

  viewLeccion(id_leccion: number): void {
    const leccion = this.lecciones.find(l => l.id_leccion === id_leccion);
    if (leccion) {
      alert(`Ver lección:\nID: ${leccion.id_leccion}\nTítulo: ${leccion.titulo}`);
    }
  }

  editLeccion(id_leccion: number): void {
    this.isEditing = true;
    this.editingLeccionId = id_leccion;
    const leccion = this.lecciones.find(l => l.id_leccion === id_leccion);
    if (leccion) {
      this.leccionForm.patchValue({
        titulo: leccion.titulo,
        contenido: leccion.contenido,
        descripcion: leccion.descripcion,
        orden: leccion.orden,
        estado: leccion.estado,
        id_unidad: leccion.id_unidad
      });
      this.selectTab('nuevo');
    }
  }

  deleteLeccion(id_leccion: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      this.leccionesService.eliminarLeccion(id_leccion).subscribe({
        next: () => {
          this.cargarLecciones();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar lección:', error);
        }
      });
    }
  }

  detailLeccion(id_leccion: number): void {
    const leccion = this.lecciones.find(l => l.id_leccion === id_leccion);
    if (leccion) {
      alert(`Detalle lección:\nID: ${leccion.id_leccion}\nTítulo: ${leccion.titulo}\nEstado: ${leccion.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.leccionForm.invalid) return;
    const leccionData = this.leccionForm.value;
    if (this.isEditing && this.editingLeccionId) {
      // Editar
      this.leccionesService.actualizarLeccion(this.editingLeccionId, leccionData).subscribe({
        next: () => {
          this.cargarLecciones();
          this.isEditing = false;
          this.editingLeccionId = undefined;
          this.leccionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar lección:', error);
        }
      });
    } else {
      // Crear
      this.leccionesService.crearLeccion(leccionData).subscribe({
        next: () => {
          this.cargarLecciones();
          this.leccionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear lección:', error);
        }
      });
    }
  }
}
