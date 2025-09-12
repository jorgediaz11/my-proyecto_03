import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

// ✅ ENUM PARA ESTADOS DE RECUPERACIÓN
enum RecoveryState {
  EMAIL_REQUEST = 'email_request',
  EMAIL_SENT = 'email_sent',
  TOKEN_VERIFICATION = 'token_verification',
  PASSWORD_RESET = 'password_reset'
}

@Component({
    selector: 'app-login-recupera',
    templateUrl: './login-recupera.component.html',
    styleUrls: ['./login-recupera.component.css'],
    standalone: false
})
export class LoginRecuperaComponent implements OnInit, OnDestroy {
  // ✅ PROPIEDADES PRINCIPALES DE VALIDACION FORMULARIO Y ESTADO
  recuperaForm!: FormGroup;
  currentState = RecoveryState.EMAIL_REQUEST;
  readonly RecoveryState = RecoveryState; // Para usar en el template

  submitted = false;
  loading = false;
  recoveryError: string | null = null;
  resetToken: string | null = null;
  showFloatingPanel = true; // Agregar la propiedad para controlar la visibilidad del panel flotante

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ INYECCIÓN DE DEPENDENCIAS CON INJECT()
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ✅ MENSAJES DE VALIDACIÓN
  readonly validationMessages = {
    correo: {
      required: 'El correo electrónico es requerido',
      email: 'Ingresa un correo electrónico válido'
    },
    token: {
      required: 'El código de verificación es requerido',
      minlength: 'El código debe tener al menos 6 caracteres'
    },
    password: {
      required: 'La contraseña es requerida',
      minlength: 'La contraseña debe tener al menos 6 caracteres',
      pattern: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula y 4 números'
    },
    confirmPassword: {
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
      this.recuperaForm = this.fb.group({
        correo: ['', [Validators.required, Validators.email]]
      });

      console.log('Formulario de recuperación inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar formulario:', error);
      this.showError('Error al inicializar el formulario');
    }
  }

  // ✅ MÉTODO PRINCIPAL PARA MANEJAR EL ENVÍO DEL FORMULARIO
  onSubmit(): void {
    this.submitted = true;
    this.recoveryError = null;

    if (!this.recuperaForm.valid) {
      console.log('Formulario inválido');
      this.markFormGroupTouched();
      return;
    }

    if (this.loading) {
      return; // Evitar múltiples envíos
    }

    switch (this.currentState) {
      case RecoveryState.EMAIL_REQUEST:
        this.requestPasswordReset();
        break;
      case RecoveryState.TOKEN_VERIFICATION:
        this.verifyToken();
        break;
      case RecoveryState.PASSWORD_RESET:
        this.resetPassword();
        break;
    }
  }

  // ✅ PASO 1: SOLICITAR RECUPERACIÓN DE CONTRASEÑA
  private requestPasswordReset(): void {
    const correo = this.recuperaForm.get('correo')?.value;
    console.log('Solicitando recuperación de contraseña para:', correo);

    this.loading = true;

    this.authService.forgotPassword(correo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Solicitud de recuperación enviada:', response);

          // Guardar token si está disponible (para desarrollo)
          if (response.resetToken) {
            this.resetToken = response.resetToken;
          }

          this.showSuccess('Se ha enviado un correo con las instrucciones para recuperar tu contraseña.', () => {
            this.currentState = RecoveryState.EMAIL_SENT;
            this.setupTokenForm();
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al solicitar recuperación:', error);

          let errorMessage = 'Error al enviar la solicitud. Inténtalo nuevamente.';

          if (error.status === 404) {
            errorMessage = 'No se encontró una cuenta con ese correo electrónico.';
          } else if (error.status === 429) {
            errorMessage = 'Demasiadas solicitudes. Espera unos minutos antes de intentar nuevamente.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor. Contacta al administrador.';
          }

          this.showError(errorMessage);
        }
      });
  }

  // ✅ CONFIGURAR FORMULARIO PARA INGRESAR TOKEN
  private setupTokenForm(): void {
    this.recuperaForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.submitted = false;
  }

  // ✅ PASO 2: VERIFICAR TOKEN DE RECUPERACIÓN
  private verifyToken(): void {
    const token = this.recuperaForm.get('token')?.value;
    console.log('Verificando token:', token);

    this.loading = true;

    this.authService.verifyResetToken(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;

          if (response.valid) {
            this.resetToken = token;
            this.currentState = RecoveryState.PASSWORD_RESET;
            this.setupPasswordForm();
          } else {
            this.showError('Código de verificación inválido o expirado.');
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al verificar token:', error);

          let errorMessage = 'Error al verificar el código.';

          if (error.status === 400) {
            errorMessage = 'Código de verificación inválido o expirado.';
          }

          this.showError(errorMessage);
        }
      });
  }

  // ✅ CONFIGURAR FORMULARIO PARA NUEVA CONTRASEÑA
  private setupPasswordForm(): void {
    this.recuperaForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){4,}).+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });
    this.submitted = false;
  }

  // ✅ PASO 3: RESTABLECER CONTRASEÑA
  private resetPassword(): void {
    const password = this.recuperaForm.get('password')?.value;

    if (!this.resetToken) {
      this.showError('Token de recuperación no válido.');
      return;
    }

    console.log('Restableciendo contraseña...');

    this.loading = true;

    this.authService.resetPassword(this.resetToken, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;

          if (response.success) {
            this.showSuccess('¡Contraseña restablecida exitosamente!', () => {
              this.router.navigate(['/login'], {
                replaceUrl: true,
                state: { passwordReset: true }
              });
            });
          } else {
            this.showError('Error al restablecer la contraseña.');
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al restablecer contraseña:', error);

          let errorMessage = 'Error al restablecer la contraseña.';

          if (error.status === 400) {
            errorMessage = 'Token inválido o expirado. Solicita una nueva recuperación.';
          }

          this.showError(errorMessage);
        }
      });
  }

  // ✅ VALIDADOR PERSONALIZADO PARA CONTRASEÑAS
  private passwordMatchValidator(control: AbstractControl): { passwordMismatch: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.recuperaForm.controls).forEach(key => {
      const control = this.recuperaForm.get(key);
      control?.markAsTouched();
    });
  }

  // ✅ MOSTRAR MENSAJE DE ERROR
  private showError(message: string): void {
    this.recoveryError = message;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#dc3545',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  // ✅ MOSTRAR MENSAJE DE ÉXITO
  private showSuccess(message: string, callback?: () => void): void {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#28a745',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });
  }

  // ✅ LIMPIAR FORMULARIO
  onReset(): void {
    this.recuperaForm.reset();
    this.submitted = false;
    this.recoveryError = null;
    this.loading = false;
  }

  // ✅ REINICIAR PROCESO
  restartProcess(): void {
    this.currentState = RecoveryState.EMAIL_REQUEST;
    this.resetToken = null;
    this.initForm();
    this.onReset();
  }

  // ✅ GETTER PARA FACILITAR ACCESO A LOS CONTROLES
  get f() {
    return this.recuperaForm.controls;
  }

  // ✅ VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.recuperaForm.valid && !this.loading;
  }

  // ✅ OBTENER MENSAJE DE ERROR ESPECÍFICO
  getFieldError(fieldName: string): string | null {
    const field = this.recuperaForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      if (errors) {
        const fieldMessages = this.validationMessages[fieldName as keyof typeof this.validationMessages];

        for (const errorType in errors) {
          if (fieldMessages && fieldMessages[errorType as keyof typeof fieldMessages]) {
            return fieldMessages[errorType as keyof typeof fieldMessages];
          }
        }

        return 'Campo inválido';
      }
    }
    return null;
  }
}
