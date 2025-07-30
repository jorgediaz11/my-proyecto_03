import { Component, OnInit, inject } from '@angular/core';
import { GradosService, Grado } from '../../../../services/grados.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grados',
  templateUrl: './grados.component.html',
  styleUrls: ['./grados.component.css']
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
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  gradoForm!: FormGroup;
  private fb = inject(FormBuilder);
  private gradosService = inject(GradosService);

  ngOnInit(): void {
    this.initForm();
    this.cargarGrados();
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
    if (!this.searchTerm.trim()) {
      this.filteredGrados = [...this.grados];
    } else {
      this.filteredGrados = this.grados.filter(grado =>
        grado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (grado.nivel && String(grado.nivel).includes(this.searchTerm))
      );
    }
    this.currentPage = 1;
    this.updatePaginatedGrados();
  }

  updatePaginatedGrados(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedGrados = this.filteredGrados.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedGrados();
  }

  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado'): void {
    this.activeTab = tab;
  }

  viewGrado(id: number): void {
    const grado = this.grados.find(g => g.id_grado === id);
    if (grado) {
      alert(`Ver grado:\nID: ${grado.id_grado}\nNivel (id): ${grado.nivel}\nNombre: ${grado.nombre}`);
    }
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

  deleteGrado(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este grado?')) {
      this.gradosService.eliminarGrado(id).subscribe({
        next: () => {
          this.cargarGrados();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar grado:', error);
        }
      });
    }
  }

  detailGrado(id: number): void {
    const grado = this.grados.find(g => g.id_grado === id);
    if (grado) {
      alert(`Detalle grado:\nID: ${grado.id_grado}\nNivel (id): ${grado.nivel}\nNombre: ${grado.nombre}\nEstado: ${grado.estado ? 'Activo' : 'Inactivo'}`);
    }
  }
}
