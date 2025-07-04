import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-registro',                 // Asegúrate de que el selector sea único y descriptivo
  templateUrl: './login-registro.component.html', // Asegúrate de que la ruta al archivo HTML sea correcta
  styleUrls: ['./login-registro.component.css']   // Asegúrate de que la ruta al archivo CSS sea correcta
})
export class LoginRegistroComponent { // Cambié 'app-login-registro' a 'app-login-registro'
  // Lógica específica del componente
  registroForm: FormGroup;  // Define un FormGroup para manejar el formulario de registro

  constructor(private fb: FormBuilder) {  // Inyecta el FormBuilder para crear formularios reactivos
    this.registroForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){4,}).+$/)
        ]
      ],
      password2: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){4,}).+$/)
        ]
      ]
    });
  }
  // Método para manejar el evento de clic en el botón de "Registrarse"
  onSubmit(): void {
    if (this.registroForm.valid) {  // Verifica si el formulario es válido
      console.log('Formulario enviado:', this.registroForm.value);
    } else {
      console.log('Formulario inválido'); // Muestra un mensaje si el formulario no es válido
    }
  }
  // Método para manejar el evento de clic en el botón de "Iniciar sesión"
  onReset(): void {
    this.registroForm.reset(); // Limpia todos los campos del formulario
  }

}
