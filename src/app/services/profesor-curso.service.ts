import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProfesorCurso {
  id_profesor_curso: number;
  id_usuario: number;
  id_curso: number;
  estado: boolean;
}

export interface CreateProfesorCursoDto {
  id_usuario: number;
  id_curso: number;
  estado: boolean;
}

export interface UpdateProfesorCursoDto {
  id_usuario?: number;
  id_curso?: number;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesorCursoService {
  private apiUrl = environment.apiBaseUrl + '/profesor-curso';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /profesor-curso - Listar todas las relaciones profesor-curso
  getProfesoresCurso(): Observable<ProfesorCurso[]> {
    return this.http.get<ProfesorCurso[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /profesor-curso/:id - Obtener relación profesor-curso por ID
  getProfesorCursoById(id: number): Observable<ProfesorCurso> {
    return this.http.get<ProfesorCurso>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /profesor-curso - Crear nueva relación profesor-curso
  crearProfesorCurso(data: CreateProfesorCursoDto): Observable<ProfesorCurso> {
    return this.http.post<ProfesorCurso>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /profesor-curso/:id - Actualizar relación profesor-curso
  actualizarProfesorCurso(id: number, data: UpdateProfesorCursoDto): Observable<ProfesorCurso> {
    return this.http.put<ProfesorCurso>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /profesor-curso/:id - Eliminar relación profesor-curso
  eliminarProfesorCurso(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
