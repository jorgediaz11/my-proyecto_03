import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { UsuarioService as UserService, Usuario } from '../../../../services/usuario.service';

@Component({  // Cambié 'standalone: true' a 'standalone: false'
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {  // Cambié 'UsuariosComponent' a 'UsuariosComponent'
  private userService = inject(UserService);

  usuarios = signal<Usuario[]>([]); // Arreglo para almacenar los usuarios

  activeTab = 'listado'; // Pestaña activa por defecto

  agregarUsuario(nombres: string, correo: string) {
    const nuevoUsuario: Usuario = { nombres, correo, telefono: '999-999-999', perfil: 'Usuario', usuario: 'Nuevo Usuario', apellidos: 'Apellido' };
    // this.usuarios.push(nuevoUsuario); // Agregar el nuevo usuario al arreglo
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (usuarios) => {
        console.debug('Usuarios obtenidos:', usuarios); // Muestra los usuarios obtenidos
        const _usuarios = usuarios.map(user => ({
          usuario: user.username,
          nombres: user.firstName,
          apellidos: user.lastName,
          correo: user.email,
          telefono: '999-999-999', // valor por defecto, no existe en el backend
          perfil: user.role,
          id: user.id // Asignar el ID si está disponible
        }))

        this.usuarios.set(_usuarios); // Actualiza el arreglo de usuarios
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error); // Muestra el error en la consola
      }
    });
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
