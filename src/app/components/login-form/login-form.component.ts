import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  onReset() {
  throw new Error('Method not implemented.');
}
  loginForm: FormGroup;
  loginError: string | null = null; // Para mostrar errores de autenticación

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  // Método para manejar el evento de clic en el botón de "Iniciar sesión"
  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    if (this.authService.login(username, password)) {
      // Redirigir o realizar alguna acción en caso de éxito
      console.log('Inicio de sesión exitoso');
      //this.loginError = null;
      this.loginError = 'Credenciales OK';
      this.router.navigate(['/opciones']); // Redirigir a OpcionesComponent
    } else {
      // Mostrar un mensaje de error en caso de credenciales inválidas
      this.loginError = 'Credenciales inválidas. Inténtalo de nuevo.';
    }
  }
  // Método para manejar el evento de clic en el botón de "Registrarse"
  resetForm(): void {
    this.loginForm.reset(); // Limpia todos los campos del formulario
  }

}
