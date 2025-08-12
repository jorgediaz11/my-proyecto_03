import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeriodosAcademService, PeriodoAcadem } from 'src/app/services/periodos-academ.service';

@Component({
    selector: 'app-periodo-academ',
    templateUrl: './periodo-academ.component.html',
    styleUrls: ['./periodo-academ.component.css'],
    standalone: false
})
export class PeriodoAcademComponent {
  Math = Math;
  periodos: PeriodoAcadem[] = [];
  filteredPeriodos: PeriodoAcadem[] = [];
  paginatedPeriodos: PeriodoAcadem[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingPeriodoId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  periodoForm!: FormGroup;
  private fb = inject(FormBuilder);
  private periodosService = inject(PeriodosAcademService);

  ngOnInit(): void {
    this.initForm();
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.loading = true;
    this.periodosService.getPeriodos().subscribe({
      next: (data: PeriodoAcadem[]) => {
        this.periodos = data;
        this.filteredPeriodos = [...data];
        this.updatePaginatedPeriodos();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar periodos:', error);
      }
    });
  }

  private initForm(): void {
    this.periodoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      estado: [true, [Validators.required]]
    });
  }

  filterPeriodos(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPeriodos = [...this.periodos];
    } else {
      this.filteredPeriodos = this.periodos.filter(periodo =>
        periodo.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedPeriodos();
  }

  updatePaginatedPeriodos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPeriodos = this.filteredPeriodos.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPeriodos();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.periodoForm.reset({ estado: true });
    }
  }

  viewPeriodo(id_periodo: number): void {
    const periodo = this.periodos.find(p => p.id_periodo === id_periodo);
    if (periodo) {
      alert(`Ver periodo académico:\nID: ${periodo.id_periodo}\nNombre: ${periodo.nombre}`);
    }
  }

  editPeriodo(id_periodo: number): void {
    this.isEditing = true;
    this.editingPeriodoId = id_periodo;
    const periodo = this.periodos.find(p => p.id_periodo === id_periodo);
    if (periodo) {
      this.periodoForm.patchValue({
        nombre: periodo.nombre,
        estado: periodo.estado
      });
      this.selectTab('nuevo');
    }
  }

  deletePeriodo(id_periodo: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este periodo académico?')) {
      this.periodosService.deletePeriodo(id_periodo).subscribe({
        next: () => {
          this.cargarPeriodos();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar periodo académico:', error);
        }
      });
    }
  }

  detailPeriodo(id_periodo: number): void {
    const periodo = this.periodos.find(p => p.id_periodo === id_periodo);
    if (periodo) {
      alert(`Detalle periodo académico:\nID: ${periodo.id_periodo}\nNombre: ${periodo.nombre}\nEstado: ${periodo.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.periodoForm.invalid) return;
    const periodoData = this.periodoForm.value;
    if (this.isEditing && this.editingPeriodoId) {
      // Editar
      this.periodosService.updatePeriodo(this.editingPeriodoId, periodoData).subscribe({
        next: () => {
          this.cargarPeriodos();
          this.isEditing = false;
          this.editingPeriodoId = undefined;
          this.periodoForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar periodo académico:', error);
        }
      });
    } else {
      // Crear
      this.periodosService.addPeriodo(periodoData).subscribe({
        next: () => {
          this.cargarPeriodos();
          this.periodoForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear periodo académico:', error);
        }
      });
    }
  }
}
