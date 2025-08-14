import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces para tipado de Lecciones
export interface Leccion {
  id?: number;
  id_leccion?: number;
  titulo: string;
  contenido: string;
  descripcion?: string;
  orden?: number;
  estado: boolean;
  id_unidad?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateLeccionDto {
  titulo: string;
  contenido: string;
  descripcion?: string;
  orden?: number;
  estado: boolean;
  id_unidad?: number;
}

export interface UpdateLeccionDto {
  titulo?: string;
  contenido?: string;
  descripcion?: string;
  orden?: number;
  estado?: boolean;
  id_unidad?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeccionesService {
  private apiUrl = environment.apiBaseUrl + '/leccion';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /lecciones - Listar todas las lecciones
  getLecciones(): Observable<Leccion[]> {
    return this.http.get<Leccion[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /lecciones/:id - Obtener lección por ID
  getLeccionById(id: number): Observable<Leccion> {
    return this.http.get<Leccion>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /lecciones/activos - Obtener solo lecciones activas
  getLeccionesActivas(): Observable<Leccion[]> {
    return this.http.get<Leccion[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /lecciones/unidad/:id_unidad - Obtener lecciones por unidad
  getLeccionesPorUnidad(id_unidad: number): Observable<Leccion[]> {
    return this.http.get<Leccion[]>(`${this.apiUrl}/unidad/${id_unidad}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /lecciones - Crear nueva lección
  crearLeccion(leccion: CreateLeccionDto): Observable<Leccion> {
    return this.http.post<Leccion>(this.apiUrl, leccion, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /lecciones/:id - Actualizar lección
  actualizarLeccion(id: number, leccion: UpdateLeccionDto): Observable<Leccion> {
    return this.http.put<Leccion>(`${this.apiUrl}/${id}`, leccion, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /lecciones/:id - Eliminar lección
  eliminarLeccion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /lecciones/:id/estado - Cambiar estado de la lección
  cambiarEstado(id: number, estado: boolean): Observable<Leccion> {
    return this.http.patch<Leccion>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }
}
