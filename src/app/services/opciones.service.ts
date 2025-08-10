import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces para tipado de Opciones
export interface Opcion {
  id_opcion?: number;
  nombre: string;
  descripcion?: string;
  valor?: string;
  estado: boolean;
  id_pregunta?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateOpcionDto {
  nombre: string;
  descripcion?: string;
  valor?: string;
  estado: boolean;
  id_pregunta?: number;
}

export interface UpdateOpcionDto {
  nombre?: string;
  descripcion?: string;
  valor?: string;
  estado?: boolean;
  id_pregunta?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OpcionesService {
  private apiUrl = environment.apiBaseUrl + '/opciones';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /opciones - Listar todas las opciones
  getOpciones(): Observable<Opcion[]> {
    return this.http.get<Opcion[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /opciones/:id - Obtener opción por ID
  getOpcionById(id: number): Observable<Opcion> {
    return this.http.get<Opcion>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /opciones/activas - Obtener solo opciones activas
  getOpcionesActivas(): Observable<Opcion[]> {
    return this.http.get<Opcion[]>(`${this.apiUrl}/activas`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /opciones/pregunta/:id_pregunta - Obtener opciones por pregunta
  getOpcionesPorPregunta(id_pregunta: number): Observable<Opcion[]> {
    return this.http.get<Opcion[]>(`${this.apiUrl}/pregunta/${id_pregunta}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /opciones - Crear nueva opción
  crearOpcion(opcion: CreateOpcionDto): Observable<Opcion> {
    return this.http.post<Opcion>(this.apiUrl, opcion, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /opciones/:id - Actualizar opción
  actualizarOpcion(id: number, opcion: UpdateOpcionDto): Observable<Opcion> {
    return this.http.put<Opcion>(`${this.apiUrl}/${id}`, opcion, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /opciones/:id - Eliminar opción
  eliminarOpcion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /opciones/:id/estado - Cambiar estado de la opción
  cambiarEstado(id: number, estado: boolean): Observable<Opcion> {
    return this.http.patch<Opcion>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }
}
