import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';


// Interfaz principal para Unidad
export interface UnidadDirecta {
  id_unidad: number;
  id_curso: number;
  nombre: string;
  orden: number;
  descripcion: string;
  estado: boolean;
}

export interface Unidad {
  id_unidad?: number;
  id_curso: number;
  nombre: string;
  orden: number;
  descripcion: string;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnidadDto {
  id_curso: number;
  nombre: string;
  orden: number;
  descripcion: string;
  estado?: boolean;
}

export interface UpdateUnidadDto {
  id_curso?: number;
  nombre?: string;
  orden?: number;
  descripcion?: string;
  estado?: boolean;
}

export interface UnidadResponse {
  unidades: Unidad[];
  total: number;
  message: string;
}

export interface PaginatedUnidadesResponse {
  data: Unidad[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UnidadFilters {
  id_curso?: number;
  nombre?: string;
  estado?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasUnidades {
  total: number;
  activas: number;
  inactivas: number;
  porCurso: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class UnidadesService {
  getUnidadesDirecto() {
    throw new Error('Method not implemented.');
  }

  // Obtener todas las unidades
  getUnidades(): Observable<Unidad[]> {
    console.log('UnidadesService.getUnidades llamado');
    return this.http.get<Unidad[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  private apiUrl = environment.apiBaseUrl + '/unidad';
  private http = inject(HttpClient);

  // Obtener una unidad por ID
  getUnidadPorId(id_unidad: number): Observable<Unidad> {
    if (!id_unidad || id_unidad <= 0) {
      return throwError(() => new Error('ID de unidad inválido'));
    }
    return this.http.get<Unidad>(`${this.apiUrl}/${id_unidad}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  // Crear una nueva unidad
  crearUnidad(data: CreateUnidadDto): Observable<Unidad> {
    if (!this.validateUnidadData(data)) {
      return throwError(() => new Error('Datos de unidad inválidos'));
    }

    return this.http.post<Unidad>(this.apiUrl, data)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  // Actualizar una unidad
  actualizarUnidad(id_unidad: number, data: UpdateUnidadDto): Observable<Unidad> {
    if (!id_unidad || id_unidad <= 0) {
      return throwError(() => new Error('ID de unidad inválido'));
    }

    return this.http.put<Unidad>(`${this.apiUrl}/${id_unidad}`, data)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  // Eliminar una unidad
  eliminarUnidad(id_unidad: number): Observable<{ message: string }> {
    if (!id_unidad || id_unidad <= 0) {
      return throwError(() => new Error('ID de unidad inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_unidad}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  /**
   * 🔍 Buscar unidades por texto
   */
  buscarUnidades(query: string, limit = 10): Observable<Unidad[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<Unidad[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

   /**
    * 📊 Obtener estadísticas de unidades
    */
   getEstadisticasUnidades(): Observable<EstadisticasUnidades> {
     return this.http.get<EstadisticasUnidades>(`${this.apiUrl}/estadisticas`)
       .pipe(
         retry(2),
         catchError(this.handleError)
       );
   }

  /**
   * 📝 Validar datos de unidades
   */
  private validateUnidadData(unidad: CreateUnidadDto | UpdateUnidadDto): boolean {
    if ('nombre' in unidad && unidad.nombre && unidad.nombre.trim().length < 2) {
      return false;
    }
    if ('descripcion' in unidad && unidad.descripcion && unidad.descripcion.trim().length < 2) {
      return false;
    }
    // if ('correo' in unidad && unidad.correo && !this.isValidEmail(unidad.correo)) {
    //   return false;
    // }
    return true;
  }


/**
   * 🚨 Manejo centralizado de errores
   */
  private handleError = (error: unknown) => {
    console.error('Error en DocentesService:', error);

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
            errorMessage = 'Docente no encontrado';
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
