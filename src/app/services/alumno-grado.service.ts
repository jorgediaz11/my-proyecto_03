import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AlumnoGrado {
  id_alumno_grado: number;
  id_usuario: number;
  id_grado: number;
  anio_escolar: number;
  estado: boolean;
  id_periodo_academico: number;
}

export interface CreateAlumnoGradoDto {
  id_usuario: number;
  id_grado: number;
  anio_escolar: number;
  estado: boolean;
  id_periodo_academico: number;
}

export interface UpdateAlumnoGradoDto {
  id_usuario?: number;
  id_grado?: number;
  anio_escolar?: number;
  estado?: boolean;
  id_periodo_academico?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlumnoGradoService {
  private apiUrl = environment.apiBaseUrl + '/alumno-grado';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /alumno-grado - Listar todas las relaciones alumno-grado
  getAlumnosGrado(): Observable<AlumnoGrado[]> {
    return this.http.get<AlumnoGrado[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /alumno-grado/:id - Obtener relación alumno-grado por ID
  getAlumnoGradoById(id: number): Observable<AlumnoGrado> {
    return this.http.get<AlumnoGrado>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /alumno-grado - Crear nueva relación alumno-grado
  crearAlumnoGrado(data: CreateAlumnoGradoDto): Observable<AlumnoGrado> {
    return this.http.post<AlumnoGrado>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /alumno-grado/:id - Actualizar relación alumno-grado
  actualizarAlumnoGrado(id: number, data: UpdateAlumnoGradoDto): Observable<AlumnoGrado> {
    return this.http.put<AlumnoGrado>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /alumno-grado/:id - Eliminar relación alumno-grado
  eliminarAlumnoGrado(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
