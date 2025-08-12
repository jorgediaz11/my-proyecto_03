import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Libro, LibrosService } from 'src/app/services/libros.service';

@Component({
    selector: 'app-libros',
    templateUrl: './libros.component.html',
    styleUrls: ['./libros.component.css'],
    standalone: false
})
export class LibrosComponent implements OnInit {
  Math = Math;
  libros: Libro[] = [];
  filteredLibros: Libro[] = [];
  paginatedLibros: Libro[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingLibroId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  libroForm!: FormGroup;
  private fb = inject(FormBuilder);
  private librosService = inject(LibrosService);

  ngOnInit(): void {
    this.initForm();
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.loading = true;
    this.librosService.getLibros().subscribe({
      next: (data: Libro[]) => {
        this.libros = data;
        this.filteredLibros = [...data];
        this.updatePaginatedLibros();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar libros:', error);
      }
    });
  }

  private initForm(): void {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      autor: ['', [Validators.required]],
      descripcion: [''],
      editorial: [''],
      anio_publicacion: [null],
      estado: [true, [Validators.required]],
      id_area: [null]
    });
  }

  filterLibros(): void {
    if (!this.searchTerm.trim()) {
      this.filteredLibros = [...this.libros];
    } else {
      this.filteredLibros = this.libros.filter(libro =>
        (libro.titulo || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedLibros();
  }

  updatePaginatedLibros(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLibros = this.filteredLibros.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedLibros();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.libroForm.reset({ estado: true });
    }
  }

  viewLibro(id_libro: number): void {
    const libro = this.libros.find(l => l.id_libro === id_libro);
    if (libro) {
      alert(`Ver libro:\nID: ${libro.id_libro}\nTítulo: ${libro.titulo}`);
    }
  }

  editLibro(id_libro: number): void {
    this.isEditing = true;
    this.editingLibroId = id_libro;
    const libro = this.libros.find(l => l.id_libro === id_libro);
    if (libro) {
      this.libroForm.patchValue({
        titulo: libro.titulo,
        autor: libro.autor,
        descripcion: libro.descripcion,
        editorial: libro.editorial,
        anio_publicacion: libro.anio_publicacion,
        estado: libro.estado,
        id_area: libro.id_area
      });
      this.selectTab('nuevo');
    }
  }

  deleteLibro(id_libro: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.librosService.eliminarLibro(id_libro).subscribe({
        next: () => {
          this.cargarLibros();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar libro:', error);
        }
      });
    }
  }

  detailLibro(id_libro: number): void {
    const libro = this.libros.find(l => l.id_libro === id_libro);
    if (libro) {
      alert(`Detalle libro:\nID: ${libro.id_libro}\nTítulo: ${libro.titulo}\nEstado: ${libro.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.libroForm.invalid) return;
    const libroData = this.libroForm.value;
    if (this.isEditing && this.editingLibroId) {
      // Editar
      this.librosService.actualizarLibro(this.editingLibroId, libroData).subscribe({
        next: () => {
          this.cargarLibros();
          this.isEditing = false;
          this.editingLibroId = undefined;
          this.libroForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar libro:', error);
        }
      });
    } else {
      // Crear
      this.librosService.crearLibro(libroData).subscribe({
        next: () => {
          this.cargarLibros();
          this.libroForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear libro:', error);
        }
      });
    }
  }
}
