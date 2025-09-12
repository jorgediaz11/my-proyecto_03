import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService, Users } from '../../../../services/usuarios.service';
import Swal from 'sweetalert2';

// Define or import the Usuario interface
export interface Usuario {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './usario-perfil-doc.component.html',
  styleUrls: ['./usario-perfil-doc.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PerfilGenComponent implements OnInit {
  usuario!: Users;
  isEditing = false;
  loading = false;

  usuarioForm!: FormGroup;
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsersService);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.loading = true;
    this.usuarioService.getUsuarioActual().subscribe({
    next: (usuario: Users) => {
      this.usuario = usuario;
      this.loading = false;
      this.usuarioForm.patchValue({
        nombre: usuario.nombres,
        descripcion: usuario.apellido,
        estado: usuario.estado
      });
    },
      error: (error: unknown) => {
        this.loading = false;
        this.handleError('Error al cargar el usuario');
        console.error('Error al cargar usuario:', error);
      }
    });
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      estado: [true, [Validators.required]]
    });
  }

  // Editar perfil
  editPerfil(): void {
    this.isEditing = true;
    this.usuarioForm.patchValue({
      nombre: this.usuario.nombres,
      descripcion: this.usuario.apellido,
      estado: this.usuario.estado
    });
  }

  // Guardar cambios
  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched();
      this.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }
    this.loading = true;
    const formValue = this.usuarioForm.value;
    this.usuarioService.actualizarUsuario(this.usuario.id_usuario!, formValue).subscribe({
      next: () => {
        this.loading = false;
        this.isEditing = false;
        this.handleSuccess('Usuario actualizado correctamente');
        this.cargarUsuario();
      },
      error: (error: unknown) => {
        this.loading = false;
        this.handleError('Error al actualizar el usuario');
        console.error('Error al actualizar perfil:', error);
      }
    });
  }

  // Cancelar edición
  cancelEdit(): void {
    this.isEditing = false;
    this.usuarioForm.patchValue({
      nombre: this.usuario.nombres,
      descripcion: this.usuario.apellido,
      estado: this.usuario.estado
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.markAsTouched();
    });
  }

  showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  handleSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#28a745'
    });
  }

  // ✅ MANEJO DE ERRORES
  private handleError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

}