import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// 📅 Interfaces para tipado de Años Académicos/Periodos
export interface PeriodoAcademico {
  id?: number;
  nombre: string; // 2024, 2025, etc.
  descripcion?: string;
  fechaInicio: string; // formato YYYY-MM-DD
  fechaFin: string; // formato YYYY-MM-DD
  esActual?: boolean; // solo un periodo puede ser actual
  estado: boolean;
  trimestres?: number; // número de trimestres/bimestres
  vacaciones?: VacacionPeriodo[];
  id_colegio?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface VacacionPeriodo {
  id?: number;
  nombre: string; // Vacaciones de Medio Año, Fiestas Patrias, etc.
  fechaInicio: string;
  fechaFin: string;
  idPeriodo?: number;
}

export interface CreatePeriodoAcademicoDto {
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  esActual?: boolean;
  estado: boolean;
  trimestres?: number;
  id_colegio?: number;
}

export interface UpdatePeriodoAcademicoDto {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  esActual?: boolean;
  estado?: boolean;
  trimestres?: number;
  id_colegio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodosAcademicosService {

  private apiUrl = environment.apiBaseUrl + '/periodos-academicos';

  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /periodos-academicos - Listar todos los periodos académicos
  getPeriodosAcademicos(): Observable<PeriodoAcademico[]> {
    return this.http.get<PeriodoAcademico[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /periodos-academicos/:id - Obtener periodo académico por ID
  getPeriodoAcademicoById(id: number): Observable<PeriodoAcademico> {
    return this.http.get<PeriodoAcademico>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /periodos-academicos/activos - Obtener solo periodos activos
  getPeriodosActivos(): Observable<PeriodoAcademico[]> {
    return this.http.get<PeriodoAcademico[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /periodos-academicos/actual - Obtener el periodo académico actual
  getPeriodoActual(): Observable<PeriodoAcademico> {
    return this.http.get<PeriodoAcademico>(`${this.apiUrl}/actual`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /periodos-academicos/colegio/:id_colegio - Obtener periodos por colegio
  getPeriodosPorColegio(id_colegio: number): Observable<PeriodoAcademico[]> {
    return this.http.get<PeriodoAcademico[]>(`${this.apiUrl}/colegio/${id_colegio}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /periodos-academicos - Crear nuevo periodo académico
  crearPeriodoAcademico(periodo: CreatePeriodoAcademicoDto): Observable<PeriodoAcademico> {
    return this.http.post<PeriodoAcademico>(this.apiUrl, periodo, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /periodos-academicos/:id - Actualizar periodo académico
  actualizarPeriodoAcademico(id: number, periodo: UpdatePeriodoAcademicoDto): Observable<PeriodoAcademico> {
    return this.http.put<PeriodoAcademico>(`${this.apiUrl}/${id}`, periodo, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /periodos-academicos/:id - Eliminar periodo académico
  eliminarPeriodoAcademico(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /periodos-academicos/:id/estado - Cambiar estado del periodo
  cambiarEstado(id: number, estado: boolean): Observable<PeriodoAcademico> {
    return this.http.patch<PeriodoAcademico>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /periodos-academicos/:id/activar - Activar como periodo actual
  activarPeriodo(id: number): Observable<PeriodoAcademico> {
    return this.http.patch<PeriodoAcademico>(`${this.apiUrl}/${id}/activar`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /periodos-academicos/:id/vacaciones - Obtener vacaciones del periodo
  getVacacionesPeriodo(id: number): Observable<VacacionPeriodo[]> {
    return this.http.get<VacacionPeriodo[]>(`${this.apiUrl}/${id}/vacaciones`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /periodos-academicos/:id/vacaciones - Agregar vacaciones al periodo
  agregarVacaciones(id: number, vacacion: Omit<VacacionPeriodo, 'id' | 'idPeriodo'>): Observable<VacacionPeriodo> {
    return this.http.post<VacacionPeriodo>(`${this.apiUrl}/${id}/vacaciones`, vacacion, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /periodos-academicos/:id/vacaciones/:idVacacion - Eliminar vacaciones
  eliminarVacaciones(id: number, idVacacion: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}/vacaciones/${idVacacion}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /periodos-academicos/validar-fechas - Validar que no haya conflictos de fechas
  validarFechas(fechaInicio: string, fechaFin: string, id_colegio?: number, excluirId?: number): Observable<{
    valido: boolean;
    conflictos: PeriodoAcademico[];
  }> {
    const params = new URLSearchParams();
    params.append('fechaInicio', fechaInicio);
    params.append('fechaFin', fechaFin);
    if (id_colegio) {
      params.append('id_colegio', id_colegio.toString());
    }
    if (excluirId) {
      params.append('excluirId', excluirId.toString());
    }

    return this.http.get<{ valido: boolean; conflictos: PeriodoAcademico[] }>(`${this.apiUrl}/validar-fechas?${params}`, {
      headers: this.getAuthHeaders()
    });
  }
}
