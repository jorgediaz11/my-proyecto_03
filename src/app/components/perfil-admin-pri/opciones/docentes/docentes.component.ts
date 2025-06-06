import { Component, OnInit } from '@angular/core';  // Asegúrate de que el import sea correcto
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
//import { UsuarioService, Usuario } from '../../../../services/usuario.service';
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
// export class DocentesComponent implements OnInit {
export class DocentesComponent {
  docentes: Docente[] = [
    { id: 1, nombres: 'Juan', apellidos: 'Pérez García', correo: 'juan.perez@colegio.com', telefono: '987654321' },
    { id: 2, nombres: 'Ana', apellidos: 'López Torres', correo: 'ana.lopez@colegio.com', telefono: '912345678' },
    { id: 3, nombres: 'Carlos', apellidos: 'Ruiz Díaz', correo: 'carlos.ruiz@colegio.com', telefono: '934567890' },
    { id: 4, nombres: 'Lucía', apellidos: 'Torres Vega', correo: 'lucia.torres@colegio.com', telefono: '945678901' },
    { id: 5, nombres: 'Pedro', apellidos: 'Gómez Ríos', correo: 'pedro.gomez@colegio.com', telefono: '956789012' },
    { id: 6, nombres: 'María', apellidos: 'Sánchez León', correo: 'maria.sanchez@colegio.com', telefono: '967890123' },
    { id: 7, nombres: 'Luis', apellidos: 'Fernández Soto', correo: 'luis.fernandez@colegio.com', telefono: '978901234' },
    { id: 8, nombres: 'Elena', apellidos: 'Ramírez Cruz', correo: 'elena.ramirez@colegio.com', telefono: '989012345' },
    { id: 9, nombres: 'Miguel', apellidos: 'Castro Peña', correo: 'miguel.castro@colegio.com', telefono: '900123456' },
    { id: 10, nombres: 'Patricia', apellidos: 'Vargas Silva', correo: 'patricia.vargas@colegio.com', telefono: '911234567' },
    { id: 11, nombres: 'Jorge', apellidos: 'Morales Paredes', correo: 'jorge.morales@colegio.com', telefono: '922345678' },
    { id: 12, nombres: 'Rosa', apellidos: 'Herrera Salas', correo: 'rosa.herrera@colegio.com', telefono: '933456789' },
    { id: 13, nombres: 'Alberto', apellidos: 'Mendoza Rojas', correo: 'alberto.mendoza@colegio.com', telefono: '944567890' },
    { id: 14, nombres: 'Carmen', apellidos: 'Flores Medina', correo: 'carmen.flores@colegio.com', telefono: '955678901' },
    { id: 15, nombres: 'Ricardo', apellidos: 'Ortega Ramos', correo: 'ricardo.ortega@colegio.com', telefono: '966789012' },
    { id: 16, nombres: 'Sofía', apellidos: 'Guerrero Díaz', correo: 'sofia.guerrero@colegio.com', telefono: '977890123' },
    { id: 17, nombres: 'Gabriel', apellidos: 'Reyes Campos', correo: 'gabriel.reyes@colegio.com', telefono: '988901234' },
    { id: 18, nombres: 'Paula', apellidos: 'Chávez Luna', correo: 'paula.chavez@colegio.com', telefono: '999012345' },
    { id: 19, nombres: 'Andrés', apellidos: 'Silva Torres', correo: 'andres.silva@colegio.com', telefono: '910123456' },
    { id: 20, nombres: 'Valeria', apellidos: 'Paredes Soto', correo: 'valeria.paredes@colegio.com', telefono: '921234567' }
  ];



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
      usuario: ['', Validators.required],
      //perfil: [this.perfiles[0]?.value || 'Admin Pri', Validators.required],
      perfil: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]]
    });
  }

  // Método para manejar el evento de clic en el botón de "Crear Docente"
  ngOnInit(): void {
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

  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado') {
    this.activeTab = tab;
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
// DNI/Identificación (requerido)
// Fecha de nacimiento
// Género (dropdown)
// Foto/perfil
// Dirección
// Teléfono
// Correo electrónico (validado)
// Estado (Activo/Inactivo)
// <<Campos profesionales:>>
// Especialidad (dropdown)
// Grados académicos
// Años de experiencia
// Cursos asignados (relación múltiple)
// Horario disponible
// Tipo de contrato
// Fecha de contratación
