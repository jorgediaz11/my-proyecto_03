import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';

// Interfaz principal para Material
export interface MaterialDirecto {
  id_material: number;
  idUsuarioCreador: number;
  idTipoMaterial: number;
  nombre: string;
  descripcion: string;
  rutaArchivo: string;
  tamanoBytes: string;
  duracionSegundos: number | null;
  fechaCreacion: string;
  idConfiguracion: number;
  estado: boolean;
}

export interface Material {
  id_material?: number;
  idUsuarioCreador: number;
  idTipoMaterial: number;
  nombre: string;
  descripcion: string;
  rutaArchivo: string;
  tamanoBytes: string;
  duracionSegundos?: number | null;
  fechaCreacion?: string;
  idConfiguracion?: number;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMaterialDto {
  idUsuarioCreador: number;
  idTipoMaterial: number;
  nombre: string;
  descripcion: string;
  rutaArchivo: string;
  tamanoBytes: string;
  duracionSegundos?: number | null;
  fechaCreacion?: string;
  idConfiguracion?: number;
  estado?: boolean;
}

export interface UpdateMaterialDto {
  idUsuarioCreador?: number;
  idTipoMaterial?: number;
  nombre?: string;
  descripcion?: string;
  rutaArchivo?: string;
  tamanoBytes?: string;
  duracionSegundos?: number | null;
  fechaCreacion?: string;
  idConfiguracion?: number;
  estado?: boolean;
}

export interface MaterialResponse {
  materiales: Material[];
  total: number;
  message: string;
}

export interface PaginatedMaterialesResponse {
  data: Material[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MaterialFilters {
  idTipoMaterial?: number;
  nombre?: string;
  estado?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EstadisticasMateriales {
  total: number;
  activos: number;
  inactivos: number;
  porTipo: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  getMaterialDirecto() {
    throw new Error('Method not implemented.');
  }
  /**
   * 📋 Obtener todos los materials (patrón igual a ColegiosService)
   */
  getMaterial(): Observable<Material[]> {
    console.log('MaterialsService.getMaterials llamado');
    return this.http.get<Material[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
  private readonly apiUrl = environment.apiBaseUrl + '/material';
  private http = inject(HttpClient);


  /**
   * 👤 Obtener material por ID
   */
  getMaterialPorId(id_material: number): Observable<Material> {
    if (!id_material || id_material <= 0) {
      return throwError(() => new Error('ID de material inválido'));
    }

    return this.http.get<Material>(`${this.apiUrl}/${id_material}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * ➕ Crear nuevo material
   */
  crearMaterial(material: CreateMaterialDto): Observable<Material> {
    if (!this.validateMaterialData(material)) {
      return throwError(() => new Error('Datos de material inválidos'));
    }

    return this.http.post<Material>(this.apiUrl, material)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * ✏️ Actualizar material existente
   */
  actualizarMaterial(id_material: number, material: UpdateMaterialDto): Observable<Material> {
    if (!id_material || id_material <= 0) {
      return throwError(() => new Error('ID de material inválido'));
    }

    return this.http.put<Material>(`${this.apiUrl}/${id_material}`, material)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🗑️ Eliminar material
   */
  eliminarMaterial(id_material: number): Observable<{ message: string }> {
    if (!id_material || id_material <= 0) {
      return throwError(() => new Error('ID de material inválido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_material}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * 🔍 Buscar materials por texto
   */
  buscarMaterial(query: string, limit = 10): Observable<Material[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Query de búsqueda debe tener al menos 2 caracteres'));
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<Material[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📊 Obtener estadísticas de materials
   */
  getEstadisticasMaterial(): Observable<EstadisticasMateriales> {
    return this.http.get<EstadisticasMateriales>(`${this.apiUrl}/estadisticas`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * 📝 Validar datos de material
   */
  private validateMaterialData(material: CreateMaterialDto | UpdateMaterialDto): boolean {
    if ('nombres' in material && material.nombre && material.nombre.trim().length < 2) {
      return false;
    }
    // if ('apellido' in material && material.apellido && material.apellido.trim().length < 2) {
    //   return false;
    // }
    return true;
  }


  /**
   * 🚨 Manejo centralizado de errores
   */
  private handleError = (error: unknown) => {
    console.error('Error en MaterialsService:', error);

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
            errorMessage = 'Material no encontrado';
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
