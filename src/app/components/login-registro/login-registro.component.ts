import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

// ✅ INTERFACES PARA TIPADO FUERTE
interface RegisterData {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-registro',
  templateUrl: './login-registro.component.html',
  styleUrls: ['./login-registro.component.css']
})
export class LoginRegistroComponent implements OnInit, OnDestroy {
  // ✅ PROPIEDADES PRINCIPALES
  registroForm!: FormGroup;
  private formInitialized = false;
  submitted = false;
  loading = false;
  registroError: string | null = null;

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ INYECCIÓN DE DEPENDENCIAS CON INJECT()
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ✅ MENSAJES DE VALIDACIÓN
  readonly validationMessages = {
    usuario: {
      required: 'El usuario es requerido',
      minlength: 'El usuario debe tener al menos 3 caracteres',
      pattern: 'Solo se permiten letras, números y guiones',
      userExists: 'Este usuario ya está registrado'
    },
    nombres: {
      required: 'El nombre es requerido',
      minlength: 'El nombre debe tener al menos 2 caracteres'
    },
    apellidos: {
      required: 'Los apellidos son requeridos',
      minlength: 'Los apellidos deben tener al menos 2 caracteres'
    },
    email: {
      required: 'El correo electrónico es requerido',
      email: 'Ingresa un correo electrónico válido',
      userExists: 'Este correo ya está registrado'
    },
    password: {
      required: 'La contraseña es requerida',
      pattern: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula y 4 números',
      minlength: 'La contraseña debe tener al menos 6 caracteres'
    },
    password2: {
      required: 'Confirma tu contraseña',
      passwordMismatch: 'Las contraseñas no coinciden'
    }
  };

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    try {
      this.registroForm = this.fb.group({
        usuario: ['', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z0-9_-]+$/)
        ]],
        nombres: ['', [
          Validators.required,
          Validators.minLength(2)
        ]],
        apellidos: ['', [
          Validators.required,
          Validators.minLength(2)
        ]],
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){4,}).+$/)
        ]],
        password2: ['', [
          Validators.required
        ]]
      }, {
        validators: this.passwordMatchValidator.bind(this)
      });

      this.formInitialized = true;
      console.log('Formulario de registro inicializado correctamente');

      // Limpiar errores específicos cuando el usuario escriba
      this.registroForm.get('usuario')?.valueChanges.subscribe(() => {
        this.clearUserExistsError('usuario');
      });

      this.registroForm.get('email')?.valueChanges.subscribe(() => {
        this.clearUserExistsError('email');
      });

    } catch (error) {
      console.error('Error al inicializar formulario:', error);
      this.formInitialized = false;
      this.showError('Error al inicializar el formulario');
    }
  }

  // ✅ LIMPIAR ERRORES DE USUARIO EXISTENTE
  private clearUserExistsError(fieldName: string): void {
    const field = this.registroForm.get(fieldName);
    if (field && field.errors && field.errors['userExists']) {
      const errors = { ...field.errors };
      delete errors['userExists'];
      const hasOtherErrors = Object.keys(errors).length > 0;
      field.setErrors(hasOtherErrors ? errors : null);
    }
  }

  // ✅ VALIDADOR PERSONALIZADO PARA CONTRASEÑAS
  private passwordMatchValidator(control: AbstractControl): { passwordMismatch: boolean } | null {
    if (!control.get('password') || !control.get('password2')) {
      return null;
    }

    const password = control.get('password')?.value;
    const password2 = control.get('password2')?.value;

    if (password !== password2) {
      control.get('password2')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Limpiar error si las contraseñas coinciden
    const currentErrors = control.get('password2')?.errors;
    if (currentErrors && currentErrors['passwordMismatch']) {
      delete currentErrors['passwordMismatch'];
      const hasOtherErrors = Object.keys(currentErrors).length > 0;
      control.get('password2')?.setErrors(hasOtherErrors ? currentErrors : null);
    }

    return null;
  }
  // ✅ MÉTODO PRINCIPAL DE REGISTRO CON VALIDACIÓN PREVIA
  onSubmit(): void {
    this.submitted = true;
    this.registroError = null;

    if (!this.registroForm.valid) {
      console.log('Formulario inválido');
      this.markFormGroupTouched();
      return;
    }

    if (this.loading) {
      return; // Evitar múltiples envíos
    }

    const formData = this.registroForm.value;
    console.log('Iniciando proceso de registro para:', formData.usuario, formData.email);

    this.loading = true;

    // Paso 1: Verificar si el usuario ya existe
    this.authService.checkUserExists(formData.usuario, formData.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.exists) {
            this.loading = false;
            const fieldDisplayName = response.field === 'username' ? 'usuario' : 'correo electrónico';
            this.showError(`El ${fieldDisplayName} ya está registrado`);

            // Marcar el campo específico como inválido
            const fieldName = response.field === 'username' ? 'usuario' : 'email';
            this.registroForm.get(fieldName)?.setErrors({ userExists: true });
          } else {
            // Paso 2: Si no existe, proceder con el registro
            this.proceedWithRegistration(formData);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al verificar usuario existente:', error);

          // Manejo de errores más específico
          let errorMessage = 'Error al verificar el usuario. Inténtalo nuevamente.';

          if (error.status === 500) {
            errorMessage = 'Error interno del servidor. Contacta al administrador.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
          }

          this.showError(errorMessage);
        }
      });
  }

  // ✅ PROCEDER CON EL REGISTRO DESPUÉS DE VALIDAR QUE EL USUARIO NO EXISTE
  private proceedWithRegistration(formData: { usuario: string; nombres: string; apellidos: string; email: string; password: string }): void {
    const registerData: RegisterData = {
      username: formData.usuario,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      password: formData.password
    };

    this.authService.register(registerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Usuario registrado exitosamente:', response);

          // Limpiar formulario tras éxito
          this.onReset();

          this.showSuccess('¡Usuario registrado exitosamente!', () => {
            // Navegación segura con reseteo de estado
            this.router.navigate(['/login'], {
              replaceUrl: true, // Reemplazar en el historial
              state: { registroExitoso: true } // Pasar estado al login
            });
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al registrar usuario:', error);

          // Manejo de errores más específico
          let errorMessage = 'Error al registrar el usuario. Inténtalo nuevamente.';

          if (error.status === 409) {
            errorMessage = 'El usuario o correo ya está registrado';
          } else if (error.status === 400) {
            errorMessage = 'Datos inválidos. Verifica la información ingresada.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor. Contacta al administrador.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
          }

          this.showError(errorMessage);
        }
      });
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOUCHED PARA MOSTRAR ERRORES
  private markFormGroupTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      control?.markAsTouched();
    });
  }

  // ✅ MOSTRAR MENSAJE DE ERROR CON SWEETALERT2
  private showError(message: string): void {
    this.registroError = message;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#dc3545',
      allowOutsideClick: false, // Evitar cerrar por click fuera
      allowEscapeKey: false     // Evitar cerrar con ESC
    });
  }

  // ✅ MOSTRAR MENSAJE DE ÉXITO CON SWEETALERT2 Y NAVEGACIÓN SEGURA
  private showSuccess(message: string, callback?: () => void): void {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#28a745',
      allowOutsideClick: false, // Evitar cerrar por click fuera
      allowEscapeKey: false     // Evitar cerrar con ESC
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });
  }

  // ✅ LIMPIAR FORMULARIO Y ESTADOS
  onReset(): void {
    this.registroForm.reset();
    this.submitted = false;
    this.registroError = null;
    this.loading = false;
  }

  // ✅ GETTER PARA FACILITAR ACCESO A LOS CONTROLES EN EL TEMPLATE
  get f() {
    return this.registroForm.controls;
  }

  // ✅ VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.registroForm.valid && !this.loading;
  }

  // ✅ MÉTODO PARA OBTENER MENSAJE DE ERROR ESPECÍFICO
  getFieldError(fieldName: string): string | null {
    const field = this.registroForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      if (errors) {
        const fieldMessages = this.validationMessages[fieldName as keyof typeof this.validationMessages];

        // Buscar el primer error y devolver su mensaje
        for (const errorType in errors) {
          if (fieldMessages && fieldMessages[errorType as keyof typeof fieldMessages]) {
            return fieldMessages[errorType as keyof typeof fieldMessages];
          }
        }

        // Si no se encuentra un mensaje específico, devolver un mensaje genérico
        return 'Campo inválido';
      }
    }
    return null;
  }

}
