import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';

export interface TipoActividad {
  id_tipo_actividad: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface CreateTipoActividadDto {
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface UpdateTipoActividadDto {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
}

export interface TipoActividadResponse {
  tipo_actividades: TipoActividad[];
  total: number;
  message: string;
}

export interface PaginatedTipoActividadResponse {
  data: TipoActividad[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TipoActividadFilters {
  nombre?: string;
  estado?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasTipoActividad {
  total: number;
  activos: number;
  inactivos: number;
  porCurso: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class TipoActividadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl + '/tipo-actividad';

  getTipoActividades(): Observable<TipoActividad[]> {
    return this.http.get<TipoActividad[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getTipoActividadPorId(id_tipo_actividad: number): Observable<TipoActividad> {
    if (!id_tipo_actividad || id_tipo_actividad <= 0) {
      return throwError(() => new Error('ID de tipo_actividad inválido'));
    }
    return this.http.get<TipoActividad>(`${this.apiUrl}/${id_tipo_actividad}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  crearTipoActividad(data: CreateTipoActividadDto): Observable<TipoActividad> {
    if (!this.validateTipoActividadData(data)) {
      return throwError(() => new Error('Datos de tipo_actividad inválidos'));
    }

    return this.http.post<TipoActividad>(this.apiUrl, data)
      .pipe(
        retry(1),
        catchError(this.handleError)
    );
  }

  actualizarTipoActividad(id_tipo_actividad: number, data: UpdateTipoActividadDto): Observable<TipoActividad> {
    if (!this.validateTipoActividadData(data)) {
      return throwError(() => new Error('Datos de tipo_actividad inválidos'));
    }

    return this.http.put<TipoActividad>(`${this.apiUrl}/${id_tipo_actividad}`, data).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  eliminarTipoActividad(id_tipo_actividad: number): Observable<{ message: string }> {
    if (!id_tipo_actividad || id_tipo_actividad <= 0) {
      return throwError(() => new Error('ID de tipo_actividad inválido'));
    }
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_tipo_actividad}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  buscarTipoActividad(query: string, limit = 10): Observable<TipoActividad[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }
    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<TipoActividad[]>(`${this.apiUrl}/search`, { params }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getEstadisticasTipoActividad(): Observable<EstadisticasTipoActividad> {
    return this.http.get<EstadisticasTipoActividad>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  private validateTipoActividadData(tipoActividad: CreateTipoActividadDto | UpdateTipoActividadDto): boolean {
    if ('nombre' in tipoActividad && tipoActividad.nombre && tipoActividad.nombre.trim().length < 2) {
      return false;
    }
    if ('descripcion' in tipoActividad && tipoActividad.descripcion && tipoActividad.descripcion.trim().length < 2) {
      return false;
    }
    // if ('correo' in unidad && unidad.correo && !this.isValidEmail(unidad.correo)) {
    //   return false;
    // }
    return true;
  }

  private handleError = (error: unknown) => {
    console.error('Error en TipoMaterialService:', error);
    let errorMessage = 'Error desconocido';
    if (error && typeof error === 'object' && 'error' in error) {
      const httpError = error as { error?: { message?: string }; message?: string; status?: number; statusText?: string };
      if (httpError.error?.message) {
        errorMessage = httpError.error.message;
      } else if (httpError.message) {
        errorMessage = httpError.message;
      } else if (httpError.status) {
        switch (httpError.status) {
          case 400:
            errorMessage = 'Datos inválidos';
            break;
          case 401:
            errorMessage = 'No autorizado';
            break;
          case 403:
            errorMessage = 'Acceso prohibido';
            break;
          case 404:
            errorMessage = 'TipoActividad no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = `Error ${httpError.status}: ${httpError.statusText}`;
        }
      }
    }
    return throwError(() => new Error(errorMessage));
  };
}
