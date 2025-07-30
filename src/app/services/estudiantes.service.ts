import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaz para docente según el endpoint proporcionado
export interface EstudianteDirecto {
  id_docente: number;
  nombres: string;
  apellido: string;
  correo: string;
  estado: boolean;
  id_perfil: number;
  id_colegio: number;
  telefono?: string | null;
  direccion?: string | null;
  fecha_nacimiento?: string | null;
  docente_titulo?: string | null;
  foto_perfil?: string | null;
  ultimo_acceso?: string | null;
}
// Interfaz de respuesta similar a ColegioResponse
export interface EstudianteResponse {
  estudiantes: Estudiante[];
  total: number;
  message: string;
}
// 🎓 Interfaces para tipado completo
export interface Estudiante {
id_estudiante: number;
nombres: string;
apellido: string;
correo: string;
estado: boolean;
id_perfil: number;
id_colegio: number;
telefono: string | null;
direccion: string | null;
fecha_nacimiento: string;
foto_perfil: string | null;
ultimo_acceso: string | null;
}

export interface CreateEstudianteDto {
id_estudiante?: number;
nombres: string;
apellido: string;
correo: string;
estado: boolean;
id_perfil: number;
id_colegio: number;
telefono?: string | null;
direccion?: string | null;
fecha_nacimiento: string;
foto_perfil?: string | null;
ultimo_acceso?: string | null;
}

export interface UpdateEstudianteDto {
id_estudiante?: number;
nombres?: string;
apellido?: string;
correo?: string;
estado?: boolean;
id_perfil?: number;
id_colegio?: number;
telefono?: string | null;
direccion?: string | null;
fecha_nacimiento?: string;
foto_perfil?: string | null;
ultimo_acceso?: string | null;
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
  getEstudiantesDirecto() {
    throw new Error('Method not implemented.');
  }

  /**
   * 📋 Obtener todos los estudiantes con paginación y filtros
   */
  getEstudiantes(): Observable<Estudiante[]> {
    console.log('DocentesService.getDocentes llamado');
        return this.http.get<Estudiante[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  private readonly apiUrl = environment.apiBaseUrl + '/estudiantes';
  private http = inject(HttpClient);

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
    if ('apellidos' in estudiante && estudiante.apellido && estudiante.apellido.trim().length < 2) {
      return false;
    }
    if ('correo' in estudiante && estudiante.correo && !this.isValidEmail(estudiante.correo)) {
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
