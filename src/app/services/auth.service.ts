import { Injectable, inject } from '@angular/core'; // ✅ AGREGADO: inject para nueva sintaxis
import { HttpClient } from '@angular/common/http';  // Importar HttpClient de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas

// ✅ AGREGADO: Interface para tipado fuerte del response
interface LoginResponse {
  access_token: string;
  user?: {
    id_usuario: number;
    username: string;
    nombre: string;
    apellido: string;
    correo: string;
    idrol: number;
    idcolegio: number;
    estado: string;
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

// Importar el módulo de enrutamiento
@Injectable({ providedIn: 'root' }) // Proveedor del servicio de autenticación en la raíz de la aplicación
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // ✅ CORREGIDO: URL base para auth

  // ✅ NUEVO: Usando inject() en lugar de constructor injection
  private http = inject(HttpClient);

  // ✅ MÉTODO DE LOGIN ESTANDARIZADO
  login(username: string, password: string): Observable<LoginResponse> {
    // Envía una solicitud POST al endpoint de inicio de sesión con username y password (estándar)
    console.log('AuthService.login llamado con username:', username); 
    // ✅ ESTÁNDAR: usar 'username' como campo principal de autenticación
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password });
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
}
