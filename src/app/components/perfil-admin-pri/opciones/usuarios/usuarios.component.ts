import { Component } from '@angular/core';  // Asegúrate de que el import sea correcto
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService, Usuario as UsuarioApi } from '../../../../services/usuario.service';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface Usuario { // Define la interfaz Usuario
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  perfil: string;
  peso: number;
  descripcion: string;
}

@Component({  // Cambié 'standalone: true' a 'standalone: false'
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
// export class UsuariosComponent implements OnInit {
export class UsuariosComponent {  // Cambié 'UsuariosComponent' a 'UsuariosComponent'
  usuarios : Usuario[] =[
  { id: 'U001', correo: 'ana.garcia@colegio.edu', nombres: 'Ana', apellidos: 'García', perfil: 'Administrador', peso: 70, descripcion: 'Responsable de la gestión general.' },
  { id: 'U002', correo: 'juan.perez@colegio.edu', nombres: 'Juan', apellidos: 'Pérez', perfil: 'Docente', peso: 80, descripcion: 'Profesor de matemáticas.' },
  { id: 'U003', correo: 'maria.lopez@colegio.edu', nombres: 'María', apellidos: 'López', perfil: 'Docente', peso: 65, descripcion: 'Profesora de ciencias.' },
  { id: 'U004', correo: 'carlos.sanchez@colegio.edu', nombres: 'Carlos', apellidos: 'Sánchez', perfil: 'Estudiante', peso: 60, descripcion: 'Alumno de secundaria.' },
  { id: 'U005', correo: 'lucia.martinez@colegio.edu', nombres: 'Lucía', apellidos: 'Martínez', perfil: 'Estudiante', peso: 55, descripcion: 'Alumna de primaria.' },
  { id: 'U006', correo: 'roberto.torres@colegio.edu', nombres: 'Roberto', apellidos: 'Torres', perfil: 'Docente', peso: 78, descripcion: 'Profesor de historia.' },
  { id: 'U007', correo: 'sofia.ramirez@colegio.edu', nombres: 'Sofía', apellidos: 'Ramírez', perfil: 'Administrador', peso: 68, descripcion: 'Encargada de recursos.' },
  { id: 'U008', correo: 'diego.fernandez@colegio.edu', nombres: 'Diego', apellidos: 'Fernández', perfil: 'Estudiante', peso: 62, descripcion: 'Alumno de inicial.' },
  { id: 'U009', correo: 'valentina.gomez@colegio.edu', nombres: 'Valentina', apellidos: 'Gómez', perfil: 'Docente', peso: 64, descripcion: 'Profesora de arte.' },
  { id: 'U010', correo: 'martin.ruiz@colegio.edu', nombres: 'Martín', apellidos: 'Ruiz', perfil: 'Estudiante', peso: 59, descripcion: 'Alumno de primaria.' },
  { id: 'U011', correo: 'camila.morales@colegio.edu', nombres: 'Camila', apellidos: 'Morales', perfil: 'Docente', peso: 70, descripcion: 'Profesora de inglés.' },
  { id: 'U012', correo: 'josefa.diaz@colegio.edu', nombres: 'Josefa', apellidos: 'Díaz', perfil: 'Estudiante', peso: 58, descripcion: 'Alumna de secundaria.' },
  { id: 'U013', correo: 'sebastian.vargas@colegio.edu', nombres: 'Sebastián', apellidos: 'Vargas', perfil: 'Administrador', peso: 75, descripcion: 'Soporte técnico.' }
];

filteredUsuarios: Usuario[] = [];
paginatedUsuarios: Usuario[] = [];
currentPage: number = 1;
itemsPerPage: number = 10;

searchTerm: string = '';
usuarioForm: FormGroup;
showForm: boolean = false;

// Definición de las columnas para la tabla
constructor(private fb: FormBuilder, private dialog: MatDialog) {
  this.usuarioForm = this.fb.group({
    usuario: ['', Validators.required],
    perfil: [this.perfiles[0]?.value || 'Admin Pri', Validators.required],
    //perfil: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    clave1: ['', Validators.required],  // Campo para la contraseña
    clave2: ['', Validators.required],  // Campo para la confirmación de contraseña
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    descripcion: ['', Validators.required],
  });
}

// Método para manejar el evento de clic en el botón de "Crear Usuario"
ngOnInit(): void {
    this.filteredUsuarios = [...this.usuarios];
    this.updatePaginatedUsuarios();
  }

perfiles = [
  { value: 'adminpri', label: 'Admin Pri' },
  { value: 'admincol', label: 'Admin Col' },
  { value: 'docentes', label: 'Docentes' },
  { value: 'estudiantes', label: 'Estudiantes' },
  { value: 'familia', label: 'Familia' },
  { value: 'editor', label: 'Editor' }
];

updatePaginatedUsuarios(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsuarios = this.filteredUsuarios.slice(startIndex, endIndex);
  }

  filterUsuarios(): void {
    this.filteredUsuarios = this.usuarios.filter(usuario =>
      usuario.nombres.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePaginatedUsuarios();
  }

  createUsuario(): void {
    this.showForm = true;
  }

  saveUsuario(): void {
    if (this.usuarioForm.valid) {
      const newUsuario: Usuario = {
        id: this.usuarios.length + 1,
        ...this.usuarioForm.value
      };
      this.usuarios.push(newUsuario);
      this.filteredUsuarios = [...this.usuarios];
      this.updatePaginatedUsuarios();
      this.usuarioForm.reset();
      this.showForm = false;

      Swal.fire({
        title: 'Guardado',
        text: 'El nuevo usaurio ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelCreate(): void {
    this.usuarioForm.reset();
    this.showForm = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsuarios();
  }

  editUsuario(id: number): void {
    Swal.fire({
      title: 'Editar Usuario',
      text: `El Usuario con ID ${id} será modificado.`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      console.log(`Editar Usuario con ID: ${id}`);
    });
  }

  deleteUsuario(id: number): void {
    Swal.fire({
      title: 'Eliminar Usuario',
      text: `¿Estás seguro de que deseas eliminar el Usuario con ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== String(id));
        this.filteredUsuarios = [...this.usuarios];
        this.updatePaginatedUsuarios();
        console.log(`Usuario con ID ${id} eliminado.`);
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  viewUsuario(id: number): void {
    const usuario = this.usuarios.find(c => c.id === String(id));
    if (usuario) {
      Swal.fire({
        title: `Detalles del Usuario`,
        html: `
          <p><strong>ID:</strong> ${usuario.id}</p>
          <p><strong>Nombre:</strong> ${usuario.nombres}</p>
          <p><strong>Dirección:</strong> ${usuario.apellidos}</p>
          <p><strong>Correo:</strong> ${usuario.correo}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      console.log(`Usuario con ID ${id} no encontrado.`);
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredUsuarios.length / this.itemsPerPage);
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
        this.usuarioForm.reset();
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

// <<Datos de acceso:>>
// ID (autogenerado)
// Nombre de usuario (requerido)
// Contraseña (requerido, encriptada)
// Correo electrónico (validado)
// Rol (Admin/Docente/Estudiante/Padre)
// Fecha de creación
// Último acceso
// Estado (Activo/Inactivo/Bloqueado)
// <<Datos personales:>>
// Relación con persona (Docente/Estudiante)
// Foto de perfil
// Preferencias de notificación
