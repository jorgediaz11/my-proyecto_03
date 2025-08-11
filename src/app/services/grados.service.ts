import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// 🎯 Interfaces para tipado de Grados
export interface Grado {
  id_grado?: number;
  nombre: string; // 1°, 2°, 3°, 4°, 5°, 6°
  descripcion?: string;
  nivel: {
    id_nivel: number;
    nombre: string;
    estado: boolean;
  };
  idNivel?: number;
  orden?: number; // orden dentro del nivel
  edadRecomendada?: number;
  estado: boolean;
  id_colegio?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateGradoDto {
  nombre: string;
  descripcion?: string;
  nivel: string;
  idNivel?: number;
  orden?: number;
  edadRecomendada?: number;
  estado: boolean;
  id_colegio?: number;
}

export interface UpdateGradoDto {
  nombre?: string;
  descripcion?: string;
  nivel?: string;
  idNivel?: number;
  orden?: number;
  edadRecomendada?: number;
  estado?: boolean;
  id_colegio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GradosService {

  private apiUrl = environment.apiBaseUrl + '/grado';

  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /grados - Listar todos los grados
  getGrados(): Observable<Grado[]> {
    return this.http.get<Grado[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /grados/:id - Obtener grado por ID
  getGradoById(id: number): Observable<Grado> {
    return this.http.get<Grado>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /grados/activos - Obtener solo grados activos
  getGradosActivos(): Observable<Grado[]> {
    return this.http.get<Grado[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /grados/nivel/:nivel - Obtener grados por nivel
  getGradosPorNivel(nivel: string): Observable<Grado[]> {
    return this.http.get<Grado[]>(`${this.apiUrl}/nivel/${nivel}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /grados/nivel-id/:idNivel - Obtener grados por ID de nivel
  getGradosPorIdNivel(idNivel: number): Observable<Grado[]> {
    return this.http.get<Grado[]>(`${this.apiUrl}/nivel-id/${idNivel}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /grados/colegio/:id_colegio - Obtener grados por colegio
  getGradosPorColegio(id_colegio: number): Observable<Grado[]> {
    return this.http.get<Grado[]>(`${this.apiUrl}/colegio/${id_colegio}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /grados - Crear nuevo grado
  crearGrado(grado: CreateGradoDto): Observable<Grado> {
    return this.http.post<Grado>(this.apiUrl, grado, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /grados/:id - Actualizar grado
  actualizarGrado(id: number, grado: UpdateGradoDto): Observable<Grado> {
    return this.http.put<Grado>(`${this.apiUrl}/${id}`, grado, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /grados/:id - Eliminar grado
  eliminarGrado(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /grados/:id/estado - Cambiar estado del grado
  cambiarEstado(id: number, estado: boolean): Observable<Grado> {
    return this.http.patch<Grado>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /grados/orden/:nivel - Obtener grados ordenados por nivel
  getGradosOrdenadosPorNivel(nivel: string): Observable<Grado[]> {
    return this.http.get<Grado[]>(`${this.apiUrl}/orden/${nivel}`, {
      headers: this.getAuthHeaders()
    });
  }
}
