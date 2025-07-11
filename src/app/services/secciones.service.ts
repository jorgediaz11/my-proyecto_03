import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// 📝 Interfaces para tipado de Secciones
export interface Seccion {
  id?: number;
  nombre: string; // A, B, C, D, Única
  descripcion?: string;
  grado: string; // 1°, 2°, 3°, etc.
  idGrado?: number;
  nivel: string; // Inicial, Primaria, Secundaria
  capacidadMaxima?: number;
  estudiantesActuales?: number;
  aula?: string; // ubicación física
  turno?: string; // mañana, tarde
  estado: boolean;
  idColegio?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateSeccionDto {
  nombre: string;
  descripcion?: string;
  grado: string;
  idGrado?: number;
  nivel: string;
  capacidadMaxima?: number;
  aula?: string;
  turno?: string;
  estado: boolean;
  idColegio?: number;
}

export interface UpdateSeccionDto {
  nombre?: string;
  descripcion?: string;
  grado?: string;
  idGrado?: number;
  nivel?: string;
  capacidadMaxima?: number;
  aula?: string;
  turno?: string;
  estado?: boolean;
  idColegio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SeccionesService {

  private apiUrl = 'http://localhost:3000/secciones';

  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /secciones - Listar todas las secciones
  getSecciones(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/:id - Obtener sección por ID
  getSeccionById(id: number): Observable<Seccion> {
    return this.http.get<Seccion>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/activas - Obtener solo secciones activas
  getSeccionesActivas(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.apiUrl}/activas`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/grado/:grado - Obtener secciones por grado
  getSeccionesPorGrado(grado: string): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.apiUrl}/grado/${grado}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/grado-id/:idGrado - Obtener secciones por ID de grado
  getSeccionesPorIdGrado(idGrado: number): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.apiUrl}/grado-id/${idGrado}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/nivel/:nivel - Obtener secciones por nivel
  getSeccionesPorNivel(nivel: string): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.apiUrl}/nivel/${nivel}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/colegio/:idColegio - Obtener secciones por colegio
  getSeccionesPorColegio(idColegio: number): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.apiUrl}/colegio/${idColegio}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/turno/:turno - Obtener secciones por turno
  getSeccionesPorTurno(turno: string): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.apiUrl}/turno/${turno}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/disponibles - Obtener secciones con cupos disponibles
  getSeccionesDisponibles(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.apiUrl}/disponibles`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /secciones - Crear nueva sección
  crearSeccion(seccion: CreateSeccionDto): Observable<Seccion> {
    return this.http.post<Seccion>(this.apiUrl, seccion, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /secciones/:id - Actualizar sección
  actualizarSeccion(id: number, seccion: UpdateSeccionDto): Observable<Seccion> {
    return this.http.put<Seccion>(`${this.apiUrl}/${id}`, seccion, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /secciones/:id - Eliminar sección
  eliminarSeccion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /secciones/:id/estado - Cambiar estado de la sección
  cambiarEstado(id: number, estado: boolean): Observable<Seccion> {
    return this.http.patch<Seccion>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /secciones/:id/capacidad - Actualizar capacidad de la sección
  actualizarCapacidad(id: number, capacidadMaxima: number): Observable<Seccion> {
    return this.http.patch<Seccion>(`${this.apiUrl}/${id}/capacidad`, { capacidadMaxima }, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /secciones/estadisticas/:idColegio - Obtener estadísticas de secciones
  getEstadisticasSecciones(idColegio: number): Observable<{
    totalSecciones: number;
    seccionesPorNivel: Record<string, number>;
    seccionesPorGrado: Record<string, number>;
    capacidadTotal: number;
    estudiantesTotal: number;
    porcentajeOcupacion: number;
  }> {
    return this.http.get<{
      totalSecciones: number;
      seccionesPorNivel: Record<string, number>;
      seccionesPorGrado: Record<string, number>;
      capacidadTotal: number;
      estudiantesTotal: number;
      porcentajeOcupacion: number;
    }>(`${this.apiUrl}/estadisticas/${idColegio}`, {
      headers: this.getAuthHeaders()
    });
  }
}
