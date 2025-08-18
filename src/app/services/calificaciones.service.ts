import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Calificacion {
  id_calificacion: number;
  id_alumno: number;
  id_curso: number;
  id_evaluador: number;
  id_material: number;
  id_leccion: number;
  id_unidad: number;
  puntuacion: number;
  fecha_evaluacion: string;
  comentario: string | null;
  estado: boolean;
}

export interface CreateCalificacionDto {
  id_alumno: number;
  id_curso: number;
  id_evaluador: number;
  id_material: number;
  id_leccion: number;
  id_unidad: number;
  puntuacion: number;
  fecha_evaluacion: string;
  comentario?: string | null;
  estado: boolean;
}

export interface UpdateCalificacionDto {
  id_alumno?: number;
  id_curso?: number;
  id_evaluador?: number;
  id_material?: number;
  id_leccion?: number;
  id_unidad?: number;
  puntuacion?: number;
  fecha_evaluacion?: string;
  comentario?: string | null;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {
  private apiUrl = environment.apiBaseUrl + '/calificaciones';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /calificaciones - Listar todas las calificaciones
  getCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /calificaciones/:id - Obtener calificación por ID
  getCalificacionById(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /calificaciones - Crear nueva calificación
  crearCalificacion(data: CreateCalificacionDto): Observable<Calificacion> {
    return this.http.post<Calificacion>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /calificaciones/:id - Actualizar calificación
  actualizarCalificacion(id: number, data: UpdateCalificacionDto): Observable<Calificacion> {
    return this.http.put<Calificacion>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /calificaciones/:id - Eliminar calificación
  eliminarCalificacion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
