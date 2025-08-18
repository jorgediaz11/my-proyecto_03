import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EvaluacionCuestionario {
  id_evaluacion: number;
  id_cuestionario: number;
  id_estudiante: number;
  id_clasecol: number;
  puntaje_total: string;
  completado: boolean;
  fecha_completado: string;
}

export interface CreateEvaluacionCuestionarioDto {
  id_cuestionario: number;
  id_estudiante: number;
  id_clasecol: number;
  puntaje_total: string;
  completado: boolean;
  fecha_completado: string;
}

export interface UpdateEvaluacionCuestionarioDto {
  id_cuestionario?: number;
  id_estudiante?: number;
  id_clasecol?: number;
  puntaje_total?: string;
  completado?: boolean;
  fecha_completado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionCuestionarioService {
  private apiUrl = environment.apiBaseUrl + '/evaluacion-cuestionario';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /evaluacion-cuestionario - Listar todas las evaluaciones de cuestionario
  getEvaluacionesCuestionario(): Observable<EvaluacionCuestionario[]> {
    return this.http.get<EvaluacionCuestionario[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /evaluacion-cuestionario/:id - Obtener evaluación de cuestionario por ID
  getEvaluacionCuestionarioById(id: number): Observable<EvaluacionCuestionario> {
    return this.http.get<EvaluacionCuestionario>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /evaluacion-cuestionario - Crear nueva evaluación de cuestionario
  crearEvaluacionCuestionario(data: CreateEvaluacionCuestionarioDto): Observable<EvaluacionCuestionario> {
    return this.http.post<EvaluacionCuestionario>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /evaluacion-cuestionario/:id - Actualizar evaluación de cuestionario
  actualizarEvaluacionCuestionario(id: number, data: UpdateEvaluacionCuestionarioDto): Observable<EvaluacionCuestionario> {
    return this.http.put<EvaluacionCuestionario>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /evaluacion-cuestionario/:id - Eliminar evaluación de cuestionario
  eliminarEvaluacionCuestionario(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
