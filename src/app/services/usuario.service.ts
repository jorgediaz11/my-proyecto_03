// ⚠️ DEPRECADO: Este servicio está obsoleto
// Use users.service.ts en su lugar
// usuario.service.ts 002 - DEPRECATED
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * @deprecated Este servicio está obsoleto. Use UsersService en su lugar.
 * Este servicio se mantendrá por compatibilidad pero será removido en futuras versiones.
 */
export interface Usuario {
  id?: number;
  idcolegio?: number;
  idrol?: number;
  nombre: string;
  apellido: string;
  correo: string;
  estado: string;
  username: string;
  password: string;
}

/**
 * @deprecated Este servicio está obsoleto. Use UsersService en su lugar.
 * Redirige internamente a UsersService para mantener compatibilidad.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/users';

  private http = inject(HttpClient);

  constructor() {
    console.warn('⚠️ UsuarioService está DEPRECADO. Use UsersService en su lugar.');
  }

  /**
   * @deprecated Use UsersService.getUsuarios() en su lugar
   */
  getUsuarios(): Observable<Usuario[]> {
    console.warn('⚠️ UsuarioService.getUsuarios() está DEPRECADO. Use UsersService.getUsuarios() en su lugar.');
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * @deprecated Use UsersService.getUserById() en su lugar
   */
  getUsuarioPorId(id: number): Observable<Usuario> {
    console.warn('⚠️ UsuarioService.getUsuarioPorId() está DEPRECADO. Use UsersService.getUserById() en su lugar.');
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Usuario>(url);
  }

  /**
   * @deprecated Use UsersService.crearUsuario() en su lugar
   */
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    console.warn('⚠️ UsuarioService.crearUsuario() está DEPRECADO. Use UsersService.crearUsuario() en su lugar.');
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  /**
   * @deprecated Use UsersService.actualizarUsuario() en su lugar
   */
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    console.warn('⚠️ UsuarioService.actualizarUsuario() está DEPRECADO. Use UsersService.actualizarUsuario() en su lugar.');
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Usuario>(url, usuario);
  }

  /**
   * @deprecated Use UsersService.eliminarUsuario() en su lugar
   */
  eliminarUsuario(id: number): Observable<unknown> {
    console.warn('⚠️ UsuarioService.eliminarUsuario() está DEPRECADO. Use UsersService.eliminarUsuario() en su lugar.');
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
