import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces alineadas al estándar de servicios
export interface ActividadOpcion {
  id_opcion: number;
  nombre_opcion: string;
  es_correcta?: boolean;
  par_relacion?: string;
}

export interface ActividadDetalle {
  id_actividad: number;
  nombre_actividad: string;
  descripcion?: string;
  tipo_actividad: string;
  puntaje_actividad: string;
  opciones: ActividadOpcion[];
}

export interface CreateActividadDetalleDto {
  nombre_actividad: string;
  descripcion?: string;
  tipo_actividad: string;
  puntaje_actividad: string;
  opciones?: ActividadOpcion[];
}

export interface UpdateActividadDetalleDto {
  nombre_actividad?: string;
  descripcion?: string;
  tipo_actividad?: string;
  puntaje_actividad?: string;
  opciones?: ActividadOpcion[];
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesDetalleService {
  private apiUrl = environment.apiBaseUrl + '/actividades-detalle';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );
  }

  // GET /actividades-detalle/detalle/:id_actividad - Obtener detalle de actividad por ID
  getDetalleActividad(id_actividad: number): Observable<ActividadDetalle> {
    return this.http.get<ActividadDetalle>(`${this.apiUrl}/detalle/${id_actividad}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /actividades-detalle - Crear nueva actividad
  crearActividadDetalle(actividadDetalle: CreateActividadDetalleDto): Observable<ActividadDetalle> {
    return this.http.post<ActividadDetalle>(this.apiUrl, actividadDetalle, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /actividades-detalle/:id - Actualizar actividad
  actualizarActividadDetalle(id_actividad: number, actividadDetalle: UpdateActividadDetalleDto): Observable<ActividadDetalle> {
    return this.http.put<ActividadDetalle>(`${this.apiUrl}/${id_actividad}`, actividadDetalle, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /actividades-detalle/:id - Eliminar actividad
  eliminarActividadDetalle(id_actividad: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_actividad}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /actividades-detalle/:id/estado - Cambiar estado de la actividad
  cambiarEstado(id_actividad: number, estado: boolean): Observable<ActividadDetalle> {
    return this.http.patch<ActividadDetalle>(`${this.apiUrl}/${id_actividad}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }
}