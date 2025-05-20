import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-registro',
  templateUrl: './login-registro.component.html',
  styleUrls: ['./login-registro.component.css']
})
export class LoginRegistroComponent { // Cambié 'app-login-registro' a 'app-login-registro'
  // Lógica específica del componente
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {  // Inyecta el FormBuilder para crear formularios reactivos
    this.registroForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  // Método para manejar el evento de clic en el botón de "Registrarse"
  onSubmit(): void {
    if (this.registroForm.valid) {
      console.log('Formulario enviado:', this.registroForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
  // Método para manejar el evento de clic en el botón de "Iniciar sesión"
  onReset(): void {
    this.registroForm.reset(); // Limpia todos los campos del formulario
  }

}
