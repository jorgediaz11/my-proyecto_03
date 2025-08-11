import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces para tipado de Áreas
export interface Area {
  id_area?: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  id_grado?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateAreaDto {
  nombre: string;
  descripcion?: string;
  estado: boolean;
  id_grado?: number;
}

export interface UpdateAreaDto {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
  id_grado?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private apiUrl = environment.apiBaseUrl + '/area';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /areas - Listar todas las áreas
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /areas/:id - Obtener área por ID
  getAreaById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /areas/activas - Obtener solo áreas activas
  getAreasActivas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.apiUrl}/activas`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /areas/grado/:id_grado - Obtener áreas por grado
  getAreasPorGrado(id_grado: number): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.apiUrl}/grado/${id_grado}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /areas - Crear nueva área
  crearArea(area: CreateAreaDto): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, area, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /areas/:id - Actualizar área
  actualizarArea(id: number, area: UpdateAreaDto): Observable<Area> {
    return this.http.put<Area>(`${this.apiUrl}/${id}`, area, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /areas/:id - Eliminar área
  eliminarArea(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /areas/:id/estado - Cambiar estado del área
  cambiarEstado(id: number, estado: boolean): Observable<Area> {
    return this.http.patch<Area>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }
}
