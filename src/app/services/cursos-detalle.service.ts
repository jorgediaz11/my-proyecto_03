import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces alineadas al estándar de servicios
export interface LeccionDetalle {
  id_leccion: number;
  titulo: string;
  contenido: string;
}

export interface UnidadDetalle {
  id_unidad: number;
  nombre: string;
  orden: number;
  descripcion: string;
  lecciones: LeccionDetalle[];
}

export interface CursoDetalle {
  id_curso: number;
  nombre: string;
  descripcion: string;
  unidades: UnidadDetalle[];
}

export interface CreateCursoDetalleDto {
  nombre: string;
  descripcion?: string;
  unidades?: UnidadDetalle[];
}

export interface UpdateCursoDetalleDto {
  nombre?: string;
  descripcion?: string;
  unidades?: UnidadDetalle[];
}

@Injectable({
  providedIn: 'root'
})
export class CursosDetalleService {
  // API base URL Cursos Detalle
  private apiUrl = environment.apiBaseUrl + '/cursos-detalle';
  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );
  }

  // GET /CursosDetalles/colegio/:id_colegio - Obtener CursosDetalles por colegio
  getCursosDetallePorColegio(id_colegio: number): Observable<CursoDetalle[]> {
    return this.http.get<CursoDetalle[]>(`${this.apiUrl}/colegio/${id_colegio}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /CursosDetalles/nivel-grado/:nivel/:grado - Obtener CursosDetalles específicos por nivel y grado
  getCursosDetallePorNivelYGrado(nivel: string, grado: string): Observable<CursoDetalle[]> {
    return this.http.get<CursoDetalle[]>(`${this.apiUrl}/nivel-grado/${nivel}/${grado}`, {
      headers: this.getAuthHeaders()
    });
  }

    // GET /cursos-detalle/:id - Obtener detalle de curso por ID
  getDetalleCurso(id_curso: number): Observable<CursoDetalle> {
    return this.http.get<CursoDetalle>(`${this.apiUrl}/${id_curso}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /CursosDetalles - Crear nuevo CursosDetalle
  crearCursoDetalle(cursoDetalle: CreateCursoDetalleDto): Observable<CursoDetalle> {
    return this.http.post<CursoDetalle>(this.apiUrl, cursoDetalle, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /CursosDetalles/:id - Actualizar CursosDetalle
  actualizarCursoDetalle(id_cursoDetalle: number, cursoDetalle: UpdateCursoDetalleDto): Observable<CursoDetalle> {
    return this.http.put<CursoDetalle>(`${this.apiUrl}/${id_cursoDetalle}`, cursoDetalle, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /CursosDetalles/:id - Eliminar CursosDetalle
  eliminarCursoDetalle(id_cursoDetalle: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_cursoDetalle}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /CursosDetalles/:id/estado - Cambiar estado del CursosDetalle
  cambiarEstado(id_cursoDetalle: number, estado: boolean): Observable<CursoDetalle> {
    return this.http.patch<CursoDetalle>(`${this.apiUrl}/${id_cursoDetalle}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /CursosDetalles/areas-disponibles - Obtener lista de áreas disponibles
  getAreasDisponibles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/areas-disponibles`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /CursosDetalles/estadisticas/:id_colegio - Obtener estadísticas de CursosDetalles
  getEstadisticasCursoDetalle(id_colegio: number): Observable<{
    totalCursosDetalle: number;
    cursosDetallePorNivel: Record<string, number>;
    cursosDetallePorArea: Record<string, number>;
    horasTotalesSemanales: number;
    cursosDetalleObligatorios: number;
    cursosDetalleElectivos: number;
  }> {
    return this.http.get<{
      totalCursosDetalle: number;
      cursosDetallePorNivel: Record<string, number>;
      cursosDetallePorArea: Record<string, number>;
      horasTotalesSemanales: number;
      cursosDetalleObligatorios: number;
      cursosDetalleElectivos: number;
    }>(`${this.apiUrl}/estadisticas/${id_colegio}`, {
      headers: this.getAuthHeaders()
    });
  }
}
