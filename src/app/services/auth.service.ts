import { Injectable } from '@angular/core'; // Importar el decorador Injectable de Angular para definir un servicio
import { HttpClient } from '@angular/common/http';  // Importar HttpClient de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas

// Importar el módulo de enrutamiento
@Injectable({ providedIn: 'root' }) // Proveedor del servicio de autenticación en la raíz de la aplicación
export class AuthService {
  private apiUrl = 'https://localhost:3000/auth/signin'; // URL del endpoint de inicio de sesión

  constructor(private http: HttpClient) {}  // Constructor del servicio de autenticación
  // Método para iniciar sesión 002
  login(email: string, password: string): Observable<any> {// Método para iniciar sesión
    // Envía una solicitud POST al endpoint de inicio de sesión con el correo electrónico y la contraseña
    console.log('AuthService.login llamado con:', email, password); // <-- Línea de depuración
    // Si el endpoint es correcto, debería devolver un Observable con la respuesta del servidor
    return this.http.post(this.apiUrl, { email, password });  // Retorna un Observable con la respuesta del servidor

  }
}
