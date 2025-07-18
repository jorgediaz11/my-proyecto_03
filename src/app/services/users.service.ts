import { Injectable, inject } from '@angular/core'; // Importar el decorador Injectable de Angular para definir un servicio
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Importar HttpClient y HttpHeaders de Angular para realizar solicitudes HTTP
import { Observable } from 'rxjs';  // Importar Observable de RxJS para manejar respuestas asíncronas
import { environment } from '../../environments/environment'; // Importar el entorno de configuración

// Interfaces para tipado
export interface Users {
  id?: number;
  id_colegio : number;
  id_perfil: number;
  nombre: string;
  apellido: string;
  correo: string;
  estado: boolean;
  username: string;
  password?: string;
}
export interface CreateUserDto {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  correo: string;
  id_perfil: number;
  id_colegio: number;
  estado: boolean;
}
export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  correo?: string;
  id_perfil?: number;
  id_colegio?: number;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'  // Proveedor del servicio de usuario en la raíz de la aplicación
})
export class UsersService {

  private apiUrl = environment.apiBaseUrl + '/users';
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
    })

  }

  // GET /users/:id - Obtener usuario por ID
  getUserById(id: number): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  // getUsuarioPorId(id: number): Observable<Users> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.get<Users>(url);
  // }

  // POST /users - Crear nuevo usuario
  crearUsuario(usuario: Users): Observable<Users> {
    //return this.http.post<Users>(this.apiUrl, usuario);
    return this.http.post<Users>(this.apiUrl, usuario, {  // revisar users --> usuario
      headers: this.getAuthHeaders()
    });

  }

  // PUT /users/:id - Actualizar usuario
  actualizarUsuario(id: number, usuario: Partial<Users>): Observable<Users> {
    return this.http.put<Users>(`${this.apiUrl}/${id}`, usuario, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /users/:id - Eliminar usuario
  eliminarUsuario(id: number): Observable<{ message: string }> {
    // const url = `${this.apiUrl}/${id}`;
    // return this.http.delete(url);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });

  }
}
