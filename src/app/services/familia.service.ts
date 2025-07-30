import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

// Interfaz para docente según el endpoint proporcionado
export interface FamiliaDirecto {
  id_familia: number;
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
export interface FamiliaResponse {
  familia: Familia[];
  total: number;
  message: string;
}
// Modelo principal según el endpoint
export interface Familia {
  id_familia: number;
  nombres: string;
  apellido: string;
  estado: boolean;
  estudiante_codigo: string | null;
  foto_perfil: string | null;
  id_perfil: number;
  id_colegio: number;
  familia_estudiantes: number[]; // Códigos de estudiantes supervisados
}
export interface CreateFamiliaDto {
  nombres: string;
  apellido: string;
  id_colegio?: number;
}

export interface UpdateFamiliaDto {
  nombres: string;
  apellido: string;
  id_colegio?: number;
}

export interface PaginatedFamiliasResponse {
  data: Familia[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FamiliaFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  providedIn: 'root'
}

export interface EstadisticasFamilias {
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
export class FamilasService {
  getFamiliasDirecto() {
    throw new Error('Method not implemented.');
  }

  /**
   * 📋 Obtener todos los familias con paginación y filtros
   */
  getFamilias(): Observable<Familia[]> {
    console.log('FamilasService.getFamilas llamado');
    return this.http.get<Familia[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  private readonly apiUrl = environment.apiBaseUrl + '/familia';
  private http = inject(HttpClient);

  /**
   * 👤 Obtener familia por ID
   */
  getFamiliaPorId(id: number): Observable<Familia> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de familia inválido'));
    }

    return this.http.get<Familia>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * ➕ Crear nuevo familia
   */
  crearFamilia(familia: CreateFamiliaDto): Observable<Familia> {
    if (!this.validateFamiliaData(familia)) {
      return throwError(() => new Error('Datos de familia inválidos'));
    }

    return this.http.post<Familia>(this.apiUrl, familia)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * ✏️ Actualizar familia existente
   */
  actualizarFamilia(id: number, familia: UpdateFamiliaDto): Observable<Familia> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de familia inválido'));
    }

    return this.http.put<Familia>(`${this.apiUrl}/${id}`, familia)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🗑️ Eliminar familia
   */
  eliminarFamilia(id: number): Observable<{ message: string }> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de familia inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🔍 Buscar familias por texto
   */
  buscarFamilias(query: string, limit = 10): Observable<Familia[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<Familia[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📊 Obtener estadísticas de familias
   */
  getEstadisticasFamilias(): Observable<EstadisticasFamilias> {
    return this.http.get<EstadisticasFamilias>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener familias por grado
   */
  getFamiliasPorGrado(grado: string): Observable<Familia[]> {
    if (!grado || grado.trim().length === 0) {
      return throwError(() => new Error('Grado es requerido'));
    }

    const params = new HttpParams().set('grado', grado);

    return this.http.get<Familia[]>(`${this.apiUrl}/grado`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener familias por sección
   */
  getFamiliasPorSeccion(seccion: string): Observable<Familia[]> {
    if (!seccion || seccion.trim().length === 0) {
      return throwError(() => new Error('Sección es requerida'));
    }

    const params = new HttpParams().set('seccion', seccion);

    return this.http.get<Familia[]>(`${this.apiUrl}/seccion`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📝 Validar datos de familia
   */
  private validateFamiliaData(familia: CreateFamiliaDto | UpdateFamiliaDto): boolean {
    if ('nombres' in familia && familia.nombres && familia.nombres.trim().length < 2) {
      return false;
    }
    if ('apellidos' in familia && familia.apellido && familia.apellido.trim().length < 2) {
      return false;
    }
    // if ('correo' in familia && familia.correo && !this.isValidEmail(familia.correo)) {
    //   return false;
    //}
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
            errorMessage = 'Familia no encontrada';
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
