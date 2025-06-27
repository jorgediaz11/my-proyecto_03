import { Injectable } from '@angular/core'; // Importar el decorador Injectable de Angular para definir un servicio
import { HttpClient } from '@angular/common/http';  // Importar HttpClient de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas

export interface Users {
  usuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  perfil: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'  // Proveedor del servicio de usuario en la raíz de la aplicación
})
export class UsersService {

  private apiUrl = 'http://tu-servidor.com/api/usuarios';
  // ¡Asegúrate de que esta URL sea correcta!

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Users[]> {
    return this.http.get<Users[]>(this.apiUrl);
  }

  getUsuarioPorId(id: number): Observable<Users> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Users>(url);
  }

  crearUsuario(usuario: Users): Observable<Users> {
    return this.http.post<Users>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: number, usuario: Users): Observable<Users> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Users>(url, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
