import { Component, inject } from '@angular/core';
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
  mostrarContrasena = false;
  mostrarConfirmar = false;

  // ✅ Propiedades necesarias para la plantilla HTML estandarizada
  loading = false;
  todayES: string = new Date().toLocaleDateString('es-ES');

  activeTab = 'perfil'; // Pestaña activa por defecto

  historialAccesos = [
    { fecha: '2024-06-01', hora: '08:15', pc: 'PC-01', ip: '192.168.1.10' },
    { fecha: '2024-06-02', hora: '09:05', pc: 'PC-02', ip: '192.168.1.11' },
    { fecha: '2024-06-03', hora: '07:55', pc: 'PC-03', ip: '192.168.1.12' }
  ];


  // Inyección de dependencias
  private fb = inject(FormBuilder);

  constructor() {            // Constructor
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
      console.log('Datos del perfil guardados:', this.perfilForm.value);
    }
    }

  selectTab(tab: string): void {   // Método para cambiar de pestaña
    this.activeTab = tab;
  }

  // ✅ Métodos adicionales necesarios para la plantilla estandarizada
  resetForm() {
    this.perfilForm.reset();
    // Restaurar valores originales
    this.perfilForm.patchValue({
      nombres: this.usuarioActivo.nombres,
      apellidos: this.usuarioActivo.apellidos,
      correo: this.usuarioActivo.correo,
      telefono: this.usuarioActivo.telefono,
      foto: this.usuarioActivo.foto
    });
  }

}
