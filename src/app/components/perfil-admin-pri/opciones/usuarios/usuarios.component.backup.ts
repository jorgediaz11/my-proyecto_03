import { Component,OnInit } from '@angular/core';  // Asegúrate de que el import sea correcto
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService, Usuario } from '../../../../services/usuario.service';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({  // Cambié 'standalone: true' a 'standalone: false'
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
// export class UsuariosComponent {  // Cambié 'UsuariosComponent' a 'UsuariosComponent'
//   usuarios : Usuario[] =[
//   { id: 'U001', correo: 'ana.garcia@colegio.edu', nombres: 'Ana', apellidos: 'García', perfil: 'Administrador', peso: 70, descripcion: 'Responsable de la gestión general.' },
//   { id: 'U002', correo: 'juan.perez@colegio.edu', nombres: 'Juan', apellidos: 'Pérez', perfil: 'Docente', peso: 80, descripcion: 'Profesor de matemáticas.' },
//   { id: 'U003', correo: 'maria.lopez@colegio.edu', nombres: 'María', apellidos: 'López', perfil: 'Docente', peso: 65, descripcion: 'Profesora de ciencias.' },
//   { id: 'U004', correo: 'carlos.sanchez@colegio.edu', nombres: 'Carlos', apellidos: 'Sánchez', perfil: 'Estudiante', peso: 60, descripcion: 'Alumno de secundaria.' },
//   { id: 'U005', correo: 'lucia.martinez@colegio.edu', nombres: 'Lucía', apellidos: 'Martínez', perfil: 'Estudiante', peso: 55, descripcion: 'Alumna de primaria.' },
//   { id: 'U006', correo: 'roberto.torres@colegio.edu', nombres: 'Roberto', apellidos: 'Torres', perfil: 'Docente', peso: 78, descripcion: 'Profesor de historia.' },
//   { id: 'U007', correo: 'sofia.ramirez@colegio.edu', nombres: 'Sofía', apellidos: 'Ramírez', perfil: 'Administrador', peso: 68, descripcion: 'Encargada de recursos.' },
//   { id: 'U008', correo: 'diego.fernandez@colegio.edu', nombres: 'Diego', apellidos: 'Fernández', perfil: 'Estudiante', peso: 62, descripcion: 'Alumno de inicial.' },
//   { id: 'U009', correo: 'valentina.gomez@colegio.edu', nombres: 'Valentina', apellidos: 'Gómez', perfil: 'Docente', peso: 64, descripcion: 'Profesora de arte.' },
//   { id: 'U010', correo: 'martin.ruiz@colegio.edu', nombres: 'Martín', apellidos: 'Ruiz', perfil: 'Estudiante', peso: 59, descripcion: 'Alumno de primaria.' },
//   { id: 'U011', correo: 'camila.morales@colegio.edu', nombres: 'Camila', apellidos: 'Morales', perfil: 'Docente', peso: 70, descripcion: 'Profesora de inglés.' },
//   { id: 'U012', correo: 'josefa.diaz@colegio.edu', nombres: 'Josefa', apellidos: 'Díaz', perfil: 'Estudiante', peso: 58, descripcion: 'Alumna de secundaria.' },
//   { id: 'U013', correo: 'sebastian.vargas@colegio.edu', nombres: 'Sebastián', apellidos: 'Vargas', perfil: 'Administrador', peso: 75, descripcion: 'Soporte técnico.' }
// ];

  // Propiedades de datos
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  paginatedUsuarios: Usuario[] = [];

  // Propiedades de control
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  showForm: boolean = false;
  isEditing: boolean = false;
  editingUserId?: number;
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  // Formulario
  usuarioForm: FormGroup;

// Definición de las columnas para la tabla
constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
  this.usuarioForm = this.fb.group({
    usuario: ['', Validators.required],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: [''], // No requerido inicialmente
    confirmPassword: [''], // No requerido inicialmente
    idrol: [1, Validators.required],
    estado: ['1', Validators.required]
  }, {
    validators: this.passwordMatchValidator.bind(this)
  });
}

// Validador para confirmar contraseñas
passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');

  // Si está editando y ambos campos están vacíos, está bien
  if (this.isEditing && (!password?.value || !confirmPassword?.value)) {
    return null;
  }

  // Si no está editando, ambos campos son requeridos
  if (!this.isEditing && (!password?.value || !confirmPassword?.value)) {
    return { passwordRequired: true };
  }

  // Validar que coincidan
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
}

// Método para manejar el evento de clic en el botón de "Crear Usuario"
ngOnInit(): void {
    //this.filteredUsuarios = [...this.usuarios];
    //this.updatePaginatedUsuarios();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.filteredUsuarios = [...data]; // ✅ Copia directa
        this.updatePaginatedUsuarios();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar la lista de usuarios.',
          icon: 'error'
        });
      }
    });
  }

  perfiles = [
    { value: 1, label: 'Administrador Principal' },
    { value: 2, label: 'Administrador Colegio' },
    { value: 3, label: 'Docente' },
    { value: 4, label: 'Estudiante' },
    { value: 5, label: 'Familia' },
    { value: 6, label: 'Editor' }
  ];

  // Método para obtener nombre del rol
  getRoleName(idrol: number): string {
    const rol = this.perfiles.find(p => p.value === idrol);
    return rol ? rol.label : 'Sin definir';
  }

  updatePaginatedUsuarios(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsuarios = this.filteredUsuarios.slice(startIndex, endIndex);
  }

  filterUsuarios(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsuarios = [...this.usuarios];
    } else {
      this.filteredUsuarios = this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedUsuarios();
  }

  createUsuario(): void {
    this.resetFormState();
    this.showForm = true;
    this.isEditing = false;
    this.ajustarValidacionesPassword(); // ✅ Ajustar validaciones
  }

  saveUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioData: Usuario = {
        username: this.usuarioForm.value.usuario,
        nombre: this.usuarioForm.value.nombres,
        apellido: this.usuarioForm.value.apellidos,
        correo: this.usuarioForm.value.correo,
        estado: this.usuarioForm.value.estado,
        idrol: this.usuarioForm.value.idrol,
        password: (!this.isEditing || this.usuarioForm.value.password.trim())
          ? this.usuarioForm.value.password
          : ''
      };

      // Si está editando, agregar el ID
      if (this.isEditing && this.editingUserId) {
        usuarioData.id = this.editingUserId;
      }

      const operation = this.isEditing
        ? this.usuarioService.actualizarUsuario(this.editingUserId!, usuarioData)
        : this.usuarioService.crearUsuario(usuarioData);

      operation.subscribe({
        next: () => {
          this.cargarUsuarios();
          this.resetFormState();
          Swal.fire({
            title: 'Éxito',
            text: `Usuario ${this.isEditing ? 'actualizado' : 'creado'} correctamente.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error al guardar usuario:', error);
          Swal.fire({
            title: 'Error',
            text: this.getErrorMessage(error),
            icon: 'error'
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.usuarioForm);
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'warning'
      });
    }
  }

  // Método para marcar todos los controles del formulario como tocados
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Método para obtener el mensaje de error
  getErrorMessage(error: any): string {
    if (error && error.error && typeof error.error === 'string') {
      return error.error;
    }
    if (error && error.message) {
      return error.message;
    }
    return 'Ocurrió un error inesperado.';
  }

  resetFormState(): void {
    this.usuarioForm.reset({
      idrol: this.perfiles[0]?.value || 1,
      estado: '1'
    });

    this.showForm = false;
    this.isEditing = false;
    this.editingUserId = undefined;

    // Limpiar errores de validación
    Object.keys(this.usuarioForm.controls).forEach(key => {
      this.usuarioForm.get(key)?.setErrors(null);
      this.usuarioForm.get(key)?.markAsUntouched();
    });

    // Reajustar validaciones
    this.ajustarValidacionesPassword();
  }

  // Método para reajustar validaciones de los campos de contraseña según el modo (creación/edición)
  ajustarValidacionesPassword(): void {
    if (this.isEditing) {
      // En edición, las contraseñas pueden ser opcionales
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('confirmPassword')?.clearValidators();
    } else {
      // En creación, las contraseñas son requeridas
      this.usuarioForm.get('password')?.setValidators([Validators.required]);
      this.usuarioForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
    this.usuarioForm.get('password')?.updateValueAndValidity();
    this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();
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
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          usuario: usuario.username,
          nombres: usuario.nombre,
          apellidos: usuario.apellido,
          correo: usuario.correo,
          idrol: usuario.idrol
        });

        // ✅ Establecer modo edición
        this.isEditing = true;
        this.editingUserId = id;
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar los datos del usuario.',
          icon: 'error'
        });
      }
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
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {
            this.cargarUsuarios(); // Recargar la lista
            Swal.fire({
              title: 'Eliminado',
              text: 'Usuario eliminado exitosamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire({
              title: 'Error',
              text: 'Error al eliminar el usuario.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
      // if (result.isConfirmed) {
      //   this.usuarios = this.usuarios.filter(usuario => Number(usuario.id) !== id);
      //   this.filteredUsuarios = this.usuarios.map(u => ({
      //     id: typeof u.id === 'number' ? u.id : 0,
      //     idcolegio: (u as any).idcolegio ?? 0,
      //     idrol: (u as any).idrol ?? 0,
      //     nombre: (u as any).nombre ?? u.nombres ?? '',
      //     apellido: (u as any).apellido ?? u.apellidos ?? '',
      //     correo: u.correo,
      //     estado: (u as any).estado ?? 1,
      //     username: (u as any).username ?? u.usuario ?? '', // Agregado para cumplir con la interfaz
      //     password: (u as any).password ?? ''
      //   }));
      //   this.updatePaginatedUsuarios();
      //   console.log(`Usuario con ID ${id} eliminado.`);
      // } else {
      //   console.log('Eliminación cancelada.');
      // }
    });
  }

  viewUsuario(id: number): void {
    const usuario = this.usuarios.find(c => String(c.id) === String(id));
    if (usuario) {
      Swal.fire({
        title: `Detalles del Usuario`,
        html: `
          <p><strong>ID:</strong> ${usuario.id}</p>
          <p><strong>Nombre:</strong> ${usuario.nombre}</p>
          <p><strong>Dirección:</strong> ${usuario.apellido}</p>
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

  // Método para cambiar la pestaña activa
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
