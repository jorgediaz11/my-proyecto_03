// Servicio de Perfiles de Configuración - Modernizado
// perfiles.service.ts
// src/app/services/perfiles.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// 🔧 Interfaces para tipado completo
export interface Perfil {
  id_perfil?: number;
  nombre: string;
  descripcion?: string;
  tipo: 'administrador' | 'docente' | 'estudiante' | 'editor' | 'familia';
  permisos: string[];
  configuraciones?: Record<string, unknown>;
  estado?: boolean;
  esDefault?: boolean;
  id_colegio?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePerfilDto {
  nombre: string;
  descripcion?: string;
  tipo: 'administrador' | 'docente' | 'estudiante' | 'editor' | 'familia';
  permisos: string[];
  configuraciones?: Record<string, unknown>;
  estado?: boolean;
  esDefault?: boolean;
  id_colegio?: number;
}

export interface UpdatePerfilDto {
  nombre?: string;
  descripcion?: string;
  tipo?: 'administrador' | 'docente' | 'estudiante' | 'editor' | 'familia';
  permisos?: string[];
  configuraciones?: Record<string, unknown>;
  estado?: boolean;
  esDefault?: boolean;
  id_colegio?: number;
}

export interface PaginatedPerfilesResponse {
  data: Perfil[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PerfilFilters {
  nombre?: string;
  tipo?: 'administrador' | 'docente' | 'estudiante' | 'editor' | 'familia';
  estado?: boolean;
  esDefault?: boolean;
  id_colegio?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasPerfiles {
  total: number;
  activos: number;
  inactivos: number;
  porTipo: Record<string, number>;
  porColegio: Record<string, number>;
  defaults: number;
}

export interface PermisoDisponible {
  id_perfil: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  esBasico: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {
  private readonly apiUrl = environment.apiBaseUrl + '/perfiles';
  private http = inject(HttpClient);

  /**
   * 📋 Obtener todos los perfiles con paginación y filtros
   */
  getPerfiles(filters: PerfilFilters = {}): Observable<PaginatedPerfilesResponse> {
    let params = new HttpParams();

    // Aplicar filtros
    if (filters.nombre) params = params.set('nombre', filters.nombre);
    if (filters.tipo) params = params.set('tipo', filters.tipo);
    if (filters.estado !== undefined) params = params.set('estado', filters.estado.toString());
    if (filters.esDefault !== undefined) params = params.set('esDefault', filters.esDefault.toString());
    if (filters.id_colegio) params = params.set('id_colegio', filters.id_colegio.toString());

    // Paginación
    params = params.set('page', (filters.page || 1).toString());
    params = params.set('limit', (filters.limit || 10).toString());

    // Ordenamiento
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PaginatedPerfilesResponse>(this.apiUrl, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 👤 Obtener perfil por ID
   */
  getPerfilPorId(id: number): Observable<Perfil> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de perfil inválido'));
    }

    return this.http.get<Perfil>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * ➕ Crear nuevo perfil
   */
  crearPerfil(perfil: CreatePerfilDto): Observable<Perfil> {
    if (!this.validatePerfilData(perfil)) {
      return throwError(() => new Error('Datos de perfil inválidos'));
    }

    return this.http.post<Perfil>(this.apiUrl, perfil)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * ✏️ Actualizar perfil existente
   */
  actualizarPerfil(id: number, perfil: UpdatePerfilDto): Observable<Perfil> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de perfil inválido'));
    }

    return this.http.put<Perfil>(`${this.apiUrl}/${id}`, perfil)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🗑️ Eliminar perfil
   */
  eliminarPerfil(id: number): Observable<{ message: string }> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de perfil inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🔍 Buscar perfiles por texto
   */
  buscarPerfiles(query: string, limit = 10): Observable<Perfil[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<Perfil[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📊 Obtener estadísticas de perfiles
   */
  getEstadisticasPerfiles(): Observable<EstadisticasPerfiles> {
    return this.http.get<EstadisticasPerfiles>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 🔐 Obtener permisos disponibles
   */
  getPermisosDisponibles(): Observable<PermisoDisponible[]> {
    return this.http.get<PermisoDisponible[]>(`${this.apiUrl}/permisos-disponibles`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener perfiles por tipo
   */
  getPerfilesPorTipo(tipo: string): Observable<Perfil[]> {
    if (!tipo || tipo.trim().length === 0) {
      return throwError(() => new Error('Tipo es requerido'));
    }

    const params = new HttpParams().set('tipo', tipo);

    return this.http.get<Perfil[]>(`${this.apiUrl}/tipo`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener perfiles por defecto
   */
  getPerfilesDefault(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.apiUrl}/defaults`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 🔧 Clonar perfil
   */
  clonarPerfil(id: number, nuevoNombre: string): Observable<Perfil> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de perfil inválido'));
    }

    if (!nuevoNombre || nuevoNombre.trim().length < 2) {
      return throwError(() => new Error('Nombre del nuevo perfil es requerido'));
    }

    return this.http.post<Perfil>(`${this.apiUrl}/${id}/clone`, { nombre: nuevoNombre })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 📝 Validar datos de perfil
   */
  private validatePerfilData(perfil: CreatePerfilDto | UpdatePerfilDto): boolean {
    if ('nombre' in perfil && perfil.nombre && perfil.nombre.trim().length < 2) {
      return false;
    }
    if ('tipo' in perfil && perfil.tipo && !['administrador', 'docente', 'estudiante', 'editor', 'familia'].includes(perfil.tipo)) {
      return false;
    }
    if ('permisos' in perfil && perfil.permisos && (!Array.isArray(perfil.permisos) || perfil.permisos.length === 0)) {
      return false;
    }
    return true;
  }

  /**
   * 🚨 Manejo centralizado de errores
   */
  private handleError = (error: unknown) => {
    console.error('Error en PerfilesService:', error);

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
            errorMessage = 'Perfil no encontrado';
            break;
          case 409:
            errorMessage = 'Conflicto: El perfil ya existe';
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
