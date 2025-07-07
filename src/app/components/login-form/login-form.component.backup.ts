import { Component } from '@angular/core';  // Importa el decorador Component de Angular
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación
import { Router } from '@angular/router'; // Importa el enrutador para redirigir después del inicio de sesión exitoso

@Component({  // Cambié 'app-login-form' a 'app-login-form'
  selector: 'app-login-form',                 // Asegúrate de que el selector sea único y descriptivo
  templateUrl: './login-form.component.html', // Asegúrate de que la ruta al archivo HTML sea correcta
  styleUrls: ['./login-form.component.css']   // Asegúrate de que la ruta al archivo CSS sea correcta
})
export class LoginFormComponent {
  validationMessage: any;

  loginForm: FormGroup;                       // Formulario reactivo para el inicio de sesión
  loginError: string | null = null;           // Para mostrar errores de autenticación

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){4,}).+$/)
        ]
      ]
    });
  }
  // Método para manejar el evento de clic en el botón de "Iniciar sesión"
  submitted = false;
  onSubmit(): void {
    this.submitted = true; // Marca el formulario como enviado
    this.loginError = null; // Limpia el mensaje de error al intentar iniciar sesión
    if (this.loginForm.invalid) return; // Si el formulario es inválido, no hace nada
    const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
    //this.loginError = 'email: ' + email + ' password: ' + password; // Muestra los valores en el mensaje de error (para depuración)

    // Llama al servicio de autenticación para iniciar sesión ENDPOINT - API
    this.authService.login(email, password).subscribe({ // Cambié 'authService.login' a 'this.authService.login'
      // next: (response) => {          // Maneja la respuesta del servidor
      next: (response: any) => {
        console.log('Respuesta del servidor:', response); // <-- Aquí ves la respuesta
        // Maneja la respuesta del servidor
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          console.log('Token almacenado:', localStorage.getItem('access_token')); // <-- Verificación
          this.loginError = 'LOGIN EXITOSO';
          // Redirige si quieres
          this.router.navigate(['/opciones']);
        } else {
          this.loginError = 'Respuesta inesperada del servidor';
        }
      },
      // error: (err) => {               // Maneja el error EndPoint - API
      error: (err: any) => {
        this.loginError = 'Credenciales incorrectas 02';  // Muestra un mensaje de error
        console.error('Error de inicio de sesión:', err); // Muestra el error en la consola
      }
    });
  }

  // Método para manejar el evento de clic en el botón de "Registrarse"
  resetForm(): void {
    this.loginForm.reset(); // Limpia todos los campos del formulario
    this.loginError = '';   // Limpia el mensaje de error
  }

  onReset() {
    this.loginForm.reset();
  }

}
