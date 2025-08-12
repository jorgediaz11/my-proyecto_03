
import { Component, OnInit, inject } from '@angular/core';
import { PerfilService, Perfil } from '../../../../services/perfil.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-perfil',
    templateUrl: './perfiles.component.html',
    styleUrls: ['./perfiles.component.css'],
    standalone: false
})
export class PerfilComponent implements OnInit {
  Math = Math;
  perfiles: Perfil[] = [];
  filteredPerfiles: Perfil[] = [];
  paginatedPerfiles: Perfil[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingPerfilId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

  perfilForm!: FormGroup;
  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilService);

  ngOnInit(): void {
    this.initForm();
    this.cargarPerfiles();
  }

  cargarPerfiles(): void {
    this.loading = true;
    this.perfilService.getPerfiles().subscribe({
      next: (data: Perfil[]) => {
        this.perfiles = data;
        this.filteredPerfiles = [...data];
        this.updatePaginatedPerfiles();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar perfiles:', error);
      }
    });
  }

  private initForm(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      estado: [true, [Validators.required]]
    });
  }

  filterPerfiles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPerfiles = [...this.perfiles];
    } else {
      this.filteredPerfiles = this.perfiles.filter(perfil =>
        perfil.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        perfil.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedPerfiles();
  }

  updatePaginatedPerfiles(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPerfiles = this.filteredPerfiles.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPerfiles();
  }

  selectTab(tab: 'tabla' | 'nuevo' ): void {
    this.activeTab = tab;
  }

  // Métodos para los botones de acción
  viewPerfil(id_perfil: number): void {
    // Aquí puedes mostrar un modal o alerta con los detalles del perfil
    const perfil = this.perfiles.find(p => p.id === id_perfil);
    if (perfil) {
      alert(`Ver perfil:\nID: ${id_perfil}\nNombre: ${perfil.nombre}\nDescripción: ${perfil.descripcion}`);
    }
  }

  editPerfil(id_perfil: number): void {
    // Aquí puedes cargar los datos en el formulario para editar
    this.isEditing = true;
    this.editingPerfilId = id_perfil;
    const perfil = this.perfiles.find(p => p.id === id_perfil);
    if (perfil) {
      this.perfilForm.patchValue({
        nombre: perfil.nombre,
        descripcion: perfil.descripcion,
        estado: perfil.estado
      });
      this.selectTab('nuevo');
    }
  }

  deletePerfil(id_perfil: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      this.perfilService.eliminarPerfil(id_perfil).subscribe({
        next: () => {
          this.cargarPerfiles();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar perfil:', error);
        }
      });
    }
  }

  detailPerfil(id_perfil: number): void {
    // Aquí puedes mostrar detalles extendidos, por ahora solo un alert
    const perfil = this.perfiles.find(p => p.id === id_perfil);
    if (perfil) {
      alert(`Detalle perfil:\nID: ${id_perfil}\nNombre: ${perfil.nombre}\nDescripción: ${perfil.descripcion}\nEstado: ${perfil.estado ? 'Activo' : 'Inactivo'}`);
    }
  }
}
