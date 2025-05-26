import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Importar el módulo de enrutamiento
// @Injectable({
//   providedIn: 'root'  // Proveedor del servicio en la raíz de la aplicación
// })
// export class AuthService {  //  Servicio de autenticación
//   // Constructor del servicio de autenticación
//   login(username: string, password: string): boolean {
//     // Aquí puedes implementar la lógica de autenticación
//     if (username === 'admin' && password === '1122') {
//       return true;  // Credenciales válidas
//     }
//     return false;   // Credenciales inválidas
//   }
// }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://consolacentral.onrender.com/auth/signin';

  constructor(private http: HttpClient) {}  // Constructor del servicio de autenticación
  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {// Método para iniciar sesión
    // Envía una solicitud POST al endpoint de inicio de sesión con el correo electrónico y la contraseña
    console.log('AuthService.login llamado con:', email, password); // <-- Línea de depuración
    // Asegúrate de que el endpoint sea correcto y esté funcionando
    // Puedes usar un servicio de autenticación real aquí
    // Aquí puedes implementar la lógica de autenticación
    // Si el endpoint es correcto, debería devolver un Observable con la respuesta del servidor
    return this.http.post(this.apiUrl, { email, password });  // Retorna un Observable con la respuesta del servidor

  }
}
