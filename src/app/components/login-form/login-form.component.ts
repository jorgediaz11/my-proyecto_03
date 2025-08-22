import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService, LoginResponse } from '../../services/auth.service'; // ✅ IMPORTAR LoginResponse del servicio
import { UserStateService } from '../../services/user-state.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
// ✅ AGREGAR IMPORT PARA ANIMACIONES en el Form
import { trigger, style, transition, animate } from '@angular/animations';

// ✅ INTERFACES PARA TIPADO FUERTE
interface LoginRequest {
  correo: string;
  password: string;
}

// ✅ REMOVER LoginResponse local - usar la del AuthService
interface Usuario {
  id_usuario: number;
  username: string;
  nombre: string;
  apellido: string;
  correo: string;
  id_perfil: number;
  id_colegio: number;
  estado: string;
}

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css'],
    // ✅ DEFINIR ANIMACIONES
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('0.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('0.3s ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ],
    standalone: false
})
export class LoginFormComponent implements OnInit, OnDestroy {

  // ✅ PROPIEDADES PRINCIPALES
  loginForm!: FormGroup;
  private formInitialized = false;
  submitted = false;
  loading = false;
  loginError: string | null = null;
  showPassword = false;

  // ✅ SOLUCIÓN PARA EL AÑO - PROPIEDAD ESTÁTICA
  readonly currentYear = new Date().getFullYear();

  // ✅ PARA CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // ✅ CONFIGURACIÓN DE ROLES
  readonly perfiles = [
    { value: 1, label: 'Administrador Principal' },
    { value: 2, label: 'Administrador Colegio' },
    { value: 3, label: 'Docente' },
    { value: 4, label: 'Estudiante' },
    { value: 5, label: 'Familia' },
    { value: 6, label: 'Editor' }
  ];

  // ✅ MENSAJES DE VALIDACIÓN MEJORADOS
  readonly validationMessages = {
    correo: {
      required: 'El correo electrónico es requerido',
      email: 'Ingresa un correo electrónico válido',
      pattern: 'El formato del correo no es válido',
      invalidFormat: 'El formato del correo no es válido'
    },
    password: {
      required: 'La contraseña es requerida',
      pattern: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula y 4 números',
      minlength: 'La contraseña debe tener al menos 6 caracteres'
    }
  };

  // Inyección de dependencias usando inject()
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userStateService = inject(UserStateService);
  private router = inject(Router);

  constructor() {
    // No inicializar form en constructor para evitar problemas
  }

  ngOnInit(): void {
    this.initForm();
    this.checkExistingAuth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ INICIALIZACIÓN SEGURA DEL FORMULARIO
  private initForm(): void {
    try {
      this.loginForm = this.fb.group({
        correo: [
          '',
          [
            Validators.required,
            Validators.email,
            this.correoValidator.bind(this)
          ]
        ],
        password: [
          '',
          [
            Validators.required
            // ✅ SOLO REQUIRED PARA LOGIN - Las validaciones fuertes son para registro/cambio
            // Esto permite login con passwords existentes que no cumplan reglas nuevas
          ]
        ]
      });

      this.formInitialized = true;
      console.log('Formulario inicializado correctamente');

    } catch (error) {
      console.error('Error al inicializar formulario:', error);
      this.formInitialized = false;
      this.showError('Error al inicializar el formulario');
    }
  }

  // ✅ VALIDADOR PERSONALIZADO PARA CORREO
  private correoValidator(control: AbstractControl): import('@angular/forms').ValidationErrors | null {
    if (!control.value) return null;

    try {
      const correo = control.value.toLowerCase().trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(correo)) {
        return { invalidFormat: true };
      }

      return null;
    } catch (error) {
      console.error('Error en validador de correo:', error);
      return { invalidFormat: true };
    }
  }

  // ✅ VERIFICAR AUTENTICACIÓN EXISTENTE
  private checkExistingAuth(): void {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const user = JSON.parse(userData) as Usuario;
        if (this.isTokenValid(token)) {
          console.log('Usuario ya autenticado:', user);
          this.router.navigate(['/opciones']);
        }
      }
    } catch (error) {
      console.error('Error al validar datos de usuario:', error);
      this.clearAuthData();
    }
  }

  // ✅ VALIDAR TOKEN
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  // ========================================================================
  // ✅ MÉTODOS PRINCIPALES REV
  // ========================================================================

  // ✅ SUBMIT DEL FORMULARIO
  onSubmit(): void {
    console.log('🚀 === INICIO DE LOGIN ===');

    if (!this.formInitialized || !this.loginForm) {
      console.error('❌ Formulario no inicializado correctamente');
      this.showError('Formulario no inicializado correctamente');
      return;
    }

    this.submitted = true;
    this.loginError = null;

    if (this.loginForm.invalid) {
      console.error('❌ Formulario inválido');
      this.markFormGroupTouched();
      this.showValidationError();
      return;
    }

    try {
      const loginData = this.prepareLoginData();
      console.log('📤 Datos preparados para login:', { correo: loginData.correo, password: '***' });
      this.performLogin(loginData);
    } catch (error) {
      console.error('❌ Error en submit:', error);
      this.showError('Error al procesar los datos');
    }
  }

  // ✅ PREPARAR DATOS PARA EL ENDPOINT
  private prepareLoginData(): LoginRequest {
    const formValue = this.loginForm.value;
    return {
      correo: formValue.correo.toLowerCase().trim(),
      password: formValue.password.trim()
    };
  }

  // ✅ EJECUTAR LOGIN
  private performLogin(loginData: LoginRequest): void {
    console.log('🚀 Iniciando proceso de login...');
    console.log('📤 Datos de login:', { correo: loginData.correo, password: '***' });

    this.loading = true;
    this.loginError = null;

    this.authService.login(loginData.correo, loginData.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: LoginResponse) => {
          console.log('✅ Respuesta de login recibida:', response);
          this.handleLoginSuccess(response);
        },
        error: (error: unknown) => {
          console.error('❌ Error en login:', error);
          this.handleLoginError(error);
        },
        complete: () => {
          console.log('🏁 Proceso de login completado');
          this.loading = false;
        }
      });
  }

  // ✅ MANEJO DE LOGIN EXITOSO - VERSIÓN SEGURA
  private handleLoginSuccess(response: LoginResponse): void {
    console.log('🎉 handleLoginSuccess ejecutándose...');
    console.log('📦 Estructura de response:', Object.keys(response || {}));
    console.log('🔑 Token existe:', !!response?.access_token);
    console.log('👤 User existe:', !!response?.user);

    if (response?.user) {
      console.log('📋 Datos del usuario:', {
        id: response.user.id_usuario,
        username: response.user.username,
        nombre: response.user.nombre,
        apellido: response.user.apellido,
        correo: response.user.correo,
        id_perfil: response.user.id_perfil,
        id_colegio: response.user.id_colegio,
        estado: response.user.estado
      });
    }

    if (!response || !response.access_token) {
      console.error('❌ Respuesta del servidor inválida');
      this.showError('Respuesta del servidor inválida');
      return;
    }

    try {
      console.log('💾 Guardando token en localStorage...');
      localStorage.setItem('access_token', response.access_token);

      if (response.user) {
        console.log('👤 Preparando datos de usuario...');
        console.log('📦 Datos recibidos del servidor:', response.user);

        console.log('🔄 Llamando a UserStateService.setUsuarioActualDesdeServidor...');
        // ✅ Usar el nuevo método que maneja la conversión automáticamente
        this.userStateService.setUsuarioActualDesdeServidor(response.user);
        console.log('✅ Usuario establecido en UserStateService desde servidor');
      } else {
        console.warn('⚠️ No hay datos de usuario en la respuesta');
      }

      this.showSuccess('¡Bienvenido! Iniciando sesión...');
      this.resetForm();

      // 🔒 NAVEGACIÓN SEGURA Y LIMPIA
      console.log('🔀 Iniciando navegación en 1.5 segundos...');
      setTimeout(() => {
        this.navigateSecurely();
      }, 1500);

    } catch (error) {
      console.error('❌ Error al guardar datos de autenticación:', error);
      this.showError('Error interno. Intenta nuevamente.');
    }
  }

  // 🔒 MÉTODO DE NAVEGACIÓN SEGURA
  private navigateSecurely(): void {
    try {
      // Limpiar la URL actual sin password en el historial
      window.history.replaceState({}, '', '/login');

      // Navegar de forma segura sin datos sensibles
      this.router.navigate(['/opciones'], {
        replaceUrl: true,
        skipLocationChange: false
      });
    } catch (error) {
      console.error('Error en navegación segura:', error);
      // Fallback: navegación simple
      this.router.navigate(['/opciones']);
    }
  }

  // ✅ MANEJO DE ERRORES
  private handleLoginError(error: unknown): void {
    console.error('Error de login:', error);

    let errorMessage = 'Error de conexión. Intenta nuevamente.';

    if (typeof error === 'object' && error !== null && 'status' in error) {
      const err = error as { status?: number; error?: { message?: string } };
      switch (err.status) {
        case 401:
          errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
          break;
        case 403:
          errorMessage = 'Acceso denegado. Tu cuenta puede estar inactiva.';
          break;
        case 404:
          errorMessage = 'Servicio no disponible. Contacta al administrador.';
          break;
        case 422:
          errorMessage = 'Datos inválidos. Verifica la información ingresada.';
          break;
        case 429:
          errorMessage = 'Demasiados intentos. Espera unos minutos.';
          break;
        case 500:
          errorMessage = 'Error del servidor. Intenta más tarde.';
          break;
        case 0:
          errorMessage = 'Sin conexión a internet. Verifica tu conexión.';
          break;
        default:
          if (err.error?.message) {
            errorMessage = err.error.message;
          }
      }
    }

    this.loginError = errorMessage;
    this.showError(errorMessage);
  }

  // ========================================================================
  // ✅ MÉTODOS SEGUROS REQUERIDOS POR EL HTML
  // ========================================================================

  // ✅ VALIDACIÓN EN TIEMPO REAL
  onFieldChange(fieldName: string): void {
    if (!this.formInitialized || !this.loginForm) {
      return;
    }

    try {
      const field = this.loginForm.get(fieldName);
      if (field && this.loginError) {
        this.clearError();
      }
    } catch (error) {
      console.error(`Error en onFieldChange para ${fieldName}:`, error);
    }
  }

  // ✅ NUEVO: MANEJO DE BLUR
  onFieldBlur(fieldName: string): void {
    if (!this.formInitialized || !this.loginForm) {
      return;
    }

    try {
      const field = this.loginForm.get(fieldName);
      if (field) {
        field.markAsTouched();
      }
    } catch (error) {
      console.error(`Error en onFieldBlur para ${fieldName}:`, error);
    }
  }

  // ✅ VERIFICAR SI UN CAMPO TIENE ERROR (SEGURO)
  hasFieldError(fieldName: string): boolean {
    if (!this.formInitialized || !this.loginForm) {
      return false;
    }

    try {
      const field = this.loginForm.get(fieldName);
      return !!(field && field.errors && (field.dirty || field.touched || this.submitted));
    } catch (error) {
      console.error(`Error en hasFieldError para ${fieldName}:`, error);
      return false;
    }
  }

  // ✅ VERIFICAR SI UN CAMPO ES VÁLIDO (SEGURO)
  isFieldValid(fieldName: string): boolean {
    if (!this.formInitialized || !this.loginForm) {
      return false;
    }

    try {
      const field = this.loginForm.get(fieldName);
      return !!(field && field.valid && (field.dirty || field.touched));
    } catch (error) {
      console.error(`Error en isFieldValid para ${fieldName}:`, error);
      return false;
    }
  }

  // ✅ VERIFICAR SI UN CAMPO FUE TOCADO (NUEVO)
  isFieldTouched(fieldName: string): boolean {
    if (!this.formInitialized || !this.loginForm) {
      return false;
    }

    try {
      const field = this.loginForm.get(fieldName);
      return !!(field && field.touched);
    } catch (error) {
      console.error(`Error en isFieldTouched para ${fieldName}:`, error);
      return false;
    }
  }

  // ✅ OBTENER MENSAJE DE ERROR (SEGURO)
  getFieldError(fieldName: string): string | null {
    if (!this.formInitialized || !this.loginForm) {
      return null;
    }

    try {
      const field = this.loginForm.get(fieldName);

      if (!field || !field.errors || (!field.touched && !this.submitted)) {
        return null;
      }

      const fieldMessages = this.validationMessages[fieldName as keyof typeof this.validationMessages];

      if (field.errors['required']) {
        return fieldMessages?.required || 'Este campo es requerido';
      }

      if (field.errors['email']) {
        return (fieldMessages && 'email' in fieldMessages) ? fieldMessages.email : 'Email inválido';
      }

      if (field.errors['pattern']) {
        return fieldMessages?.pattern || 'Formato inválido';
      }

      if (field.errors['minlength']) {
        return (typeof fieldMessages === 'object' && 'minlength' in fieldMessages)
          ? (fieldMessages as { minlength: string }).minlength
          : 'Muy corto';
      }

      if (field.errors['invalidFormat']) {
        return (typeof fieldMessages === 'object' && 'invalidFormat' in fieldMessages)
          ? (fieldMessages as { invalidFormat: string }).invalidFormat
          : 'Formato inválido';
      }

      return 'Campo inválido';

    } catch (error) {
      console.error(`Error en getFieldError para ${fieldName}:`, error);
      return 'Error de validación';
    }
  }

  // ✅ LIMPIAR ERRORES
  clearError(): void {
    this.loginError = null;
  }

  // ✅ TOGGLE MOSTRAR/OCULTAR CONTRASEÑA
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ✅ NAVEGACIÓN A RECUPERAR CONTRASEÑA
  goToForgotPassword(): void {
    if (this.loading) return;

    console.log('🔄 Navegando a recuperar contraseña...');
    this.router.navigate(['/login-recupera']);
  }

  // ✅ NAVEGACIÓN A REGISTRO
  goToRegister(): void {
    if (this.loading) return;

    console.log('🔄 Navegando a registro...');
    this.router.navigate(['/login-registro']);
  }

  // ========================================================================
  // ✅ GETTERS SEGUROS PARA EL HTML
  // ========================================================================

  // ✅ VERIFICAR SI EL FORMULARIO ES VÁLIDO
  get isFormValid(): boolean {
    if (!this.formInitialized || !this.loginForm) {
      return false;
    }

    try {
      return this.loginForm.valid;
    } catch (error) {
      console.error('Error en isFormValid:', error);
      return false;
    }
  }

  // ✅ VERIFICAR SI EL FORMULARIO ES INVÁLIDO
  get isFormInvalid(): boolean {
    if (!this.formInitialized || !this.loginForm) {
      return false;
    }

    try {
      return this.loginForm.invalid && this.submitted;
    } catch (error) {
      console.error('Error en isFormInvalid:', error);
      return false;
    }
  }

  // ✅ ACCESO SEGURO A CAMPOS
  get correoField() {
    if (!this.formInitialized || !this.loginForm) {
      return null;
    }
    return this.loginForm.get('correo');
  }

  get passwordField() {
    if (!this.formInitialized || !this.loginForm) {
      return null;
    }
    return this.loginForm.get('password');
  }

  // ========================================================================
  // ✅ MÉTODOS AUXILIARES
  // ========================================================================

  // ✅ RESET FORMULARIO
  resetForm(): void {
    if (!this.formInitialized || !this.loginForm) {
      return;
    }

    try {
      this.loginForm.reset();
      this.submitted = false;
      this.loginError = null;
      this.showPassword = false;
    } catch (error) {
      console.error('Error en resetForm:', error);
    }
  }

  // ✅ LIMPIAR DATOS DE AUTENTICACIÓN
  private clearAuthData(): void {
    try {
      // ✅ Usar UserStateService para limpiar datos
      this.userStateService.limpiarUsuario();
      console.log('✅ Datos de autenticación limpiados usando UserStateService');
    } catch (error) {
      console.error('Error al limpiar datos de autenticación:', error);
    }
  }

  // ✅ OBTENER NOMBRE DEL ROL
  getRoleName(id_perfil: number): string {
    try {
      const perfil = this.perfiles.find(p => p.value === id_perfil);
      return perfil ? perfil.label : 'Sin definir';
    } catch (error) {
      console.error('Error en getRoleName:', error);
      return 'Sin definir';
    }
  }

  // ✅ MARCAR TODOS LOS CAMPOS COMO TOCADOS
  private markFormGroupTouched(): void {
    if (!this.formInitialized || !this.loginForm) {
      return;
    }

    try {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    } catch (error) {
      console.error('Error en markFormGroupTouched:', error);
    }
  }

  // ✅ MOSTRAR ERROR DE VALIDACIÓN
  private showValidationError(): void {
    if (!this.formInitialized || !this.loginForm) {
      return;
    }

    try {
      const firstErrorField = Object.keys(this.loginForm.controls)
        .find(key => this.loginForm.get(key)?.errors);

      if (firstErrorField) {
        const errorMessage = this.getFieldError(firstErrorField);
        if (errorMessage) {
          this.showError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error en showValidationError:', error);
    }
  }

  // ✅ MENSAJES CON SWEETALERT2
  private showSuccess(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      timerProgressBar: true,
      background: '#f0f9ff',
      iconColor: '#059669'
    });
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error de Autenticación',
      text: message,
      icon: 'error',
      confirmButtonText: 'Intentar nuevamente',
      confirmButtonColor: '#dc2626',
      background: '#fef2f2',
      iconColor: '#dc2626',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      }
    });
  }

  // ✅ MÉTODO PARA DEBUGGING
  logFormStatus(): void {
    if (!this.formInitialized || !this.loginForm) {
      console.log('Formulario no inicializado');
      return;
    }

    try {
      console.log('Login Form Status:', {
        valid: this.loginForm.valid,
        values: this.loginForm.value,
        errors: this.getFormErrors(),
        submitted: this.submitted,
        loading: this.loading,
        formInitialized: this.formInitialized
      });
    } catch (error) {
      console.error('Error en logFormStatus:', error);
    }
  }

  private getFormErrors(): Record<string, unknown> {
    if (!this.formInitialized || !this.loginForm) {
      return {};
    }

    try {
      const formErrors: Record<string, unknown> = {};

      Object.keys(this.loginForm.controls).forEach(key => {
        const controlErrors = this.loginForm.get(key)?.errors;
        if (controlErrors) {
          formErrors[key] = controlErrors;
        }
      });

      return formErrors;
    } catch (error) {
      console.error('Error en getFormErrors:', error);
      return {};
    }
  }

  // ✅ MOSTRAR POLÍTICA DE PRIVACIDAD
  showPrivacyPolicy(event: Event): void {
    event.preventDefault();
    //alert('Política de Privacidad - Funcionalidad implementada');
  }

  // ✅ MOSTRAR TÉRMINOS DE USO
  showTerms(event: Event): void {
    event.preventDefault();
    //alert('Términos de Uso - Funcionalidad implementada');
  }

  // ========================================================================
  // ✅ MÉTODO ADICIONAL PARA GETFORMPROGRESS (SI NO EXISTE)
  // ========================================================================

  // ✅ CALCULAR PROGRESO DEL FORMULARIO (para la barra de progreso)
  getFormProgress(): number {
    if (!this.formInitialized || !this.loginForm) {
      return 0;
    }

    try {
      const totalFields = Object.keys(this.loginForm.controls).length;
      const validFields = Object.keys(this.loginForm.controls)
        .filter(key => this.loginForm.get(key)?.valid).length;

      return Math.round((validFields / totalFields) * 100);
    } catch (error) {
      console.error('Error en getFormProgress:', error);
      return 0;
    }
  }

  // ==========================================
  // 🧪 MÉTODOS DE PRUEBA COMPLETA (TEMPORALES)
  // ==========================================

  /**
   * 🧪 Prueba completa del flujo de login
   * Este método simula todo el proceso de login y verifica que funcione correctamente
   */
  async pruebaCompletaLogin(): Promise<void> {
    console.log('\n🧪 ===== INICIANDO PRUEBA COMPLETA DE LOGIN =====\n');

    try {
      // 1. Limpiar datos previos
      console.log('🧹 PASO 1: Limpiando datos previos...');
      this.userStateService.limpiarUsuario();

      const estadoLimpio = {
        token: localStorage.getItem('access_token'),
        userData: localStorage.getItem('user_data'),
        usuario: this.userStateService.getUsuarioActual()
      };

      console.log('📊 Estado después de limpiar:', estadoLimpio);

      // 2. Configurar credenciales de prueba
      console.log('\n📝 PASO 2: Configurando credenciales de prueba...');
      const credencialesPrueba = {
        correo: 'jorge.diaz.t@gmail.com',
        password: 'Admin1109@2025'
      };

      console.log('📧 Email de prueba:', credencialesPrueba.correo);
      console.log('🔑 Password configurado');

      // 3. Llenar formulario
      console.log('\n📋 PASO 3: Llenando formulario...');
      this.loginForm.patchValue({
        correo: credencialesPrueba.correo,
        password: credencialesPrueba.password
      });

      console.log('✅ Formulario llenado');
      console.log('📊 Estado del formulario:', {
        valido: this.loginForm.valid,
        correo: this.loginForm.get('correo')?.value,
        passwordLleno: !!this.loginForm.get('password')?.value
      });

      // 4. Simular login
      console.log('\n🚀 PASO 4: Ejecutando login...');

      await new Promise<void>((resolve, reject) => {
        this.authService.login(credencialesPrueba.correo, credencialesPrueba.password)
          .subscribe({
            next: (response) => {
              console.log('\n✅ RESPUESTA DEL SERVIDOR RECIBIDA:');
              console.log('📦 Estructura completa:', response);

              if (response && response.access_token) {
                console.log('🎉 LOGIN EXITOSO');
                console.log('🔑 Token recibido:', !!response.access_token);
                console.log('👤 Usuario recibido:', !!response.user);

                if (response.user) {
                  console.log('📋 Datos del usuario del servidor:', {
                    id: response.user.id_usuario,
                    username: response.user.username,
                    nombre: response.user.nombre,
                    apellido: response.user.apellido,
                    correo: response.user.correo,
                    id_perfil: response.user.id_perfil,
                    id_colegio: response.user.id_colegio,
                    estado: response.user.estado
                  });
                }

                // 5. Verificar guardado
                console.log('\n🔍 PASO 5: Verificando guardado de datos...');

                setTimeout(() => {
                  const estadoDespuesLogin = {
                    token: localStorage.getItem('access_token'),
                    userData: localStorage.getItem('user_data'),
                    usuario: this.userStateService.getUsuarioActual()
                  };

                  console.log('📊 Estado después del login:', estadoDespuesLogin);

                  console.log('\n📈 ANÁLISIS DE RESULTADOS:');
                  console.log('✅ Token guardado:', !!estadoDespuesLogin.token);
                  console.log('✅ User data guardado:', !!estadoDespuesLogin.userData);
                  console.log('✅ Usuario en servicio:', !!estadoDespuesLogin.usuario);

                  if (estadoDespuesLogin.usuario) {
                    console.log('👤 Datos del usuario en servicio:', {
                      nombre: estadoDespuesLogin.usuario.nombre,
                      correo: estadoDespuesLogin.usuario.correo,
                      rol: estadoDespuesLogin.usuario.id_perfil
                    });
                  }

                  console.log('\n🎉 ===== PRUEBA COMPLETA FINALIZADA =====\n');
                  alert('🎉 Prueba completa finalizada. Revisa la consola para ver los resultados detallados.');

                  resolve();
                }, 1000);

              } else {
                console.error('❌ Respuesta inválida del servidor');
                reject(new Error('Respuesta inválida'));
              }
            },
            error: (error) => {
              console.error('\n❌ ERROR EN LOGIN:');
              console.error('📋 Detalles del error:', error);
              console.error('🔍 Mensaje:', error.message || 'Error desconocido');
              console.error('📊 Status:', error.status || 'Sin status');

              alert(`❌ Error en login: ${error.message || 'Error desconocido'}`);
              reject(error);
            }
          });
      });

    } catch (error) {
      console.error('\n💥 ERROR EN PRUEBA COMPLETA:');
      console.error(error);
      alert(`💥 Error en prueba: ${(error as Error).message}`);
    }
  }

  /**
   * 🧪 Botón de acceso rápido para la prueba
   */
  ejecutarPruebaCompleta(): void {
    console.log('🎬 Iniciando prueba completa desde botón...');
    this.pruebaCompletaLogin();
  }
}
