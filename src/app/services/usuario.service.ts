// usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  usuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  perfil: string;
  id?: number;
}

// estructura definida desde backend
type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
  username: string
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = environment.apiUrl
  private apiUrl = `${this.baseUrl}/users`; // Cambia esta URL según tu configuración de API
  // ¡Asegúrate de que esta URL sea correcta!

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
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
