import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService, Usuario } from '../../../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  // ✅ PROPIEDADES ESENCIALES
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  paginatedUsuarios: Usuario[] = [];

  // ✅ CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchUser = '';
  showForm = false;
  isEditing = false;
  editingUserId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  // ✅ FORMULARIO REACTIVO
  usuarioForm!: FormGroup;

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math; // Para Math.min en paginación

  // ✅ FECHA EN ESPAÑOL PARA EL TEMPLATE
  get todayES(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // ✅ CONFIGURACIÓN DE ROLES
  readonly perfiles = [
    { value: 1, label: 'Administrador Principal' },
    { value: 2, label: 'Administrador Colegio' },
    { value: 3, label: 'Docente' },
    { value: 4, label: 'Estudiante' },
    { value: 5, label: 'Familia' },
    { value: 6, label: 'Editor' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      idrol: [1, [Validators.required]],
      idcolegio: [1, [Validators.required, Validators.min(1)]],
      estado: ['1', [Validators.required]]
    }, {
      validators: this.passwordsMatch.bind(this)
    });
  }

  // ✅ VALIDADOR DE CONTRASEÑAS
  private passwordsMatch(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (this.isEditing && !password && !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // ✅ CARGA DE USUARIOS
  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios || [];
        this.filteredUsuarios = [...this.usuarios];
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al cargar usuarios:', error);
        this.showError('Error al cargar los usuarios');
      }
    });
  }

  // ✅ FILTRADO
  filterUsuarios(): void {
    const searchTerm = this.searchUser.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredUsuarios = [...this.usuarios];
    } else {
      this.filteredUsuarios = this.usuarios.filter(usuario =>
        usuario.username?.toLowerCase().includes(searchTerm) ||
        usuario.nombre?.toLowerCase().includes(searchTerm) ||
        usuario.apellido?.toLowerCase().includes(searchTerm) ||
        usuario.correo?.toLowerCase().includes(searchTerm)
      );
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  // ✅ PAGINACIÓN
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsuarios = this.filteredUsuarios.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    const totalPages = this.getTotalPages().length;
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredUsuarios.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // ✅ CREAR USUARIO
  createUsuario(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingUserId = undefined;
    this.activeTab = 'nuevo';

    this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
    this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();
  }

  // ✅ EDITAR USUARIO
  editUsuario(id: number): void {
    this.loading = true;
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.isEditing = true;
        this.editingUserId = id;
        this.activeTab = 'nuevo';

        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('confirmPassword')?.clearValidators();
        this.usuarioForm.get('password')?.updateValueAndValidity();
        this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();

        this.usuarioForm.patchValue({
          username: usuario.username,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          idrol: usuario.idrol,
          idcolegio: usuario.idcolegio || 1,
          estado: usuario.estado,
          password: '',
          confirmPassword: ''
        });

        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al cargar usuario:', error);
        this.showError('Error al cargar el usuario para edición');
      }
    });
  }

  // ✅ VER USUARIO
  viewUsuario(id: number): void {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
      Swal.fire({
        title: 'Detalles del Usuario',
        html: `
          <div class="text-left space-y-3">
            <div><strong>ID:</strong> ${usuario.id}</div>
            <div><strong>Usuario:</strong> ${usuario.username}</div>
            <div><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}</div>
            <div><strong>Correo:</strong> ${usuario.correo}</div>
            <div><strong>Rol:</strong> ${this.getRoleName(usuario.idrol ?? 0)}</div>
            <div><strong>Colegio ID:</strong> ${usuario.idcolegio}</div>
            <div><strong>Estado:</strong>
              <span class="${usuario.estado === '1' ? 'text-green-600' : 'text-red-600'}">
                ${usuario.estado === '1' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4EAD4F'
      });
    }
  }

  // ✅ ELIMINAR USUARIO
  deleteUsuario(id: number): void {
    Swal.fire({
      title: '¿Eliminar Usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.showSuccess('Usuario eliminado correctamente');
          },
          error: (error) => {
            this.loading = false;
            console.error('Error al eliminar usuario:', error);
            this.showError('Error al eliminar el usuario');
          }
        });
      }
    });
  }

  // ✅ SUBMIT FORMULARIO
  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched();
      this.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    this.loading = true;
    const formData = this.prepareFormData();

    const operation = this.isEditing
      ? this.usuarioService.actualizarUsuario(this.editingUserId!, formData)
      : this.usuarioService.crearUsuario(formData);

    operation.subscribe({
      next: () => {
        this.cargarUsuarios();
        this.resetForm();
        this.activeTab = 'tabla';
        this.showSuccess(`Usuario ${this.isEditing ? 'actualizado' : 'creado'} correctamente`);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al guardar usuario:', error);
        this.showError(`Error al ${this.isEditing ? 'actualizar' : 'crear'} el usuario`);
      }
    });
  }

  // ✅ PREPARAR DATOS
  private prepareFormData(): Usuario {
    const formValue = this.usuarioForm.value;

    const userData: Usuario = {
      username: formValue.username.trim(),
      nombre: formValue.nombre.trim(),
      apellido: formValue.apellido.trim(),
      correo: formValue.correo.toLowerCase().trim(),
      idrol: Number(formValue.idrol),
      idcolegio: Number(formValue.idcolegio),
      estado: formValue.estado,
      password: formValue.password && formValue.password.trim() ? formValue.password.trim() : ''
    };

    if (this.isEditing && this.editingUserId) {
      userData.id = this.editingUserId;
    }

    return userData;
  }

  // ✅ RESET FORM
  resetForm(): void {
    this.usuarioForm.reset({
      idrol: 1,
      idcolegio: 1,
      estado: '1'
    });
    this.isEditing = false;
    this.editingUserId = undefined;
  }

  // ✅ UTILIDADES
  getRoleName(idrol: number): string {
    const perfil = this.perfiles.find(p => p.value === idrol);
    return perfil ? perfil.label : 'Sin definir';
  }

  trackByUserId(index: number, usuario: Usuario): any {
    return usuario.id;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.markAsTouched();
    });
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }
}
