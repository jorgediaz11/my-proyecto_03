
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EvaluacionActividad {
  id_evaluacion: number;
  id_actividad: number;
  id_estudiante: number;
  id_clasecol: number;
  puntaje_total: string;
  completado: boolean;
  fecha_completado: string;
}

export interface CreateEvaluacionActividadDto {
  id_actividad: number;
  id_estudiante: number;
  id_clasecol: number;
  puntaje_total: string;
  completado: boolean;
  fecha_completado: string;
}

export interface UpdateEvaluacionActividadDto {
  id_actividad?: number;
  id_estudiante?: number;
  id_clasecol?: number;
  puntaje_total?: string;
  completado?: boolean;
  fecha_completado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionActividadService {
  private apiUrl = environment.apiBaseUrl + '/evaluacion-actividad';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /evaluacion-actividad - Listar todas las evaluaciones de actividad
  getEvaluacionesActividad(): Observable<EvaluacionActividad[]> {
    return this.http.get<EvaluacionActividad[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /evaluacion-actividad/:id - Obtener evaluación de actividad por ID
  getEvaluacionActividadById(id: number): Observable<EvaluacionActividad> {
    return this.http.get<EvaluacionActividad>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /evaluacion-actividad - Crear nueva evaluación de actividad
  crearEvaluacionActividad(data: CreateEvaluacionActividadDto): Observable<EvaluacionActividad> {
    return this.http.post<EvaluacionActividad>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /evaluacion-actividad/:id - Actualizar evaluación de actividad
  actualizarEvaluacionActividad(id: number, data: UpdateEvaluacionActividadDto): Observable<EvaluacionActividad> {
    return this.http.put<EvaluacionActividad>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /evaluacion-actividad/:id - Eliminar evaluación de actividad
  eliminarEvaluacionActividad(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
