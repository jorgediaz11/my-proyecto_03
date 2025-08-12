import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Opcion, OpcionesService } from 'src/app/services/opciones.service';

@Component({
    selector: 'app-opciones',
    templateUrl: './opciones.component.html',
    standalone: false
})
export class OpcionesComponent implements OnInit {
  Math = Math;
  opciones: Opcion[] = [];
  filteredOpciones: Opcion[] = [];
  paginatedOpciones: Opcion[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isEditing = false;
  editingOpcionId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  opcionForm!: FormGroup;
  private fb = inject(FormBuilder);
  private opcionesService = inject(OpcionesService);

  ngOnInit(): void {
    this.initForm();
    this.cargarOpciones();
  }

  cargarOpciones(): void {
    this.loading = true;
    this.opcionesService.getOpciones().subscribe({
      next: (data: Opcion[]) => {
        this.opciones = data;
        this.filteredOpciones = [...data];
        this.updatePaginatedOpciones();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar opciones:', error);
      }
    });
  }

  private initForm(): void {
    this.opcionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      valor: [''],
      estado: [true, [Validators.required]],
      id_pregunta: [null]
    });
  }

  filterOpciones(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOpciones = [...this.opciones];
    } else {
      this.filteredOpciones = this.opciones.filter(opcion =>
        (opcion.nombre || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedOpciones();
  }

  updatePaginatedOpciones(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOpciones = this.filteredOpciones.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedOpciones();
  }

  selectTab(tab: 'tabla' | 'nuevo'): void {
    this.activeTab = tab;
    if (tab === 'nuevo') {
      this.isEditing = false;
      this.opcionForm.reset({ estado: true });
    }
  }

  viewOpcion(id_opcion: number): void {
    const opcion = this.opciones.find(o => o.id_opcion === id_opcion);
    if (opcion) {
      alert(`Ver opción:\nID: ${opcion.id_opcion}\nNombre: ${opcion.nombre}`);
    }
  }

  editOpcion(id_opcion: number): void {
    this.isEditing = true;
    this.editingOpcionId = id_opcion;
    const opcion = this.opciones.find(o => o.id_opcion === id_opcion);
    if (opcion) {
      this.opcionForm.patchValue({
        nombre: opcion.nombre,
        descripcion: opcion.descripcion,
        valor: opcion.valor,
        estado: opcion.estado,
        id_pregunta: opcion.id_pregunta
      });
      this.selectTab('nuevo');
    }
  }

  deleteOpcion(id_opcion: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta opción?')) {
      this.opcionesService.eliminarOpcion(id_opcion).subscribe({
        next: () => {
          this.cargarOpciones();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar opción:', error);
        }
      });
    }
  }

  detailOpcion(id_opcion: number): void {
    const opcion = this.opciones.find(o => o.id_opcion === id_opcion);
    if (opcion) {
      alert(`Detalle opción:\nID: ${opcion.id_opcion}\nNombre: ${opcion.nombre}\nEstado: ${opcion.estado ? 'Activo' : 'Inactivo'}`);
    }
  }

  onSubmit(): void {
    if (this.opcionForm.invalid) return;
    const opcionData = this.opcionForm.value;
    if (this.isEditing && this.editingOpcionId) {
      // Editar
      this.opcionesService.actualizarOpcion(this.editingOpcionId, opcionData).subscribe({
        next: () => {
          this.cargarOpciones();
          this.isEditing = false;
          this.editingOpcionId = undefined;
          this.opcionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al actualizar opción:', error);
        }
      });
    } else {
      // Crear
      this.opcionesService.crearOpcion(opcionData).subscribe({
        next: () => {
          this.cargarOpciones();
          this.opcionForm.reset({ estado: true });
          this.selectTab('tabla');
        },
        error: (error: unknown) => {
          console.error('Error al crear opción:', error);
        }
      });
    }
  }
}
