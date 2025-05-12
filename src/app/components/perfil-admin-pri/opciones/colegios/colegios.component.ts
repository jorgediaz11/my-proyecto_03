import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// Removed misplaced constructor

interface Colegio {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

@Component({
  selector: 'app-colegios',
  templateUrl: './colegios.component.html',
  styleUrls: ['./colegios.component.css']
})
export class ColegiosComponent implements OnInit {
  colegios: Colegio[] = [];
  filteredColegios: Colegio[] = [];
  paginatedColegios: Colegio[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  colegioForm: FormGroup;
  showForm: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.colegioForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]]
    });
  }

  ngOnInit(): void {
    for (let i = 1; i <= 25; i++) {
      this.colegios.push({
        id: i,
        nombre: `Colegio ${i}`,
        direccion: `Dirección ${i}`,
        telefono: `123-456-78${i}`
      });
    }
    this.filteredColegios = [...this.colegios];
    this.updatePaginatedColegios();
  }

  updatePaginatedColegios(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedColegios = this.filteredColegios.slice(startIndex, endIndex);
  }

  filterColegios(): void {
    this.filteredColegios = this.colegios.filter(colegio =>
      colegio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePaginatedColegios();
  }

  createColegio(): void {
    this.showForm = true;
  }

  saveColegio(): void {
    if (this.colegioForm.valid) {
      const newColegio: Colegio = {
        id: this.colegios.length + 1,
        ...this.colegioForm.value
      };
      this.colegios.push(newColegio);
      this.filteredColegios = [...this.colegios];
      this.updatePaginatedColegios();
      this.colegioForm.reset();
      this.showForm = false;

      Swal.fire({
        title: 'Guardado',
        text: 'El nuevo colegio ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelCreate(): void {
    this.colegioForm.reset();
    this.showForm = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedColegios();
  }

  editColegio(id: number): void {
    Swal.fire({
      title: 'Editar Colegio',
      text: `El colegio con ID ${id} será modificado.`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      console.log(`Editar colegio con ID: ${id}`);
    });
  }

  deleteColegio(id: number): void {
    Swal.fire({
      title: 'Eliminar Colegio',
      text: `¿Estás seguro de que deseas eliminar el colegio con ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.colegios = this.colegios.filter(colegio => colegio.id !== id);
        this.filteredColegios = [...this.colegios];
        this.updatePaginatedColegios();
        console.log(`Colegio con ID ${id} eliminado.`);
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  viewColegio(id: number): void {
    const colegio = this.colegios.find(c => c.id === id);
    if (colegio) {
      Swal.fire({
        title: `Detalles del Colegio`,
        html: `
          <p><strong>ID:</strong> ${colegio.id}</p>
          <p><strong>Nombre:</strong> ${colegio.nombre}</p>
          <p><strong>Dirección:</strong> ${colegio.direccion}</p>
          <p><strong>Teléfono:</strong> ${colegio.telefono}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      console.log(`Colegio con ID ${id} no encontrado.`);
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredColegios.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  resetForm(): void {
    Swal.fire({
      title: 'Limpiar Formulario',
      text: '¿Estás seguro de que deseas limpiar todos los campos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.colegioForm.reset();
        console.log('Formulario limpiado');
      }
    });
  }
}
