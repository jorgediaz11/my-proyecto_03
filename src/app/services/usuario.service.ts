// usuario.service.ts 002
import { Injectable } from '@angular/core'; // Importar el decorador Injectable de Angular para definir un servicio
import { HttpClient } from '@angular/common/http';  // Importar HttpClient de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas

export interface Usuario {
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
export class UsuarioService {

  private apiUrl = 'http://tu-servidor.com/api/usuarios';
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
