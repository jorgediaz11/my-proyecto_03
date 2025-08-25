import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


// Interfaces alineadas con la respuesta real del endpoint
export interface OpcionApi {
  id_opcion: number;
  nombre_opcion: string;
  es_correcta: boolean;
  par_relacion: string | null;
}

export interface PreguntaApi {
  id_pregunta: number;
  tipo_pregunta: string;
  nombre_pregunta: string;
  puntaje_pregunta: string;
  opciones: OpcionApi[];
}

export interface CuestionarioApi {
  id_cuestionario: number;
  nombre_cuestionario: string;
  descripcion?: string;
  preguntas: PreguntaApi[];
}

// Interfaces alineadas al estándar de servicios
export interface PreguntaDetalle {
  id_pregunta: number;
  enunciado: string;
  tipo_pregunta: string;
  puntaje: number;
  orden: number;
  estado: boolean;
}

export interface CuestionarioDetalle {
  id_cuestionario: number;
  nombre: string;
  descripcion: string;
  preguntas: PreguntaDetalle[];
}

export interface CreateCuestionarioDetalleDto {
  nombre: string;
  descripcion?: string;
  preguntas?: PreguntaDetalle[];
}

export interface UpdateCuestionarioDetalleDto {
  nombre?: string;
  descripcion?: string;
  preguntas?: PreguntaDetalle[];
}

@Injectable({
  providedIn: 'root'
})
export class CuestionarioDetalleService {
  // API base URL Cuestionario Detalle
  private apiUrl = environment.apiBaseUrl + '/cuestionario-detalle';
  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );
  }

  // GET /cuestionario-detalle/:id_cuestionario - Obtener detalle de cuestionario por ID
  getDetalleCuestionario(id_cuestionario: number): Observable<CuestionarioApi> {
    return this.http.get<CuestionarioApi>(`${this.apiUrl}/${id_cuestionario}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /cuestionario-detalle - Crear nuevo CuestionarioDetalle
  crearCuestionarioDetalle(cuestionarioDetalle: CreateCuestionarioDetalleDto): Observable<CuestionarioDetalle> {
    return this.http.post<CuestionarioDetalle>(this.apiUrl, cuestionarioDetalle, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /cuestionario-detalle/:id - Actualizar CuestionarioDetalle
  actualizarCuestionarioDetalle(id_cuestionario: number, cuestionarioDetalle: UpdateCuestionarioDetalleDto): Observable<CuestionarioDetalle> {
    return this.http.put<CuestionarioDetalle>(`${this.apiUrl}/${id_cuestionario}`, cuestionarioDetalle, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /cuestionario-detalle/:id - Eliminar CuestionarioDetalle
  eliminarCuestionarioDetalle(id_cuestionario: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_cuestionario}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /cuestionario-detalle/:id/estado - Cambiar estado del CuestionarioDetalle
  cambiarEstado(id_cuestionario: number, estado: boolean): Observable<CuestionarioDetalle> {
    return this.http.patch<CuestionarioDetalle>(`${this.apiUrl}/${id_cuestionario}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }
}
