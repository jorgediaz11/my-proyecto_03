import { Component } from '@angular/core';
import { UsuarioService, Usuario } from '../../../../services/usuario.service';

@Component({  // Cambié 'standalone: true' a 'standalone: false'
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {  // Cambié 'UsuariosComponent' a 'UsuariosComponent'
  usuarios = [
    { nombre: 'Juan Pérez', email: 'juan.perez@example.com' },
    { nombre: 'María López', email: 'maria.lopez@example.com' },
    { nombre: 'Carlos García', email: 'carlos.garcia@example.com' }
  ];

  activeTab = 'listado'; // Pestaña activa por defecto

  agregarUsuario(nombre: string, email: string) {
    const nuevoUsuario = { nombre, email };
    this.usuarios.push(nuevoUsuario); // Agregar el nuevo usuario al arreglo
  }

  selectTab(tab: string) {
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
