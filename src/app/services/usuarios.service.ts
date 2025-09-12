import { Injectable, inject } from '@angular/core'; // Importar el decorador Injectable de Angular para definir un servicio
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Importar HttpClient y HttpHeaders de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas
import { environment } from '../../environments/environment'; // Importar el entorno de configuración

// Interfaces para tipado
export interface Users {
  id_usuario?: number;
  id_colegio : number;
  id_perfil: number;
  nombres: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string;
  correo: string;
  estado: boolean;
  username: string;
  password?: string;
}
export interface CreateUserDto {
  username: string;
  password: string;
  nombres: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string;
  correo: string;
  id_perfil: number;
  id_colegio: number;
  estado: boolean;
}
export interface UpdateUserDto {
  nombres?: string;
  apellido?: string;
  dni?: string;
  fecha_nacimiento?: string;
  correo?: string;
  id_perfil?: number;
  id_colegio?: number;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'  // Proveedor del servicio de usuario en la raíz de la aplicación
})
export class UsersService {

  private apiUrl = environment.apiBaseUrl + '/usuarios';
  // ¡Asegúrate de que esta URL sea correcta!

  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /users - Listar todos los usuarios
  getUsuarios(): Observable<Users[]> {
    return this.http.get<Users[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });

  }

  // GET /users/:id - Obtener usuario por ID
  getUserById(id_usuario: number): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${id_usuario}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUsuarioActual(): Observable<Users> {
    const id_usuario = Number(localStorage.getItem('id_usuario'));
    if (!id_usuario) {
      throw new Error('No se encontró el ID del usuario actual');
    }
    return this.getUserById(id_usuario);
  }
  // POST /users - Crear nuevo usuario
  crearUsuario(usuario: Users): Observable<Users> {
    //return this.http.post<Users>(this.apiUrl, usuario);
    return this.http.post<Users>(this.apiUrl, usuario, {  // revisar users --> usuario
      headers: this.getAuthHeaders()
    });

  }

  // PUT /users/:id - Actualizar usuario
  actualizarUsuario(id_usuario: number, usuario: Partial<Users>): Observable<Users> {
    return this.http.put<Users>(`${this.apiUrl}/${id_usuario}`, usuario, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /users/:id - Eliminar usuario
  eliminarUsuario(id_usuario: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_usuario}`, {
      headers: this.getAuthHeaders()
    });
  }
}
