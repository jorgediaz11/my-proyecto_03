import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface Docente { // Define la interfaz Docente
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

@Component({  // Cambié 'app-docentes' a 'app-docentes'
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
  filteredDocentes: Docente[] = [];
  paginatedDocentes: Docente[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  docenteForm: FormGroup;
  showForm: boolean = false;

  // Definición de las columnas para la tabla
  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.docenteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]]
    });
  }

  // Método para manejar el evento de clic en el botón de "Crear Docente"
  ngOnInit(): void {
    for (let i = 1; i <= 25; i++) {
      this.docentes.push({
        id: i,
        nombres: `Docente ${i}`,
        apellidos: `Docente ${i}`,
        correo: `Dirección ${i}`,
        telefono: `123-456-78${i}`
      });
    }
    this.filteredDocentes = [...this.docentes];
    this.updatePaginatedDocentes();
  }

  updatePaginatedDocentes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDocentes = this.filteredDocentes.slice(startIndex, endIndex);
  }

  filterDocentes(): void {
    this.filteredDocentes = this.docentes.filter(docente =>
      docente.nombres.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePaginatedDocentes();
  }

  createDocente(): void {
    this.showForm = true;
  }

  saveDocente(): void {
    if (this.docenteForm.valid) {
      const newdocente: Docente = {
        id: this.docentes.length + 1,
        ...this.docenteForm.value
      };
      this.docentes.push(newdocente);
      this.filteredDocentes = [...this.docentes];
      this.updatePaginatedDocentes();
      this.docenteForm.reset();
      this.showForm = false;

      Swal.fire({
        title: 'Guardado',
        text: 'El nuevo docente ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelCreate(): void {
    this.docenteForm.reset();
    this.showForm = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedDocentes();
  }

  editDocente(id: number): void {
    Swal.fire({
      title: 'Editar Docente',
      text: `El docente con ID ${id} será modificado.`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      console.log(`Editar docente con ID: ${id}`);
    });
  }

  deleteDocente(id: number): void {
    Swal.fire({
      title: 'Eliminar docente',
      text: `¿Estás seguro de que deseas eliminar el docente con ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.docentes = this.docentes.filter(docente => docente.id !== id);
        this.filteredDocentes = [...this.docentes];
        this.updatePaginatedDocentes();
        console.log(`docente con ID ${id} eliminado.`);
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  viewDocente(id: number): void {
    const docente = this.docentes.find(c => c.id === id);
    if (docente) {
      Swal.fire({
        title: `Detalles del docente`,
        html: `
          <p><strong>ID:</strong> ${docente.id}</p>
          <p><strong>Nombre:</strong> ${docente.nombres}</p>
          <p><strong>Apellidos:</strong> ${docente.apellidos}</p>
          <p><strong>Correo:</strong> ${docente.correo}</p>
          <p><strong>Teléfono:</strong> ${docente.telefono}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      console.log(`docente con ID ${id} no encontrado.`);
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredDocentes.length / this.itemsPerPage);
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
        this.docenteForm.reset();
        console.log('Formulario limpiado');
      }
    });
  }
}
