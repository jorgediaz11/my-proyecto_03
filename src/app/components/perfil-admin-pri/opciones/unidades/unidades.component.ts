import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnidadesService } from '../../../../services/unidades.service';

interface Unidad {
  id_unidad?: number;
  id_curso?: number;
  nombre: string;
  orden?: number;
  descripcion?: string;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {
  Math = Math;
  unidades: Unidad[] = [];
  filteredUnidades: Unidad[] = [];
  paginatedUnidades: Unidad[] = [];
  filteredSecciones: Unidad[] = [];
  paginatedSecciones: Unidad[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingSeccionId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  unidadForm!: FormGroup;
  private fb = inject(FormBuilder);
  private unidadesService = inject(UnidadesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarUnidades();
  }

  cargarUnidades(): void {
    this.loading = true;
    this.unidadesService.getUnidades().subscribe({
      next: (data: Unidad[]) => {
        // Solo aceptar objetos con id_unidad definido y mapear el objeto completo
        this.unidades = (data || []).filter(s => s.id_unidad !== undefined).map(s => ({ ...s }));
        this.filteredUnidades = [...this.unidades];
        this.updatePaginatedUnidades();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar unidades:', error);
      }
    });
  }

  private initForm(): void {
    this.unidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      estado: [true, [Validators.required]]
    });
  }

  filterUnidades(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUnidades = [...this.unidades];
    } else {
      this.filteredUnidades = this.unidades.filter(unidad =>
        unidad.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedUnidades();
  }

  updatePaginatedUnidades(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUnidades = this.filteredUnidades.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUnidades();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.unidadForm.reset({ estado: true });
    }
  }

  viewSeccion(id: number): void {
    const unidad = this.unidades.find(s => s.id_unidad === id);
    if (unidad) {
      alert(`Ver sección:\nID: ${unidad.id_unidad}\nNombre: ${unidad.nombre}`);
    }
  }

  editSeccion(id: number): void {
    this.isEditing = true;
    this.editingSeccionId = id;
    const unidad = this.unidades.find(s => s.id_unidad === id);
    if (unidad) {
      this.unidadForm.patchValue({
        nombre: unidad.nombre,
        estado: unidad.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteSeccion(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta sección?')) {
      this.unidadesService.eliminarUnidad(id).subscribe({
        next: () => {
          this.cargarUnidades();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar unidad:', error);
        }
      });
    }
  }

  detailSeccion(id: number): void {
    const unidad = this.unidades.find(s => s.id_unidad === id);
    if (unidad) {
      alert(`Detalle sección:\nID: ${unidad.id_unidad}\nNombre: ${unidad.nombre}\nEstado: ${unidad.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.unidadForm.invalid) return;
    const seccionData = this.unidadForm.value;
    if (this.isEditing && this.editingSeccionId) {
      // Editar
      this.unidadesService.actualizarUnidad(this.editingSeccionId, seccionData).subscribe({
        next: () => {
          this.cargarUnidades();
          this.isEditing = false;
          this.editingSeccionId = undefined;
          this.unidadForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar sección:', error);
        }
      });
    } else {
      // Crear
      this.unidadesService.crearUnidad(seccionData).subscribe({
        next: () => {
          this.cargarUnidades();
          this.unidadForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear sección:', error);
        }
      });
    }
  }
}
