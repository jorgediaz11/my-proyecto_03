import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces para tipado de Preguntas
export interface Pregunta {
  id_pregunta: number;
  id_cuestionario: number;
  tipo_pregunta: string;
  enunciado: string;
  puntaje: string;
  orden: number;
  estado: boolean;
}

export interface CreatePreguntaDto {
  texto: string;
  tipo: string;
  descripcion?: string;
  estado: boolean;
  id_leccion?: number;
}

export interface UpdatePreguntaDto {
  texto?: string;
  tipo?: string;
  descripcion?: string;
  estado?: boolean;
  id_leccion?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  private apiUrl = environment.apiBaseUrl + '/preguntas';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /preguntas - Listar todas las preguntas
  getPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /preguntas/:id - Obtener pregunta por ID
  getPreguntaById(id: number): Observable<Pregunta> {
    return this.http.get<Pregunta>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /preguntas/activas - Obtener solo preguntas activas
  getPreguntasActivas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.apiUrl}/activas`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /preguntas/leccion/:id_leccion - Obtener preguntas por lección
  getPreguntasPorLeccion(id_leccion: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.apiUrl}/leccion/${id_leccion}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /preguntas - Crear nueva pregunta
  crearPregunta(pregunta: CreatePreguntaDto): Observable<Pregunta> {
    return this.http.post<Pregunta>(this.apiUrl, pregunta, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /preguntas/:id - Actualizar pregunta
  actualizarPregunta(id: number, pregunta: UpdatePreguntaDto): Observable<Pregunta> {
    return this.http.put<Pregunta>(`${this.apiUrl}/${id}`, pregunta, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /preguntas/:id - Eliminar pregunta
  eliminarPregunta(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /preguntas/:id/estado - Cambiar estado de la pregunta
  cambiarEstado(id: number, estado: boolean): Observable<Pregunta> {
    return this.http.patch<Pregunta>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }
}
