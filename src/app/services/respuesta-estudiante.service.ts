import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RespuestaEstudiante {
  id_respuesta: number;
  id_pregunta: number;
  id_estudiante: number;
  id_cuestionario: number;
  respuesta_valor: string | null;
  id_opcion_seleccionada: number | null;
  respuesta_relacion: string | null;
  respuesta_texto: string | null;
  respuesta_archivo: string | null;
  puntaje_obtenido: string;
  fecha_respuesta: string;
  estado: boolean;
}

export interface CreateRespuestaEstudianteDto {
  id_pregunta: number;
  id_estudiante: number;
  id_cuestionario: number;
  respuesta_valor?: string | null;
  id_opcion_seleccionada?: number | null;
  respuesta_relacion?: string | null;
  respuesta_texto?: string | null;
  respuesta_archivo?: string | null;
  puntaje_obtenido: string;
  fecha_respuesta: string;
  estado: boolean;
}

export interface UpdateRespuestaEstudianteDto {
  id_pregunta?: number;
  id_estudiante?: number;
  id_cuestionario?: number;
  respuesta_valor?: string | null;
  id_opcion_seleccionada?: number | null;
  respuesta_relacion?: string | null;
  respuesta_texto?: string | null;
  respuesta_archivo?: string | null;
  puntaje_obtenido?: string;
  fecha_respuesta?: string;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RespuestaEstudianteService {
  private apiUrl = environment.apiBaseUrl + '/respuesta-estudiante';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /respuesta-estudiante - Listar todas las respuestas de estudiante
  getRespuestasEstudiante(): Observable<RespuestaEstudiante[]> {
    return this.http.get<RespuestaEstudiante[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /respuesta-estudiante/:id - Obtener respuesta de estudiante por ID
  getRespuestaEstudianteById(id: number): Observable<RespuestaEstudiante> {
    return this.http.get<RespuestaEstudiante>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /respuesta-estudiante - Crear nueva respuesta de estudiante
  crearRespuestaEstudiante(data: CreateRespuestaEstudianteDto): Observable<RespuestaEstudiante> {
    return this.http.post<RespuestaEstudiante>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /respuesta-estudiante/:id - Actualizar respuesta de estudiante
  actualizarRespuestaEstudiante(id: number, data: UpdateRespuestaEstudianteDto): Observable<RespuestaEstudiante> {
    return this.http.put<RespuestaEstudiante>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /respuesta-estudiante/:id - Eliminar respuesta de estudiante
  eliminarRespuestaEstudiante(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
