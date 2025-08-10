import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pregunta, PreguntasService } from 'src/app/services/preguntas.service';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  // styleUrls: ['./preguntas.component.css']
})
export class PreguntasComponent implements OnInit {
  Math = Math;
  preguntas: Pregunta[] = [];
  filteredPreguntas: Pregunta[] = [];
  paginatedPreguntas: Pregunta[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingPreguntaId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  preguntaForm!: FormGroup;
  private fb = inject(FormBuilder);
  private preguntasService = inject(PreguntasService);

  ngOnInit(): void {
    this.initForm();
    this.cargarPreguntas();
  }

  cargarPreguntas(): void {
    this.loading = true;
    this.preguntasService.getPreguntas().subscribe({
      next: (data: Pregunta[]) => {
        this.preguntas = data;
        this.filteredPreguntas = [...data];
        this.updatePaginatedPreguntas();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar preguntas:', error);
      }
    });
  }

  private initForm(): void {
    this.preguntaForm = this.fb.group({
      texto: ['', [Validators.required, Validators.minLength(2)]],
      tipo: ['', [Validators.required]],
      descripcion: [''],
      estado: [true, [Validators.required]],
      id_leccion: [null]
    });
  }

  filterPreguntas(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPreguntas = [...this.preguntas];
    } else {
      this.filteredPreguntas = this.preguntas.filter(pregunta =>
        (pregunta.texto || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedPreguntas();
  }

  updatePaginatedPreguntas(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPreguntas = this.filteredPreguntas.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPreguntas();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.preguntaForm.reset({ estado: true });
    }
  }

  viewPregunta(id_pregunta: number): void {
    const pregunta = this.preguntas.find(p => p.id_pregunta === id_pregunta);
    if (pregunta) {
      alert(`Ver pregunta:\nID: ${pregunta.id_pregunta}\nTexto: ${pregunta.texto}`);
    }
  }

  editPregunta(id_pregunta: number): void {
    this.isEditing = true;
    this.editingPreguntaId = id_pregunta;
    const pregunta = this.preguntas.find(p => p.id_pregunta === id_pregunta);
    if (pregunta) {
      this.preguntaForm.patchValue({
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        descripcion: pregunta.descripcion,
        estado: pregunta.estado,
        id_leccion: pregunta.id_leccion
      });
      this.selectTab('nuevo');
    }
  }

  deletePregunta(id_pregunta: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      this.preguntasService.eliminarPregunta(id_pregunta).subscribe({
        next: () => {
          this.cargarPreguntas();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar pregunta:', error);
        }
      });
    }
  }

  detailPregunta(id_pregunta: number): void {
    const pregunta = this.preguntas.find(p => p.id_pregunta === id_pregunta);
    if (pregunta) {
      alert(`Detalle pregunta:\nID: ${pregunta.id_pregunta}\nTexto: ${pregunta.texto}\nEstado: ${pregunta.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.preguntaForm.invalid) return;
    const preguntaData = this.preguntaForm.value;
    if (this.isEditing && this.editingPreguntaId) {
      // Editar
      this.preguntasService.actualizarPregunta(this.editingPreguntaId, preguntaData).subscribe({
        next: () => {
          this.cargarPreguntas();
          this.isEditing = false;
          this.editingPreguntaId = undefined;
          this.preguntaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar pregunta:', error);
        }
      });
    } else {
      // Crear
      this.preguntasService.crearPregunta(preguntaData).subscribe({
        next: () => {
          this.cargarPreguntas();
          this.preguntaForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear pregunta:', error);
        }
      });
    }
  }
}
