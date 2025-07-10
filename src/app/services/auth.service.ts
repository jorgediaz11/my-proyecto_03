import { Injectable, inject } from '@angular/core'; // ✅ AGREGADO: inject para nueva sintaxis
import { HttpClient } from '@angular/common/http';  // Importar HttpClient de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas
import { tap, catchError } from 'rxjs/operators'; // ✅ AGREGADO: Operadores RxJS para debugging

// ✅ ACTUALIZADO: Interface para la respuesta real del servidor
export interface LoginResponse {
  access_token: string;
  user?: {
    id_usuario: number;
    username: string;
    nombre: string;
    apellido: string;
    email: string;        // ← Servidor usa 'email'
    idRol: number;        // ← Servidor usa 'idRol'
    idColegio: number;    // ← Servidor usa 'idColegio'
    estado: boolean;      // ← Servidor usa boolean
  };
  message?: string;
}

// ✅ AGREGADO: Interface para login estándar
export interface LoginRequest {
  username: string;  // Campo principal de autenticación
  password: string;  // Campo de contraseña
}

// ✅ AGREGADO: Interface para registro de usuario
interface RegisterRequest {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

// ✅ AGREGADO: Interface para respuesta de registro
interface RegisterResponse {
  user: {
    id: number;
    username: string;
    nombres: string;
    apellidos: string;
    email: string;
    idrol: number;
    idcolegio: number;
    estado: boolean;
  };
  message: string;
}

// ✅ AGREGADO: Interface para verificación de usuario existente
interface UserExistsResponse {
  exists: boolean;
  field: 'username' | 'email';
  message: string;
}

// ✅ AGREGADO: Interfaces para recuperación de contraseña
interface ForgotPasswordResponse {
  message: string;
  resetToken?: string; // Solo en desarrollo
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

// Importar el módulo de enrutamiento
@Injectable({ providedIn: 'root' }) // Proveedor del servicio de autenticación en la raíz de la aplicación
export class AuthService {
  private apiUrl = 'http://192.168.1.78:3000/auth'; // ✅ CORREGIDO: URL base para auth - IP de red local

  // ✅ NUEVO: Usando inject() en lugar de constructor injection
  private http = inject(HttpClient);
  // ✅ MÉTODO DE LOGIN ESTANDARIZADO
  login(username: string, password: string): Observable<LoginResponse> {
    // Envía una solicitud POST al endpoint de inicio de sesión con username y password (estándar)
    console.log('🔐 AuthService.login llamado');
    console.log('📧 Username:', username);
    console.log('🔗 URL completa:', `${this.apiUrl}/login`);
    console.log('📤 Payload:', { username, password: '***' });

    // ✅ ESTÁNDAR: usar 'username' como campo principal de autenticación
    const request$ = this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password });

    // ✅ INTERCEPTAR LA RESPUESTA PARA DEBUGGING
    return request$.pipe(
      tap((response: LoginResponse) => {
        console.log('✅ AuthService - Respuesta recibida del servidor:');
        console.log('📦 Response completa:', response);
        console.log('🔑 Token presente:', !!response?.access_token);
        console.log('👤 Usuario presente:', !!response?.user);

        if (response?.user) {
          console.log('👤 Estructura del usuario:', Object.keys(response.user));
          console.log('📋 Datos del usuario:', response.user);
        }
      }),
      catchError((error: unknown) => {
        console.error('❌ AuthService - Error en login:', error);
        throw error;
      })
    );
  }

  // ✅ MÉTODO DE COMPATIBILIDAD (DEPRECATED - usar login() en su lugar)
  loginWithEmail(correo: string, password: string): Observable<LoginResponse> {
    console.warn('⚠️ loginWithEmail() está deprecado. Usar login(username, password) en su lugar.');
    return this.login(correo, password); // Redirige al método estándar
  }

  // ✅ NUEVO: MÉTODO DE REGISTRO
  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    console.log('AuthService.register llamado con:', registerData);
    return this.http.post<RegisterResponse>(`${this.apiUrl}/signup`, {
      username: registerData.username,
      nombre: registerData.nombres,
      apellido: registerData.apellidos,
      email: registerData.email,
      password: registerData.password,
      idRol: 4, // Por defecto: Estudiante
      idColegio: 1, // Por defecto
      estado: true
    });
  }

  // ✅ NUEVO: VERIFICAR SI USUARIO EXISTE
  checkUserExists(username: string, email: string): Observable<UserExistsResponse> {
    console.log('AuthService.checkUserExists llamado con:', username, email);
    return this.http.post<UserExistsResponse>(`${this.apiUrl}/check-user`, {
      username,
      email
    });
  }

  // ✅ NUEVO: SOLICITAR RECUPERACIÓN DE CONTRASEÑA
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    console.log('AuthService.forgotPassword llamado con:', email);
    return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/forgot-password`, {
      email
    });
  }

  // ✅ NUEVO: VERIFICAR TOKEN DE RECUPERACIÓN
  verifyResetToken(token: string): Observable<{ valid: boolean; message: string }> {
    console.log('AuthService.verifyResetToken llamado con:', token);
    return this.http.post<{ valid: boolean; message: string }>(`${this.apiUrl}/verify-reset-token`, {
      token
    });
  }

  // ✅ NUEVO: RESTABLECER CONTRASEÑA
  resetPassword(token: string, password: string): Observable<ResetPasswordResponse> {
    console.log('AuthService.resetPassword llamado con token:', token);
    return this.http.post<ResetPasswordResponse>(`${this.apiUrl}/reset-password`, {
      token,
      password
    });
  }
}
