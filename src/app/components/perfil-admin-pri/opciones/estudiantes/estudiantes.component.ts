import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
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
// export class EstudiantesComponent implements OnInit {
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [
    { id: 1, nombres: 'Juan', apellidos: 'Pérez García', nivel: 'Primaria', grado: '1°', seccion: 'A' },
    { id: 2, nombres: 'Ana', apellidos: 'López Torres', nivel: 'Primaria', grado: '1°', seccion: 'B' },
    { id: 3, nombres: 'Carlos', apellidos: 'Ruiz Díaz', nivel: 'Primaria', grado: '2°', seccion: 'A' },
    { id: 4, nombres: 'Lucía', apellidos: 'Torres Vega', nivel: 'Primaria', grado: '2°', seccion: 'B' },
    { id: 5, nombres: 'Pedro', apellidos: 'Gómez Ríos', nivel: 'Primaria', grado: '3°', seccion: 'A' },
    { id: 6, nombres: 'María', apellidos: 'Sánchez León', nivel: 'Primaria', grado: '3°', seccion: 'B' },
    { id: 7, nombres: 'Luis', apellidos: 'Fernández Soto', nivel: 'Primaria', grado: '4°', seccion: 'A' },
    { id: 8, nombres: 'Elena', apellidos: 'Ramírez Cruz', nivel: 'Primaria', grado: '4°', seccion: 'B' },
    { id: 9, nombres: 'Miguel', apellidos: 'Castro Peña', nivel: 'Primaria', grado: '5°', seccion: 'A' },
    { id: 10, nombres: 'Patricia', apellidos: 'Vargas Silva', nivel: 'Primaria', grado: '5°', seccion: 'B' },
    { id: 11, nombres: 'Jorge', apellidos: 'Morales Paredes', nivel: 'Primaria', grado: '6°', seccion: 'A' },
    { id: 12, nombres: 'Rosa', apellidos: 'Herrera Salas', nivel: 'Primaria', grado: '6°', seccion: 'B' },
    { id: 13, nombres: 'Alberto', apellidos: 'Mendoza Rojas', nivel: 'Secundaria', grado: '1°', seccion: 'A' },
    { id: 14, nombres: 'Carmen', apellidos: 'Flores Medina', nivel: 'Secundaria', grado: '1°', seccion: 'B' },
    { id: 15, nombres: 'Ricardo', apellidos: 'Ortega Ramos', nivel: 'Secundaria', grado: '2°', seccion: 'A' },
    { id: 16, nombres: 'Sofía', apellidos: 'Guerrero Díaz', nivel: 'Secundaria', grado: '2°', seccion: 'B' },
    { id: 17, nombres: 'Gabriel', apellidos: 'Reyes Campos', nivel: 'Secundaria', grado: '3°', seccion: 'A' },
    { id: 18, nombres: 'Paula', apellidos: 'Chávez Luna', nivel: 'Secundaria', grado: '3°', seccion: 'B' },
    { id: 19, nombres: 'Andrés', apellidos: 'Silva Torres', nivel: 'Secundaria', grado: '4°', seccion: 'A' },
    { id: 20, nombres: 'Valeria', apellidos: 'Paredes Soto', nivel: 'Secundaria', grado: '4°', seccion: 'B' },
    { id: 21, nombres: 'Martín', apellidos: 'Ríos Guzmán', nivel: 'Secundaria', grado: '5°', seccion: 'A' },
    { id: 22, nombres: 'Natalia', apellidos: 'Vega Salas', nivel: 'Secundaria', grado: '5°', seccion: 'B' },
    { id: 23, nombres: 'Diego', apellidos: 'Campos León', nivel: 'Secundaria', grado: '6°', seccion: 'A' },
    { id: 24, nombres: 'Camila', apellidos: 'Mora Rojas', nivel: 'Secundaria', grado: '6°', seccion: 'B' },
    { id: 25, nombres: 'Esteban', apellidos: 'Paz Torres', nivel: 'Primaria', grado: '1°', seccion: 'C' },
    { id: 26, nombres: 'Daniela', apellidos: 'Soto Díaz', nivel: 'Primaria', grado: '2°', seccion: 'C' },
    { id: 27, nombres: 'Tomás', apellidos: 'León Silva', nivel: 'Primaria', grado: '3°', seccion: 'C' },
    { id: 28, nombres: 'Mónica', apellidos: 'García Paredes', nivel: 'Primaria', grado: '4°', seccion: 'C' },
    { id: 29, nombres: 'Felipe', apellidos: 'Ramos Medina', nivel: 'Primaria', grado: '5°', seccion: 'C' },
    { id: 30, nombres: 'Lorena', apellidos: 'Salas Guzmán', nivel: 'Primaria', grado: '6°', seccion: 'C' },
    { id: 31, nombres: 'Hugo', apellidos: 'Mendoza Flores', nivel: 'Secundaria', grado: '1°', seccion: 'C' },
    { id: 32, nombres: 'Sandra', apellidos: 'Ortega Luna', nivel: 'Secundaria', grado: '2°', seccion: 'C' },
    { id: 33, nombres: 'Pablo', apellidos: 'Guerrero Campos', nivel: 'Secundaria', grado: '3°', seccion: 'C' },
    { id: 34, nombres: 'Alicia', apellidos: 'Reyes Ramos', nivel: 'Secundaria', grado: '4°', seccion: 'C' },
    { id: 35, nombres: 'Oscar', apellidos: 'Chávez León', nivel: 'Secundaria', grado: '5°', seccion: 'C' },
    { id: 36, nombres: 'Marina', apellidos: 'Silva Torres', nivel: 'Secundaria', grado: '6°', seccion: 'C' },
    { id: 37, nombres: 'Iván', apellidos: 'Paredes Soto', nivel: 'Primaria', grado: '1°', seccion: 'D' },
    { id: 38, nombres: 'Julia', apellidos: 'Ríos Guzmán', nivel: 'Primaria', grado: '2°', seccion: 'D' },
    { id: 39, nombres: 'Emilio', apellidos: 'Vega Salas', nivel: 'Primaria', grado: '3°', seccion: 'D' },
    { id: 40, nombres: 'Teresa', apellidos: 'Campos León', nivel: 'Primaria', grado: '4°', seccion: 'D' },
    { id: 41, nombres: 'Samuel', apellidos: 'Mora Rojas', nivel: 'Primaria', grado: '5°', seccion: 'D' },
    { id: 42, nombres: 'Verónica', apellidos: 'Paz Torres', nivel: 'Primaria', grado: '6°', seccion: 'D' },
    { id: 43, nombres: 'Raúl', apellidos: 'Soto Díaz', nivel: 'Secundaria', grado: '1°', seccion: 'D' },
    { id: 44, nombres: 'Silvia', apellidos: 'León Silva', nivel: 'Secundaria', grado: '2°', seccion: 'D' },
    { id: 45, nombres: 'Mario', apellidos: 'García Paredes', nivel: 'Secundaria', grado: '3°', seccion: 'D' },
    { id: 46, nombres: 'Patricia', apellidos: 'Ramos Medina', nivel: 'Secundaria', grado: '4°', seccion: 'D' }
  ];


  filteredEstudiantes: Estudiante[] = [];
  paginatedEstudiantes: Estudiante[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  filtroColegio = '';

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  estudianteForm: FormGroup;
  showForm = false;

  // ✅ Propiedades necesarias para la plantilla HTML estandarizada
  loading = false;
  activeTab = 'tabla';
  searchEstudiante = '';
  isEditing = false;
  todayES = new Date().toLocaleDateString('es-ES');

  // ✅ Propiedades adicionales para los formularios y perfiles
  perfiles = [
    { value: 'estudiante', label: 'Estudiante' },
    { value: 'estudiante-avanzado', label: 'Estudiante Avanzado' }
  ];

  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  // Definición de las columnas para la tabla
  constructor() {
    this.estudianteForm = this.fb.group({
      usuario: ['', Validators.required],
      //perfil: [this.perfiles[0]?.value || 'Admin Pri', Validators.required],
      perfil: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      nivel: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
    });
  }

  // Método para manejar el evento de clic en el botón de "Crear Estudiante"
ngOnInit(): void {
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

  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado') {
    this.activeTab = tab;
  }

  // ✅ Métodos adicionales necesarios para la plantilla estandarizada
  onSubmit() {
    if (this.estudianteForm.valid) {
      this.loading = true;
      // Simular proceso de guardado
      setTimeout(() => {
        console.log('Estudiante guardado:', this.estudianteForm.value);
        this.loading = false;
        this.activeTab = 'tabla';
        this.resetFormSimple();
      }, 1500);
    }
  }

  resetFormSimple() {
    this.estudianteForm.reset();
    this.isEditing = false;
  }

  // ✅ Métodos para la funcionalidad de la tabla
  trackByEstudianteId(index: number, estudiante: Estudiante): number {
    return estudiante.id;
  }

  private resetFilters(): void {
    this.searchTerm = '';
    this.filtroDepartamento = '';
    this.filtroProvincia = '';
    this.filtroDistrito = '';
    this.filtroColegio = '';
    //this.carga
  }

}

// Services
// export class UsuariosComponent implements OnInit {
//   usuarios: Usuario[] = [];
//   mensajeError: string = ''; // Para mostrar mensajes de error en el template

//   constructor(private usuarioService: UsuarioService) { }

//   ngOnInit(): void {
//     this.cargarUsuarios();
//   }

//   cargarUsuarios(): void {
//     this.usuarioService.getUsuarios().subscribe(
//       (data: Usuario[]) => {
//         this.usuarios = data;
//         this.mensajeError = ''; // Limpia cualquier mensaje de error anterior
//       },
//       (error) => {
//         console.error('Error al cargar los usuarios:', error);
//         this.mensajeError = 'Error al cargar la lista de usuarios. Por favor, inténtalo de nuevo más tarde.';
//         // Aquí podrías implementar una lógica más sofisticada para manejar diferentes tipos de errores
//       }
//     );
//   }

//   // Aquí irían los métodos para crear, editar, eliminar usuarios, etc.
// }

// <<Campos básicos:>>
// ID (autogenerado)
// Nombres (requerido)
// Apellidos (requerido)
// Fecha de nacimiento
// Género (dropdown)
// DNI/Identificación (requerido)
// Foto/perfil
// Dirección
// Teléfono
// Correo electrónico (validado)
// Estado (Activo/Inactivo)
// <<Campos académicos:>>
// Colegio (relación)
// Nivel educativo
// Grado
// Sección
// Fecha de ingreso
// Promedio académico
// Observaciones
