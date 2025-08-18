import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClasesDet {
  id_clasedet: number;
  id_clasecol: number;
  id_curso: number;
  id_estudiante: number;
  observaciones: string | null;
  estado: boolean;
}

export interface CreateClasesDetDto {
  id_clasecol: number;
  id_curso: number;
  id_estudiante: number;
  observaciones?: string | null;
  estado: boolean;
}

export interface UpdateClasesDetDto {
  id_clasecol?: number;
  id_curso?: number;
  id_estudiante?: number;
  observaciones?: string | null;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClasesDetService {
  private apiUrl = environment.apiBaseUrl + '/clases-det';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /clases-det - Listar todas las relaciones clases-det
  getClasesDet(): Observable<ClasesDet[]> {
    return this.http.get<ClasesDet[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /clases-det/:id - Obtener relación clases-det por ID
  getClasesDetById(id: number): Observable<ClasesDet> {
    return this.http.get<ClasesDet>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /clases-det - Crear nueva relación clases-det
  crearClasesDet(data: CreateClasesDetDto): Observable<ClasesDet> {
    return this.http.post<ClasesDet>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /clases-det/:id - Actualizar relación clases-det
  actualizarClasesDet(id: number, data: UpdateClasesDetDto): Observable<ClasesDet> {
    return this.http.put<ClasesDet>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /clases-det/:id - Eliminar relación clases-det
  eliminarClasesDet(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
