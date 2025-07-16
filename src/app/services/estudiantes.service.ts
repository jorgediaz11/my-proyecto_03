import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// 🎓 Interfaces para tipado completo
export interface Estudiante {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  grado?: string;
  seccion?: string;
  documento?: string;
  fechaNacimiento?: string;
  direccion?: string;
  id_colegio?: number;
  estado?: boolean;
  fechaIngreso?: string;
  nombrePadre?: string;
  nombreMadre?: string;
  telefonoPadre?: string;
  telefonoMadre?: string;
  correoFamiliar?: string;
  numeroMatricula?: string;
  promedio?: number;
  asistencia?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEstudianteDto {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  grado?: string;
  seccion?: string;
  documento?: string;
  fechaNacimiento?: string;
  direccion?: string;
  id_colegio: number;
  estado?: boolean;
  fechaIngreso?: string;
  nombrePadre?: string;
  nombreMadre?: string;
  telefonoPadre?: string;
  telefonoMadre?: string;
  correoFamiliar?: string;
  numeroMatricula?: string;
}

export interface UpdateEstudianteDto {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  grado?: string;
  seccion?: string;
  documento?: string;
  fechaNacimiento?: string;
  direccion?: string;
  id_colegio?: number;
  estado?: boolean;
  fechaIngreso?: string;
  nombrePadre?: string;
  nombreMadre?: string;
  telefonoPadre?: string;
  telefonoMadre?: string;
  correoFamiliar?: string;
  numeroMatricula?: string;
}

export interface PaginatedEstudiantesResponse {
  data: Estudiante[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EstudianteFilters {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  grado?: string;
  seccion?: string;
  id_colegio?: number;
  estado?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasEstudiantes {
  total: number;
  activos: number;
  inactivos: number;
  porGrado: Record<string, number>;
  porSeccion: Record<string, number>;
  porColegio: Record<string, number>;
  promedioGeneral: number;
  asistenciaPromedio: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private readonly apiUrl = 'http://localhost:3000/estudiantes';
  private http = inject(HttpClient);

  /**
   * 📋 Obtener todos los estudiantes con paginación y filtros
   */
  getEstudiantes(filters: EstudianteFilters = {}): Observable<PaginatedEstudiantesResponse> {
    let params = new HttpParams();

    // Aplicar filtros
    if (filters.nombres) params = params.set('nombres', filters.nombres);
    if (filters.apellidos) params = params.set('apellidos', filters.apellidos);
    if (filters.correo) params = params.set('correo', filters.correo);
    if (filters.grado) params = params.set('grado', filters.grado);
    if (filters.seccion) params = params.set('seccion', filters.seccion);
    if (filters.id_colegio) params = params.set('id_colegio', filters.id_colegio.toString());
    if (filters.estado !== undefined) params = params.set('estado', filters.estado.toString());

    // Paginación
    params = params.set('page', (filters.page || 1).toString());
    params = params.set('limit', (filters.limit || 10).toString());

    // Ordenamiento
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PaginatedEstudiantesResponse>(this.apiUrl, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 👤 Obtener estudiante por ID
   */
  getEstudiantePorId(id: number): Observable<Estudiante> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de estudiante inválido'));
    }

    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * ➕ Crear nuevo estudiante
   */
  crearEstudiante(estudiante: CreateEstudianteDto): Observable<Estudiante> {
    if (!this.validateEstudianteData(estudiante)) {
      return throwError(() => new Error('Datos de estudiante inválidos'));
    }

    return this.http.post<Estudiante>(this.apiUrl, estudiante)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * ✏️ Actualizar estudiante existente
   */
  actualizarEstudiante(id: number, estudiante: UpdateEstudianteDto): Observable<Estudiante> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de estudiante inválido'));
    }

    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🗑️ Eliminar estudiante
   */
  eliminarEstudiante(id: number): Observable<{ message: string }> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de estudiante inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🔍 Buscar estudiantes por texto
   */
  buscarEstudiantes(query: string, limit = 10): Observable<Estudiante[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<Estudiante[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📊 Obtener estadísticas de estudiantes
   */
  getEstadisticasEstudiantes(): Observable<EstadisticasEstudiantes> {
    return this.http.get<EstadisticasEstudiantes>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener estudiantes por grado
   */
  getEstudiantesPorGrado(grado: string): Observable<Estudiante[]> {
    if (!grado || grado.trim().length === 0) {
      return throwError(() => new Error('Grado es requerido'));
    }

    const params = new HttpParams().set('grado', grado);

    return this.http.get<Estudiante[]>(`${this.apiUrl}/grado`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener estudiantes por sección
   */
  getEstudiantesPorSeccion(seccion: string): Observable<Estudiante[]> {
    if (!seccion || seccion.trim().length === 0) {
      return throwError(() => new Error('Sección es requerida'));
    }

    const params = new HttpParams().set('seccion', seccion);

    return this.http.get<Estudiante[]>(`${this.apiUrl}/seccion`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📝 Validar datos de estudiante
   */
  private validateEstudianteData(estudiante: CreateEstudianteDto | UpdateEstudianteDto): boolean {
    if ('nombres' in estudiante && estudiante.nombres && estudiante.nombres.trim().length < 2) {
      return false;
    }
    if ('apellidos' in estudiante && estudiante.apellidos && estudiante.apellidos.trim().length < 2) {
      return false;
    }
    if ('correo' in estudiante && estudiante.correo && !this.isValidEmail(estudiante.correo)) {
      return false;
    }
    if ('correoFamiliar' in estudiante && estudiante.correoFamiliar && !this.isValidEmail(estudiante.correoFamiliar)) {
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
    console.error('Error en EstudiantesService:', error);

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
            errorMessage = 'Estudiante no encontrado';
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
