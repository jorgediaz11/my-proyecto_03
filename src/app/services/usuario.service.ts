// usuario.service.ts 002
import { Injectable } from '@angular/core'; // Importar el decorador Injectable de Angular para definir un servicio
import { HttpClient } from '@angular/common/http';  // Importar HttpClient de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas

export interface Usuario {
  id?: number;
  idcolegio?: number;  // Campo opcional para el ID del colegio
  idrol?: number;  // Campo opcional para el ID del rol
  nombre: string;
  apellido: string;
  correo: string;
  estado: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'  // Proveedor del servicio de usuario en la raíz de la aplicación
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/users';
  // ¡Asegúrate de que esta URL sea correcta!

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Usuario>(url);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Usuario>(url, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
