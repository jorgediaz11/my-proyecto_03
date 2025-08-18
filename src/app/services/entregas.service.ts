import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Entrega {
  id_entrega: number;
  id_actividad: number;
  id_estudiante: number;
  id_clasecol: number;
  respuesta_texto: string | null;
  respuesta_archivo: string | null;
  puntaje_obtenido: string;
  fecha_entrega: string;
  estado: boolean;
}

export interface CreateEntregaDto {
  id_actividad: number;
  id_estudiante: number;
  id_clasecol: number;
  respuesta_texto?: string | null;
  respuesta_archivo?: string | null;
  puntaje_obtenido: string;
  fecha_entrega: string;
  estado: boolean;
}

export interface UpdateEntregaDto {
  id_actividad?: number;
  id_estudiante?: number;
  id_clasecol?: number;
  respuesta_texto?: string | null;
  respuesta_archivo?: string | null;
  puntaje_obtenido?: string;
  fecha_entrega?: string;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EntregasService {
  private apiUrl = environment.apiBaseUrl + '/entregas';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /entregas - Listar todas las entregas
  getEntregas(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /entregas/:id - Obtener entrega por ID
  getEntregaById(id: number): Observable<Entrega> {
    return this.http.get<Entrega>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /entregas - Crear nueva entrega
  crearEntrega(data: CreateEntregaDto): Observable<Entrega> {
    return this.http.post<Entrega>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /entregas/:id - Actualizar entrega
  actualizarEntrega(id: number, data: UpdateEntregaDto): Observable<Entrega> {
    return this.http.put<Entrega>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /entregas/:id - Eliminar entrega
  eliminarEntrega(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
