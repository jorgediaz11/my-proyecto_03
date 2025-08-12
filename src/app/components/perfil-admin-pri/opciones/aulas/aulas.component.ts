import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulasService, Aula } from 'src/app/services/aulas.service';

@Component({
    selector: 'app-aulas',
    templateUrl: './aulas.component.html',
    styleUrls: ['./aulas.component.css'],
    standalone: false
})
export class AulasComponent implements OnInit {
  Math = Math;
  aulas: Aula[] = [];
  filteredAulas: Aula[] = [];
  paginatedAulas: Aula[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingAulaId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  aulaForm!: FormGroup;
  private fb = inject(FormBuilder);
  private aulasService = inject(AulasService);

  ngOnInit(): void {
    this.initForm();
    this.cargarAulas();
  }

  cargarAulas(): void {
    this.loading = true;
    this.aulasService.getAulas().subscribe({
      next: (data: Aula[]) => {
        this.aulas = data;
        this.filteredAulas = [...data];
        this.updatePaginatedAulas();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar aulas:', error);
      }
    });
  }

  private initForm(): void {
    this.aulaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      estado: [true, [Validators.required]]
    });
  }

  filterAulas(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAulas = [...this.aulas];
    } else {
      this.filteredAulas = this.aulas.filter(aula =>
        aula.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedAulas();
  }

  updatePaginatedAulas(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAulas = this.filteredAulas.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedAulas();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.aulaForm.reset({ estado: true });
    }
  }

  viewAula(id_aula: number): void {
    const aula = this.aulas.find(a => a.id_aula === id_aula);
    if (aula) {
      alert(`Ver aula:\nID: ${aula.id_aula}\nNombre: ${aula.nombre}`);
    }
  }

  editAula(id_aula: number): void {
    this.isEditing = true;
    this.editingAulaId = id_aula;
    const aula = this.aulas.find(a => a.id_aula === id_aula);
    if (aula) {
      this.aulaForm.patchValue({
        nombre: aula.nombre,
        estado: aula.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteAula(id_aula: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta aula?')) {
      this.aulasService.deleteAula(id_aula).subscribe({
        next: () => {
          this.cargarAulas();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar aula:', error);
        }
      });
    }
  }

  detailAula(id_aula: number): void {
    const aula = this.aulas.find(a => a.id_aula === id_aula);
    if (aula) {
      alert(`Detalle aula:\nID: ${aula.id_aula}\nNombre: ${aula.nombre}\nEstado: ${aula.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.aulaForm.invalid) return;
    const aulaData = this.aulaForm.value;
    if (this.isEditing && this.editingAulaId) {
      // Editar
      this.aulasService.updateAula(this.editingAulaId, aulaData).subscribe({
        next: () => {
          this.cargarAulas();
          this.isEditing = false;
          this.editingAulaId = undefined;
          this.aulaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar aula:', error);
        }
      });
    } else {
      // Crear
      this.aulasService.addAula(aulaData).subscribe({
        next: () => {
          this.cargarAulas();
          this.aulaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear aula:', error);
        }
      });
    }
  }
}
