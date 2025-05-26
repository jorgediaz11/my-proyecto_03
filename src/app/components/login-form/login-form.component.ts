import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación
import { Router } from '@angular/router';

@Component({  // Cambié 'app-login-form' a 'app-login-form'
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  onReset() {                                 // Cambié 'onReset' a 'resetForm'
  throw new Error('Method not implemented. // El Metodo no esta implementado.'); // Método para manejar el evento de clic en el botón de "Restablecer"
}

  loginForm: FormGroup;                       // Formulario reactivo para el inicio de sesión
  loginError: string | null = null;           // Para mostrar errores de autenticación
  // Variables para interactuar con el endpoint
  // email = '';     // Campo de correo electrónico
  // password = '';  // Campo de contraseña
  // error = '';     // Para mostrar errores de autenticación

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  // Método para manejar el evento de clic en el botón de "Iniciar sesión"
  submitted = false;
  onSubmit(): void {
    this.submitted = true; // Marca el formulario como enviado
    this.loginError = null; // Limpia el mensaje de error al intentar iniciar sesión
    if (this.loginForm.invalid) return; // Si el formulario es inválido, no hace nada
    const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
    this.loginError = 'email: ' + email + ' password: ' + password; // Muestra los valores en el mensaje de error (para depuración)
    // Llama al servicio de autenticación para iniciar sesión
    this.authService.login(email, password).subscribe({ // Cambié 'authService.login' a 'this.authService.login'
      // next: (response) => {          // Maneja la respuesta del servidor
      next: (response: any) => {
        console.log('Respuesta del servidor:', response); // <-- Aquí ves la respuesta
        // Maneja la respuesta del servidor
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.loginError = 'LOGIN EXITOSO';
          // Redirige si quieres
          // this.router.navigate(['/opciones']);
        } else {
          this.loginError = 'Respuesta inesperada del servidor';
        }
      },
      // error: (err) => {               // Maneja el error
      error: (err: any) => {
        this.loginError = 'Credenciales incorrectas 02';  // Muestra un mensaje de error
        console.error('Error de inicio de sesión:', err); // Muestra el error en la consola
      }
    });


    // if (this.authService.login(username, password)) {
    //   // Redirigir o realizar alguna acción en caso de éxito
    //   console.log('Inicio de sesión exitoso');
    //   //this.loginError = null;
    //   this.loginError = 'Credenciales OK';
    //   this.router.navigate(['/opciones']); // Redirigir a OpcionesComponent
    // } else {
    //   // Mostrar un mensaje de error en caso de credenciales inválidas
    //   this.loginError = 'Credenciales inválidas. Inténtalo de nuevo.';
    // }


  }

  // Método para manejar el evento de clic en el botón de "Registrarse"
  resetForm(): void {
    this.loginForm.reset(); // Limpia todos los campos del formulario
    this.loginError = '';   // Limpia el mensaje de error
  }

}
