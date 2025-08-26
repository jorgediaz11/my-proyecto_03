import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Libro, LibrosService } from 'src/app/services/libros.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-libros',
    templateUrl: './libros.component.html',
    styleUrls: ['./libros.component.css'],
    standalone: true,
    imports: []
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
    //alert('Componente inicializado');
    this.initForm();
    this.cargarLibros();
  }

  cargarLibros(): void {
    //alert('Cargando libros...');
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
      codigointerno: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      lineanegocio: [''],
      id_nivel: [null, [Validators.required]],
      coleccion: [''],
      costolibro: [null, [Validators.required]],
      estado: [true, [Validators.required]]
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

  getPagesArray(): number[] {
    const totalPages = Math.ceil(this.filteredLibros.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      if (!this.isEditing) {
        this.libroForm.reset({ estado: true });
      }
    } else {
      this.isEditing = false;
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
    this.librosService.getLibroById(id_libro).subscribe({
      next: (libro) => {
        this.libroForm.patchValue({
          codigointerno: libro.codigointerno ?? '',
          isbn: libro.isbn ?? '',
          titulo: libro.titulo ?? '',
          descripcion: libro.descripcion ?? '',
          lineanegocio: libro.lineanegocio ?? '',
          id_nivel: libro.id_nivel ?? null,
          coleccion: libro.coleccion ?? '',
          costolibro: libro.costolibro ?? null,
          estado: libro.estado ?? true
        });
        this.selectTab('nuevo');
      },
      error: (error) => {
        console.error('Error al obtener libro por ID:', error);
      }
    });
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

viewContenido(id_libro: number): void {
    const libro = this.libros.find(l => l.id_libro === id_libro);
    if (!libro) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró el libro seleccionado.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        width: 500
      });
      return;
    }
    let html = `<div style='text-align:left;max-width:500px;'>`;
    html += `<h2 class='text-xl font-bold mb-2'>${libro.titulo}</h2>`;
    html += `<div class='mb-2'><strong>Código Interno:</strong> ${libro.codigointerno || '-'}</div>`;
    html += `<div class='mb-2'><strong>ISBN:</strong> ${libro.isbn || '-'}</div>`;
    html += `<div class='mb-2'><strong>Colección:</strong> ${libro.coleccion || '-'}</div>`;
    html += `<div class='mb-2'><strong>Línea de Negocio:</strong> ${libro.lineanegocio || '-'}</div>`;
    html += `<div class='mb-2'><strong>Costo:</strong> S/ ${libro.costolibro || '-'}</div>`;
    html += `<div class='mb-2'><strong>Estado:</strong> ${libro.estado ? 'Activo' : 'Inactivo'}</div>`;
    html += `</div>`;
    Swal.fire({
      title: 'Detalle del Libro',
      html,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: 600
    });
  }

}
