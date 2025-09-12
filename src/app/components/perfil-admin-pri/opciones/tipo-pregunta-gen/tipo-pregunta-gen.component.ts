import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoPreguntaService, TipoPregunta } from '../../../../services/tipo-pregunta.service';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// interface TipoPregunta {
//   id_tipo_pregunta?: number;
//   nombre: string;
//   estado?: boolean;
// }

@Component({
    selector: 'app-tipo-pregunta',
    templateUrl: './tipo-pregunta-gen.component.html',
    styleUrls: ['./tipo-pregunta-gen.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class TipoPreguntaGenComponent implements OnInit {
  Math = Math;
  tipoPreguntas: TipoPregunta[] = [];
  filteredTipoPreguntas: TipoPregunta[] = [];
  paginatedTipoPreguntas: TipoPregunta[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingTipoPreguntaId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  TipoPreguntaForm!: FormGroup;
  private fb = inject(FormBuilder);
  private TipoPreguntaService = inject(TipoPreguntaService);

  ngOnInit(): void {
    this.initForm();
    this.cargarTipoPreguntaes();
  }

  cargarTipoPreguntaes(): void {
    this.loading = true;
    this.TipoPreguntaService.getTiposPregunta().subscribe({
      next: (data: TipoPregunta[]) => {
        this.tipoPreguntas = data;
        this.filteredTipoPreguntas = [...data];
        this.updatePaginatedTipoPreguntaes();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar tipo_material:', error);
      }
    });
  }

  private initForm(): void {
    this.TipoPreguntaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      estado: [true, [Validators.required]]
    });
  }

  filterTipoPregunta(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTipoPreguntas = [...this.tipoPreguntas];
    } else {
      this.filteredTipoPreguntas = this.tipoPreguntas.filter(tm =>
        tm.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedTipoPreguntaes();
  }

  updatePaginatedTipoPreguntaes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTipoPreguntas = this.filteredTipoPreguntas.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTipoPreguntaes();
  }

  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
  }

  viewTipoPregunta(id: number): void {
    const tm = this.tipoPreguntas.find(t => t.id_tipo_pregunta === id);
    if (tm) {
      alert(`Ver tipo_pregunta:\nID: ${tm.id_tipo_pregunta}\nNombre: ${tm.nombre}`);
    }
  }

  editTipoPregunta(id: number): void {
    this.isEditing = true;
    this.editingTipoPreguntaId = id;
    const tm = this.tipoPreguntas.find(t => t.id_tipo_pregunta === id);
    if (tm) {
      this.TipoPreguntaForm.patchValue({
        nombre: tm.nombre,
        descripcion: tm.descripcion,
        estado: tm.estado
      });
      this.selectTab('nuevo');
    }
  }

  deleteTipoPregunta(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de pregunta?')) {
      this.TipoPreguntaService.eliminarTipoPregunta(id).subscribe({
        next: () => {
          this.cargarTipoPreguntaes();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar tipo_pregunta:', error);
        }
      });
    }
  }

  detailTipoPregunta(id: number): void {
    const tm = this.tipoPreguntas.find(t => t.id_tipo_pregunta === id);
    if (tm) {
      alert(`Detalle tipo_pregunta:\nID: ${tm.id_tipo_pregunta}\nNombre: ${tm.nombre}\nEstado: ${tm.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.TipoPreguntaForm.invalid) return;
    const formValue = this.TipoPreguntaForm.value;
    this.loading = true;
    if (this.isEditing && this.editingTipoPreguntaId) {
      this.TipoPreguntaService.actualizarTipoPregunta(this.editingTipoPreguntaId, formValue).subscribe({
        next: () => {
          this.cargarTipoPreguntaes();
          this.isEditing = false;
          this.editingTipoPreguntaId = undefined;
          this.TipoPreguntaForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al actualizar tipo_material:', error);
        }
      });
    } else {
      this.TipoPreguntaService.crearTipoPregunta(formValue).subscribe({
        next: () => {
          this.cargarTipoPreguntaes();
          this.TipoPreguntaForm.reset();
          this.selectTab('tabla');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          console.error('Error al crear tipo_material:', error);
        }
      });
    }
  }
}
