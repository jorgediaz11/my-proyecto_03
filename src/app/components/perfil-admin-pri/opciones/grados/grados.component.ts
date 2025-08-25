import { Component, OnInit, inject } from '@angular/core';
import { GradosService, Grado } from '../../../../services/grados.service';
import { NivelesService, Nivel } from '../../../../services/niveles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-grados',
    templateUrl: './grados.component.html',
    styleUrls: ['./grados.component.css'],
    standalone: false
})
export class GradosComponent implements OnInit {
  Math = Math;
  grados: Grado[] = [];
  filteredGrados: Grado[] = [];
  paginatedGrados: Grado[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingGradoId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  // Niveles para el selector
  niveles: Nivel[] = [];
  selectedNivel: number | null = null;

  gradoForm!: FormGroup;
  private fb = inject(FormBuilder);
  private gradosService = inject(GradosService);
  private nivelesService = inject(NivelesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarGrados();
    this.cargarNiveles();
  }

  cargarNiveles(): void {
    this.nivelesService.getNiveles().subscribe({
      next: (niveles: Nivel[]) => {
        this.niveles = niveles.filter(n => n.estado);
      },
      error: (error: unknown) => {
        console.error('Error al cargar niveles:', error);
      }
    });
  }

  cargarGrados(): void {
    this.loading = true;
    this.gradosService.getGrados().subscribe({
      next: (data: Grado[]) => {
        this.grados = data;
        this.filteredGrados = [...data];
        this.updatePaginatedGrados();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar grados:', error);
      }
    });
  }

  private initForm(): void {
    this.gradoForm = this.fb.group({
      nivel: [null, [Validators.required]], // solo id
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      estado: [true, [Validators.required]]
    });
  }

  filterGrados(): void {
    let gradosFiltrados = [...this.grados];
    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      gradosFiltrados = gradosFiltrados.filter(grado => {
        let nivelNombre = '';
        if (grado.nivel && typeof grado.nivel === 'object' && 'nombre' in grado.nivel) {
          nivelNombre = (grado.nivel as { nombre: string }).nombre;
        } else {
          nivelNombre = String(grado.nivel);
        }
        return grado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (nivelNombre && nivelNombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
      });
    }
    // Filtro por nivel seleccionado
    if (this.selectedNivel) {
      gradosFiltrados = gradosFiltrados.filter(grado => {
        if (grado.nivel && typeof grado.nivel === 'object' && 'id_nivel' in grado.nivel) {
          return String((grado.nivel as { id_nivel: number }).id_nivel) === String(this.selectedNivel);
        } else {
          return String(grado.nivel) === String(this.selectedNivel);
        }
      });
    }
    this.filteredGrados = gradosFiltrados;
    this.currentPage = 1;
    this.updatePaginatedGrados();
  }

  // (Eliminado duplicado de getNivelNombre)

  updatePaginatedGrados(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedGrados = this.filteredGrados.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedGrados();
  }

  // Método para mostrar el nombre del nivel en la tabla
  getNivelNombre(nivel: any): string {
    if (nivel && typeof nivel === 'object' && 'nombre' in nivel) {
      return nivel.nombre;
    }
    const found = this.niveles.find(n => String(n.id_nivel) === String(nivel));
    return found ? found.nombre : String(nivel);
  }

  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
  }

  viewPerfil(id_grado: number): void {
    const grado = this.grados.find(e => e.id_grado === id_grado);
    if (!grado) {
      this.handleError('Perfil no encontrado');
      return;
    }

    Swal.fire({
      title: `Detalles del Perfil`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${grado.nombre}</p>
          <p><strong>Apellidos:</strong> ${grado.descripcion}</p>
          <p><strong>Estado:</strong> ${grado.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

  }  

  editGrado(id: number): void {
    this.isEditing = true;
    this.editingGradoId = id;
    const grado = this.grados.find(g => g.id_grado === id);
    if (grado) {
      this.gradoForm.patchValue({
        nivel: grado.nivel,
        nombre: grado.nombre,
        estado: grado.estado
      });
      this.selectTab('nuevo');
    }
  }

 deleteGrado(id_grado: number): void {
    const grado = this.grados.find(p => p.id_grado === id_grado);
    if (!grado) {
      this.handleError('Grado no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Grado?',
      text: `¿Estás seguro de que deseas eliminar el Grado "${grado.nombre}"?`,
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
        this.gradosService.eliminarGrado(id_grado).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Grado eliminado correctamente');
            this.cargarGrados();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el grado');
            console.error('Error:', error);
          }
        });
      }
    });
  }

  detailGrado(id_grado: number): void {
    const grado = this.grados.find(p => p.id_grado === id_grado);
    if (grado) {
      Swal.fire({
        title: 'Detalle perfil',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${grado.id_grado}</p>
            <p><strong>Nombre:</strong> ${grado.nombre}</p>
            <p><strong>Descripción:</strong> ${grado.descripcion}</p>
            <p><strong>Estado:</strong> ${grado.estado ? 'Activo' : 'Inactivo'}</p>
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
