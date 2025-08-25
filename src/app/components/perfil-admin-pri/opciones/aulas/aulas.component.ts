import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulasService, Aula } from 'src/app/services/aulas.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
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

  // Selectores de nivel y grado
  niveles: Nivel[] = [];
  grados: Grado[] = [];
  allGrados: Grado[] = [];
  nivelSeleccionado: number | '' = '';
  gradoSeleccionado: number | '' = '';

  aulaForm!: FormGroup;
  private fb = inject(FormBuilder);
  private aulasService = inject(AulasService);
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);

  ngOnInit(): void {
    this.initForm();
    this.cargarAulas();
    this.cargarNivelesYGrados();
  }
  cargarNivelesYGrados(): void {
    this.nivelesService.getNiveles().subscribe({
      next: (niveles) => {
        this.niveles = niveles.filter(n => n.estado);
        this.gradosService.getGrados().subscribe({
          next: (grados) => {
            this.allGrados = grados.filter(g => g.estado && g.nivel && typeof g.nivel === 'object' && 'id_nivel' in g.nivel);
            this.grados = [...this.allGrados];
          },
          error: (error) => {
            console.error('Error al cargar grados:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar niveles:', error);
      }
    });
  }

  onNivelChange(): void {
    this.gradoSeleccionado = '';
    if (this.nivelSeleccionado) {
      const nivelId = Number(this.nivelSeleccionado);
      this.grados = this.allGrados.filter(g => g.nivel && typeof g.nivel === 'object' && g.nivel.id_nivel === nivelId);
    } else {
      this.grados = [...this.allGrados];
    }
    this.filterAulas();
  }

  onGradoChange(): void {
    this.filterAulas();
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
    let filtered = [...this.aulas];
    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(aula =>
        aula.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    // Filtrar por grado seleccionado
    if (this.gradoSeleccionado) {
      filtered = filtered.filter(aula => aula.id_grado === Number(this.gradoSeleccionado));
    }
    this.filteredAulas = filtered;
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

  viewPerfil(id_aula: number): void {
    const aula = this.aulas.find(a => a.id_aula === id_aula);
    if (!aula) {
      this.handleError('Aula no encontrada');
      return;
    }

    Swal.fire({
      title: `Detalles del Perfil`,
      html: `
        <div class="text-left">
          <p><strong>Nombres:</strong> ${aula.nombre}</p>
          <p><strong>Estado:</strong> ${aula.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });

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

  deletePerfil(id_aula: number): void {
    const aula = this.aulas.find(p => p.id_aula === id_aula);
    if (!aula) {
      this.handleError('Aula no encontrada');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Aula?',
      text: `¿Estás seguro de que deseas eliminar el aula "${aula.nombre}"?`,
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
        this.aulasService.deleteAula(id_aula).subscribe({
          next: () => {
            this.loading = false;
            this.handleSuccess('Aula eliminada correctamente');
            this.cargarAulas();
          },
          error: (error: unknown) => {
            this.loading = false;
            this.handleError('Error al eliminar el perfil');
            console.error('Error:', error);
          }
        });
      }
    });
  }

  detailAula(id_aula: number): void {
    const aula = this.aulas.find(a => a.id_aula === id_aula);
    if (aula) {
      Swal.fire({
        title: 'Detalle aula',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${aula.id_aula}</p>
            <p><strong>Nombre:</strong> ${aula.nombre}</p>
            <p><strong>Estado:</strong> ${aula.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
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
