import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  usuarioActivo = {
    nombres: 'Juan',
    apellidos: 'Pérez',
    correo: 'juan.perez@gmail.com',
    telefono: '987654321',
    foto: 'https://randomuser.me/api/portraits/men/1.jpg'
  };

  perfilForm: FormGroup;
  mostrarContrasena: boolean = false;
  mostrarConfirmar: boolean = false;

  activeTab = 'perfil'; // Pestaña activa por defecto

  historialAccesos = [
    { fecha: '2024-06-01', hora: '08:15', pc: 'PC-01', ip: '192.168.1.10' },
    { fecha: '2024-06-02', hora: '09:05', pc: 'PC-02', ip: '192.168.1.11' },
    { fecha: '2024-06-03', hora: '07:55', pc: 'PC-03', ip: '192.168.1.12' }
  ];


  constructor(private fb: FormBuilder) {            // Constructor
    this.perfilForm = this.fb.group({
      nombres: [this.usuarioActivo.nombres, Validators.required],
      apellidos: [this.usuarioActivo.apellidos, Validators.required],
      correo: [this.usuarioActivo.correo, [Validators.required, Validators.email]],
      telefono: [this.usuarioActivo.telefono, Validators.required],
      foto: [this.usuarioActivo.foto],
      contrasena: ['', [Validators.minLength(6)]],
      confirmarContrasena: ['']
    }, { validators: this.passwordsMatchValidator.bind(this) });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('contrasena')!.value === form.get('confirmarContrasena')!.value
      ? null : { mismatch: true };
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      // Actualizar datos del usuario activo (simulado)
      Object.assign(this.usuarioActivo, this.perfilForm.value);
      alert('Datos actualizados correctamente');
    }
    }

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
