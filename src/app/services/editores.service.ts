import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// 📖 Interfaces para tipado completo
export interface Editor {
  id_editor?: number;
  nombres: string;
  apellido: string;
  correo: string;
  telefono?: string;
  //editorial?: string;
  //documento?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  id_colegio?: number;
  estado?: boolean;
  id_perfil: number;    // <-- Agrega esta línea
  fechaIngreso?: string;
  especialidad?: string;
  librosPublicados?: number;
  experiencia?: number;
  areas?: string[];
  certificaciones?: string[];
  createdAt?: string;
  updatedAt?: string;
  foto_perfil?: string;
  ultimo_acceso?: string;
}

export interface CreateEditorDto {
  nombres: string;
  apellido: string;
  correo: string;
  telefono?: string;
  //editorial?: string;
  //documento?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  id_colegio: number;
  estado?: boolean;
  id_perfil: number;    // <-- Agrega esta línea
  fechaIngreso?: string;
  especialidad?: string;
  librosPublicados?: number;
  experiencia?: number;
  areas?: string[];
  certificaciones?: string[];
  foto_perfil?: string;
  ultimo_acceso?: string;
}

export interface UpdateEditorDto {
  nombres?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  //editorial?: string;
  //documento?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  id_colegio?: number;
  estado?: boolean;
  id_perfil: number;    // <-- Agrega esta línea
  fechaIngreso?: string;
  especialidad?: string;
  librosPublicados?: number;
  experiencia?: number;
  areas?: string[];
  certificaciones?: string[];
  foto_perfil?: string;
  ultimo_acceso?: string;
}

export interface PaginatedEditoresResponse {
  data: Editor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EditorFilters {
  nombres?: string;
  apellido?: string;
  correo?: string;
  //editorial?: string;
  especialidad?: string;
  id_colegio?: number;
  estado?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasEditores {
  total: number;
  activos: number;
  inactivos: number;
  //porEditorial: Record<string, number>;
  porEspecialidad: Record<string, number>;
  porColegio: Record<string, number>;
  promedioLibros: number;
  experienciaPromedio: number;
}

@Injectable({
  providedIn: 'root'
})
export class EditoresService {
  private readonly apiUrl = environment.apiBaseUrl + '/editores';
  private http = inject(HttpClient);

  /**
   * 📋 Obtener todos los editores con paginación y filtros
   */
  getEditores(filters: EditorFilters = {}): Observable<PaginatedEditoresResponse> {
    let params = new HttpParams();

    // Aplicar filtros
    if (filters.nombres) params = params.set('nombres', filters.nombres);
    if (filters.apellido) params = params.set('apellido', filters.apellido);
    if (filters.correo) params = params.set('correo', filters.correo);
    //if (filters.editorial) params = params.set('editorial', filters.editorial);
    if (filters.especialidad) params = params.set('especialidad', filters.especialidad);
    if (filters.id_colegio) params = params.set('id_colegio', filters.id_colegio.toString());
    if (filters.estado !== undefined) params = params.set('estado', filters.estado.toString());

    // Paginación
    params = params.set('page', (filters.page || 1).toString());
    params = params.set('limit', (filters.limit || 10).toString());

    // Ordenamiento
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PaginatedEditoresResponse>(this.apiUrl, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 👤 Obtener editor por ID
   */
  getEditorPorId(id: number): Observable<Editor> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de editor inválido'));
    }

    return this.http.get<Editor>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * ➕ Crear nuevo editor
   */
  crearEditor(editor: CreateEditorDto): Observable<Editor> {
    if (!this.validateEditorData(editor)) {
      return throwError(() => new Error('Datos de editor inválidos'));
    }

    return this.http.post<Editor>(this.apiUrl, editor)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * ✏️ Actualizar editor existente
   */
  actualizarEditor(id: number, editor: UpdateEditorDto): Observable<Editor> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de editor inválido'));
    }

    return this.http.put<Editor>(`${this.apiUrl}/${id}`, editor)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🗑️ Eliminar editor
   */
  eliminarEditor(id: number): Observable<{ message: string }> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de editor inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🔍 Buscar editores por texto
   */
  buscarEditores(query: string, limit = 10): Observable<Editor[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<Editor[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📊 Obtener estadísticas de editores
   */
  getEstadisticasEditores(): Observable<EstadisticasEditores> {
    return this.http.get<EstadisticasEditores>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener editores por editorial
   */
  getEditoresPorEditorial(editorial: string): Observable<Editor[]> {
    if (!editorial || editorial.trim().length === 0) {
      return throwError(() => new Error('Editorial es requerida'));
    }

    const params = new HttpParams().set('editorial', editorial);

    return this.http.get<Editor[]>(`${this.apiUrl}/editorial`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener editores por especialidad
   */
  getEditoresPorEspecialidad(especialidad: string): Observable<Editor[]> {
    if (!especialidad || especialidad.trim().length === 0) {
      return throwError(() => new Error('Especialidad es requerida'));
    }

    const params = new HttpParams().set('especialidad', especialidad);

    return this.http.get<Editor[]>(`${this.apiUrl}/especialidad`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📝 Validar datos de editor
   */
  private validateEditorData(editor: CreateEditorDto | UpdateEditorDto): boolean {
    if ('nombres' in editor && editor.nombres && editor.nombres.trim().length < 2) {
      return false;
    }
    if ('apellido' in editor && editor.apellido && editor.apellido.trim().length < 2) {
      return false;
    }
    if ('correo' in editor && editor.correo && !this.isValidEmail(editor.correo)) {
      return false;
    }
    if ('librosPublicados' in editor && editor.librosPublicados && editor.librosPublicados < 0) {
      return false;
    }
    if ('experiencia' in editor && editor.experiencia && editor.experiencia < 0) {
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
    console.error('Error en EditoresService:', error);

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
            errorMessage = 'Editor no encontrado';
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
