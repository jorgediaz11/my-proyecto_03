import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, Usuario } from '../../../../services/usuario.service';

@Component({  // Cambié 'standalone: true' a 'standalone: false'
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {  // Cambié 'UsuariosComponent' a 'UsuariosComponent'


  usuarioForm: FormGroup;
  perfiles = [
    { value: 'adminpri', label: 'Admin Pro' },
    { value: 'admincol', label: 'Admin Col' },
    { value: 'docentes', label: 'Docentes' },
    { value: 'estudiantes', label: 'Estudiantes' },
    { value: 'editor', label: 'Editor' }
  ];

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      perfil: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      console.log('Formulario enviado:', this.usuarioForm.value);
      // Aquí iría la lógica para enviar los datos al servidor
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.usuarioForm.markAllAsTouched();
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

}
