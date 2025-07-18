import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// 📚 Interfaces para tipado de Niveles Educativos
export interface Nivel {
  id?: number;
  nombre: string; // Inicial, Primaria, Secundaria
  descripcion?: string;
  codigo?: string; // INIT, PRIM, SEC
  orden?: number; // orden de secuencia 1, 2, 3
  edadMinima?: number;
  edadMaxima?: number;
  estado: boolean;
  id_colegio?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateNivelDto {
  nombre: string;
  descripcion?: string;
  codigo?: string;
  orden?: number;
  edadMinima?: number;
  edadMaxima?: number;
  estado: boolean;
  id_colegio?: number;
}

export interface UpdateNivelDto {
  nombre?: string;
  descripcion?: string;
  codigo?: string;
  orden?: number;
  edadMinima?: number;
  edadMaxima?: number;
  estado?: boolean;
  id_colegio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NivelesService {

  private apiUrl = environment.apiBaseUrl + '/niveles';

  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /niveles - Listar todos los niveles
  getNiveles(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /niveles/:id - Obtener nivel por ID
  getNivelById(id: number): Observable<Nivel> {
    return this.http.get<Nivel>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /niveles/activos - Obtener solo niveles activos
  getNivelesActivos(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /niveles/colegio/:id_colegio - Obtener niveles por colegio
  getNivelesPorColegio(id_colegio: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(`${this.apiUrl}/colegio/${id_colegio}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /niveles - Crear nuevo nivel
  crearNivel(nivel: CreateNivelDto): Observable<Nivel> {
    return this.http.post<Nivel>(this.apiUrl, nivel, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /niveles/:id - Actualizar nivel
  actualizarNivel(id: number, nivel: UpdateNivelDto): Observable<Nivel> {
    return this.http.put<Nivel>(`${this.apiUrl}/${id}`, nivel, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /niveles/:id - Eliminar nivel
  eliminarNivel(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /niveles/:id/estado - Cambiar estado del nivel
  cambiarEstado(id: number, estado: boolean): Observable<Nivel> {
    return this.http.patch<Nivel>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /niveles/orden - Obtener niveles ordenados por secuencia
  getNivelesOrdenados(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(`${this.apiUrl}/orden`, {
      headers: this.getAuthHeaders()
    });
  }
}
