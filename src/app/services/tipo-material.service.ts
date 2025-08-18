import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';

export interface TipoMaterial {
  id_tipo_material: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface CreateTipoMaterialDto {
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface UpdateTipoMaterialDto {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
}

export interface TipoMaterialResponse {
  tipo_materiales: TipoMaterial[];
  total: number;
  message: string;
}

export interface PaginatedTipoMaterialResponse {
  data: TipoMaterial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TipoMaterialFilters {
  nombre?: string;
  estado?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasTipoMaterial {
  total: number;
  activos: number;
  inactivos: number;
  porCurso: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class TipoMaterialService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl + '/tipo-material';

  getTipoMateriales(): Observable<TipoMaterial[]> {
    return this.http.get<TipoMaterial[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getTipoMaterialPorId(id_tipo_material: number): Observable<TipoMaterial> {
    if (!id_tipo_material || id_tipo_material <= 0) {
      return throwError(() => new Error('ID de tipo_material inválido'));
    }
    return this.http.get<TipoMaterial>(`${this.apiUrl}/${id_tipo_material}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  crearTipoMaterial(data: CreateTipoMaterialDto): Observable<TipoMaterial> {
    if (!this.validateTipoMaterialData(data)) {
      return throwError(() => new Error('Datos de unidad inválidos'));
    }

    return this.http.post<TipoMaterial>(this.apiUrl, data)
      .pipe(
        retry(1),
        catchError(this.handleError)
    );
  }

  actualizarTipoMaterial(id_tipo_material: number, data: UpdateTipoMaterialDto): Observable<TipoMaterial> {
    if (!this.validateTipoMaterialData(data)) {
      return throwError(() => new Error('Datos de unidad inválidos'));
    }

    return this.http.put<TipoMaterial>(`${this.apiUrl}/${id_tipo_material}`, data).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  eliminarTipoMaterial(id_tipo_material: number): Observable<{ message: string }> {
    if (!id_tipo_material || id_tipo_material <= 0) {
      return throwError(() => new Error('ID de tipo_material inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_tipo_material}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  buscarTipoMaterial(query: string, limit = 10): Observable<TipoMaterial[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }
    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<TipoMaterial[]>(`${this.apiUrl}/search`, { params }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getEstadisticasTipoMaterial(): Observable<EstadisticasTipoMaterial> {
    return this.http.get<EstadisticasTipoMaterial>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  private validateTipoMaterialData(tipomaterial: CreateTipoMaterialDto | UpdateTipoMaterialDto): boolean {
    if ('nombre' in tipomaterial && tipomaterial.nombre && tipomaterial.nombre.trim().length < 2) {
      return false;
    }
    if ('descripcion' in tipomaterial && tipomaterial.descripcion && tipomaterial.descripcion.trim().length < 2) {
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
            errorMessage = 'TipoMaterial no encontrado';
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
