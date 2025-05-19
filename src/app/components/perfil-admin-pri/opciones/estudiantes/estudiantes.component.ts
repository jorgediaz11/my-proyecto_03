import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface Estudiante { // Define la interfaz Estudiante
  id: number;
  nombres: string;
  apellidos: string;
  nivel: string;
  grado: string;
  seccion: string;
}

@Component({  // Cambié 'app-estudiantes' a 'app-estudiantes'
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  filteredEstudiantes: Estudiante[] = [];
  paginatedEstudiantes: Estudiante[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  estudianteForm: FormGroup;
  showForm: boolean = false;

  // Definición de las columnas para la tabla
  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.estudianteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      nivel: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
    });
  }

  // Método para manejar el evento de clic en el botón de "Crear Estudiante"
ngOnInit(): void {
  const primariaGrados = ['1ero', '2do', '3ero', '4to', '5to', '6to'];
  const secundariaGrados = ['1er', '2do', '3er', '4to', '5to'];
  const secciones = ['A', 'B', 'C'];

  // 6 Inicial
  for (let i = 1; i <= 6; i++) {
    this.estudiantes.push({
      id: i,
      nombres: `Nombre ${i}`,
      apellidos: `Apellido ${i}`,
      nivel: 'Inicial',
      grado: '',
      seccion: secciones[Math.floor(Math.random() * secciones.length)],
    });
  }

  // 15 Primaria
  for (let i = 7; i <= 21; i++) {
    this.estudiantes.push({
      id: i,
      nombres: `Nombre ${i}`,
      apellidos: `Apellido ${i}`,
      nivel: 'Primaria',
      grado: primariaGrados[Math.floor(Math.random() * primariaGrados.length)],
      seccion: secciones[Math.floor(Math.random() * secciones.length)],
    });
  }

  // 15 Secundaria
  for (let i = 22; i <= 36; i++) {
    this.estudiantes.push({
      id: i,
      nombres: `Nombre ${i}`,
      apellidos: `Apellido ${i}`,
      nivel: 'Secundaria',
      grado: secundariaGrados[Math.floor(Math.random() * secundariaGrados.length)],
      seccion: secciones[Math.floor(Math.random() * secciones.length)],
    });
  }

  this.filteredEstudiantes = [...this.estudiantes];
  this.updatePaginatedEstudiantes();
}

  updatePaginatedEstudiantes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEstudiantes = this.filteredEstudiantes.slice(startIndex, endIndex);
  }

  filterEstudiantes(): void {
    this.filteredEstudiantes = this.estudiantes.filter(estudiante =>
      estudiante.nombres.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePaginatedEstudiantes();
  }

  createEstudiante(): void {
    this.showForm = true;
  }

  saveEstudiante(): void {
    if (this.estudianteForm.valid) {
      const newestudiante: Estudiante = {
        id: this.estudiantes.length + 1,
        ...this.estudianteForm.value
      };
      this.estudiantes.push(newestudiante);
      this.filteredEstudiantes = [...this.estudiantes];
      this.updatePaginatedEstudiantes();
      this.estudianteForm.reset();
      this.showForm = false;

      Swal.fire({
        title: 'Guardado',
        text: 'El nuevo estudiante ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelCreate(): void {
    this.estudianteForm.reset();
    this.showForm = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEstudiantes();
  }

  editEstudiante(id: number): void {
    Swal.fire({
      title: 'Editar Estudiante',
      text: `El estudiante con ID ${id} será modificado.`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      console.log(`Editar estudiante con ID: ${id}`);
    });
  }

  deleteEstudiante(id: number): void {
    Swal.fire({
      title: 'Eliminar estudiante',
      text: `¿Estás seguro de que deseas eliminar el estudiante con ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.estudiantes = this.estudiantes.filter(estudiante => estudiante.id !== id);
        this.filteredEstudiantes = [...this.estudiantes];
        this.updatePaginatedEstudiantes();
        console.log(`estudiante con ID ${id} eliminado.`);
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  viewEstudiante(id: number): void {
    const estudiante = this.estudiantes.find(c => c.id === id);
    if (estudiante) {
      Swal.fire({
        title: `Detalles del estudiante`,
        html: `
          <p><strong>ID:</strong> ${estudiante.id}</p>
          <p><strong>Nombres:</strong> ${estudiante.nombres}</p>
          <p><strong>Apellidos:</strong> ${estudiante.apellidos}</p>
          <p><strong>Nivel:</strong> ${estudiante.nivel}</p>
          <p><strong>Grado:</strong> ${estudiante.grado}</p>
          <p><strong>Sección:</strong> ${estudiante.seccion}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      console.log(`estudiante con ID ${id} no encontrado.`);
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredEstudiantes.length / this.itemsPerPage);
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
        this.estudianteForm.reset();
        console.log('Formulario limpiado');
      }
    });
  }
}
