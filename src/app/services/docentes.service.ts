import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// 📚 Interfaces para tipado completo
export interface Docente {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  especialidad?: string;
  documento?: string;
  fechaNacimiento?: string;
  direccion?: string;
  idColegio?: number;
  estado?: boolean;
  fechaIngreso?: string;
  titulo?: string;
  experiencia?: number;
  materias?: string[];
  horarios?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDocenteDto {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  especialidad?: string;
  documento?: string;
  fechaNacimiento?: string;
  direccion?: string;
  idColegio: number;
  estado?: boolean;
  fechaIngreso?: string;
  titulo?: string;
  experiencia?: number;
  materias?: string[];
  horarios?: string[];
}

export interface UpdateDocenteDto {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  especialidad?: string;
  documento?: string;
  fechaNacimiento?: string;
  direccion?: string;
  idColegio?: number;
  estado?: boolean;
  fechaIngreso?: string;
  titulo?: string;
  experiencia?: number;
  materias?: string[];
  horarios?: string[];
}

export interface PaginatedDocentesResponse {
  data: Docente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocenteFilters {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  especialidad?: string;
  idColegio?: number;
  estado?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasDocentes {
  total: number;
  activos: number;
  inactivos: number;
  porEspecialidad: Record<string, number>;
  porColegio: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class DocentesService {
  private readonly apiUrl = 'http://localhost:3000/docentes';
  private http = inject(HttpClient);

  /**
   * 📋 Obtener todos los docentes con paginación y filtros
   */
  getDocentes(filters: DocenteFilters = {}): Observable<PaginatedDocentesResponse> {
    let params = new HttpParams();

    // Aplicar filtros
    if (filters.nombres) params = params.set('nombres', filters.nombres);
    if (filters.apellidos) params = params.set('apellidos', filters.apellidos);
    if (filters.correo) params = params.set('correo', filters.correo);
    if (filters.especialidad) params = params.set('especialidad', filters.especialidad);
    if (filters.idColegio) params = params.set('idColegio', filters.idColegio.toString());
    if (filters.estado !== undefined) params = params.set('estado', filters.estado.toString());

    // Paginación
    params = params.set('page', (filters.page || 1).toString());
    params = params.set('limit', (filters.limit || 10).toString());

    // Ordenamiento
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PaginatedDocentesResponse>(this.apiUrl, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 👤 Obtener docente por ID
   */
  getDocentePorId(id: number): Observable<Docente> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de docente inválido'));
    }

    return this.http.get<Docente>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * ➕ Crear nuevo docente
   */
  crearDocente(docente: CreateDocenteDto): Observable<Docente> {
    if (!this.validateDocenteData(docente)) {
      return throwError(() => new Error('Datos de docente inválidos'));
    }

    return this.http.post<Docente>(this.apiUrl, docente)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * ✏️ Actualizar docente existente
   */
  actualizarDocente(id: number, docente: UpdateDocenteDto): Observable<Docente> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de docente inválido'));
    }

    return this.http.put<Docente>(`${this.apiUrl}/${id}`, docente)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🗑️ Eliminar docente
   */
  eliminarDocente(id: number): Observable<{ message: string }> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de docente inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🔍 Buscar docentes por texto
   */
  buscarDocentes(query: string, limit = 10): Observable<Docente[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<Docente[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📊 Obtener estadísticas de docentes
   */
  getEstadisticasDocentes(): Observable<EstadisticasDocentes> {
    return this.http.get<EstadisticasDocentes>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📝 Validar datos de docente
   */
  private validateDocenteData(docente: CreateDocenteDto | UpdateDocenteDto): boolean {
    if ('nombres' in docente && docente.nombres && docente.nombres.trim().length < 2) {
      return false;
    }
    if ('apellidos' in docente && docente.apellidos && docente.apellidos.trim().length < 2) {
      return false;
    }
    if ('correo' in docente && docente.correo && !this.isValidEmail(docente.correo)) {
      return false;
    }
    return true;
  }

  /**
   * 📧 Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
