// Interface auxiliar para manejo de errores HTTP en cargarUsuarios
interface ErrorObj { status?: number; error?: { message?: string }; message?: string }
import { Component, OnInit, inject, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsersService, Users, CreateUserDto, UpdateUserDto } from '../../../../services/usuarios.service';
import { ColegiosService, Colegio } from '../../../../services/colegios.service';
import { Perfil, PerfilesService } from '../../../../services/perfiles.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class UsuariosComponent implements OnInit, DoCheck {
  ngDoCheck(): void {
    if (this.activeTab === 'nuevo') {
      // Solo mostrar si el formulario está inválido y no está cargando
      if (this.usuarioForm && this.usuarioForm.invalid && !this.loading) {
        const invalidControls = Object.keys(this.usuarioForm.controls)
          .filter(key => this.usuarioForm.get(key)?.invalid)
          .map(key => `${key}: ${JSON.stringify(this.usuarioForm.get(key)?.errors)}`)
          .join('\n');
        // Solo mostrar una vez por cambio
        if (invalidControls) {
          // Puedes comentar esta línea si es muy invasivo
          // alert('Formulario inválido. Controles con error:\n' + invalidControls);
          console.log('DEBUG FORM INVALID:', invalidControls);
        }
      }
    }
  }
  // ✅ PROPIEDADES ESENCIALES
  usuarios: Users[] = [];
  filteredUsuarios: Users[] = [];
  paginatedUsuarios: Users[] = [];

  // ✅ CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  filtroPerfil = '';
  filtroColegio = '';
  showForm = false;
  isEditing = false;
  editingUserId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' = 'tabla';

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
  perfiles: Perfil[] = [];

  // ✅ INYECCIÓN DE DEPENDENCIAS CON INJECT()
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private colegiosService = inject(ColegiosService);
  private perfilService = inject(PerfilesService);

  // ✅ COLEGIOS
  colegios: Colegio[] = [];

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarColegios();
    this.cargarPerfiles();
    this.cargarUsuarios();
  }

  cargarPerfiles(): void {
    this.perfilService.getPerfiles().subscribe({
      next: (perfiles: Perfil[]) => {
        this.perfiles = perfiles.filter(p => p.estado); // solo activos
      },
      error: (error: unknown) => {
        console.error('Error al cargar perfiles:', error);
      }
    });
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nrodni: ['', [Validators.required, Validators.minLength(8)]],
      fecha_nacimiento: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      id_perfil: [1, [Validators.required]],
      id_colegio: [1, [Validators.required, Validators.min(1)]],
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
    this.usersService.getUsuarios().subscribe({
      next: (usuarios: Users[]) => {
    this.usuarios = (usuarios || []).sort((a, b) => (a.id_usuario ?? 0) - (b.id_usuario ?? 0));
    this.filteredUsuarios = [...this.usuarios];
        this.updatePagination();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        // Mostrar detalles del error en consola y en el alert
        console.error('Error al cargar usuarios:', error);
        let msg = 'Error al cargar los usuarios';
        const err = error as ErrorObj;
        if (err && typeof err === 'object' && 'status' in err && err.status) {
          msg += `\nStatus: ${err.status}`;
        }
        if (err && typeof err === 'object' && err.error && err.error.message) {
          msg += `\nMensaje: ${err.error.message}`;
        } else if (err && typeof err === 'object' && err.message) {
          msg += `\nMensaje: ${err.message}`;
        }
        this.showError(msg);
      }
    });
  }

  cargarColegios(): void {
    this.colegiosService.getColegiosClientes().subscribe({
      next: (colegios: Colegio[]) => {
        this.colegios = colegios || [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar colegios:', error);
      }
    });
  }

  // ✅ FILTRADO
  filterUsuarios(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();
  let filtered = [...this.usuarios].sort((a, b) => (a.id_usuario ?? 0) - (b.id_usuario ?? 0));
    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(usuario =>
        usuario.username?.toLowerCase().includes(searchTerm) ||
        usuario.nombres?.toLowerCase().includes(searchTerm) ||
        usuario.apellido?.toLowerCase().includes(searchTerm) ||
        usuario.correo?.toLowerCase().includes(searchTerm)
      );
    }
    // Filtro por perfil
    if (this.filtroPerfil) {
      filtered = filtered.filter(usuario => usuario.id_perfil === Number(this.filtroPerfil));
    }
    // Filtro por colegio
    if (this.filtroColegio) {
      filtered = filtered.filter(usuario => usuario.id_colegio === Number(this.filtroColegio));
    }
    this.filteredUsuarios = filtered;
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
  editUsuario(id_usuario: number): void {
    this.loading = true;
    this.usersService.getUserById(id_usuario).subscribe({
      next: (usuario: Users) => {
        this.isEditing = true;
        this.editingUserId = id_usuario;
        this.activeTab = 'nuevo';

  // Al editar, los campos de contraseña NO son obligatorios
  this.usuarioForm.get('password')?.setValidators([]);
  this.usuarioForm.get('confirmPassword')?.setValidators([]);
  this.usuarioForm.get('password')?.updateValueAndValidity();
  this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();

        this.usuarioForm.patchValue({
          username: usuario.username,
          nombres: usuario.nombres,
          apellido: usuario.apellido,
          nrodni: usuario.dni || '',
          fecha_nacimiento: usuario.fecha_nacimiento || '',
          correo: usuario.correo,
          id_perfil: usuario.id_perfil,
          id_colegio: usuario.id_colegio || 1,
          estado: usuario.estado ? '1' : '0',
          password: '',
          confirmPassword: ''
        });

        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al cargar usuario:', error);
        this.showError('Error al cargar el usuario para edición');
      }
    });
  }

  // ✅ VER USUARIO
  viewUsuario(id_usuario: number): void {
    const usuario = this.usuarios.find(u => u.id_usuario === id_usuario);
    if (usuario) {
      Swal.fire({
        title: 'Detalles del Usuario',
        html: `
          <div class="text-left space-y-3">
            <div><strong>ID:</strong> ${usuario.id_usuario}</div>
            <div><strong>Usuario:</strong> ${usuario.username}</div>
            <div><strong>Nombre:</strong> ${usuario.nombres} ${usuario.apellido}</div>
            <div><strong>Correo:</strong> ${usuario.correo}</div>
            <div><strong>Rol:</strong> ${this.getRoleName(usuario.id_perfil ?? 0)}</div>
            <div><strong>Colegio ID:</strong> ${usuario.id_colegio}</div>
            <div><strong>Estado:</strong>
              <span class="${usuario.estado ? 'text-green-600' : 'text-red-600'}">
                ${usuario.estado ? 'Activo' : 'Inactivo'}
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
  deleteUsuario(id_usuario: number): void {
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
        this.usersService.eliminarUsuario(id_usuario).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.showSuccess('Usuario eliminado correctamente');
          },
          error: (error: unknown) => {
            this.loading = false;
            console.error('Error al eliminar usuario:', error);
            this.showError('Error al eliminar el usuario');
          }
        });
      }
    });
  }

  // ✅ CREAR USUARIO - LOGICA
  private createUsuarioLogic(formData: CreateUserDto): void {
    this.usersService.crearUsuario(formData as Users).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.resetForm();
        this.activeTab = 'tabla';
        this.showSuccess('Usuario creado correctamente');
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al crear usuario:', error);
        this.showError('Error al crear el usuario');
      }
    });
  }

  // ✅ ACTUALIZAR USUARIO - LOGICA
  private updateUsuarioLogic(formData: UpdateUserDto & { password?: string }): void {
  console.log('Payload enviado al endpoint /usuarios/:id:', formData);
  this.usersService.actualizarUsuario(this.editingUserId!, formData).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.resetForm();
        this.activeTab = 'tabla';
        this.showSuccess('Usuario actualizado correctamente');
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Error al actualizar usuario:', error);
        this.showError('Error al actualizar el usuario');
      }
    });
  }

  // ✅ SUBMIT FORMULARIO
  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched();
      // ALERTA DEBUG: Mostrar controles inválidos
      const invalidControls = Object.keys(this.usuarioForm.controls)
        .filter(key => this.usuarioForm.get(key)?.invalid)
        .map(key => `${key}: ${JSON.stringify(this.usuarioForm.get(key)?.errors)}`)
        .join('\n');
      alert('Formulario inválido. Controles con error:\n' + invalidControls);
      this.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    this.loading = true;
    const formData = this.prepareFormData();

    if (this.isEditing && this.editingUserId) {
      // Actualizar usuario existente
      this.updateUsuarioLogic(formData as Partial<Users>);
    } else {
      // Crear nuevo usuario
      this.createUsuarioLogic(formData as CreateUserDto);
    }
  }

  // ✅ PREPARAR DATOS - VERSIÓN CORREGIDA
  private prepareFormData(): CreateUserDto | (UpdateUserDto & { password?: string }) {
    const formValue = this.usuarioForm.value;

    if (!this.isEditing) {
      // Crear nuevo usuario: incluir todos los campos requeridos
      const userData: CreateUserDto = {
        username: formValue.username.trim(),
        password: formValue.password.trim(), // Obligatorio para nuevo usuario
        nombres: formValue.nombres.trim(),
        apellido: formValue.apellido.trim(),
        dni: formValue.nrodni.trim(),
        fecha_nacimiento: formValue.fecha_nacimiento,
        correo: formValue.correo.toLowerCase().trim(),
        id_perfil: Number(formValue.id_perfil),
        id_colegio: Number(formValue.id_colegio),
        estado: formValue.estado === '1'
      };
      return userData;
    } else {
      // Actualizar usuario: solo incluir campos que pueden cambiar
      const userData: UpdateUserDto & { password?: string } = {
        nombres: formValue.nombres.trim(),
        apellido: formValue.apellido.trim(),
        dni: formValue.nrodni.trim(),
        fecha_nacimiento: formValue.fecha_nacimiento,
        correo: formValue.correo.toLowerCase().trim(),
        id_perfil: Number(formValue.id_perfil),
        id_colegio: Number(formValue.id_colegio),
        estado: formValue.estado === '1'
      };

      // 🔒 MANEJO CORRECTO DE CONTRASEÑA EN EDICIÓN
      // Solo incluir password si se proporcionó una nueva
      if (formValue.password && formValue.password.trim()) {
        userData.password = formValue.password.trim();
      }
      // Si no hay password, NO incluir el campo en el objeto
      // Esto permite al backend mantener la contraseña actual

      return userData;
    }
  }

  // ✅ RESET FORM
  resetForm(): void {
    this.usuarioForm.reset({
      id_perfil: 1,
      id_colegio: 1,
      estado: '1'
    });
    this.isEditing = false;
    this.editingUserId = undefined;
  }

  // ✅ UTILIDADES
  getRoleName(id_perfil: number): string {
    const perfil = this.perfiles.find(p => p.id === id_perfil);
    return perfil ? perfil.nombre : 'Sin definir';
  }

  trackByUserId(index: number, usuario: Users): number | undefined {
    return usuario.id_usuario;
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

  private resetFilters(): void {
    this.searchTerm = '';
    this.filtroPerfil = '';
    this.filtroColegio = '';
    this.cargarUsuarios();
  }
}
