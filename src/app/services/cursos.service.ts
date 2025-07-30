import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// 📖 Interfaces para tipado de Cursos/Materias
export interface Curso {
  id_curso?: number;
  nombre: string; // Matemática, Comunicación, Ciencias, etc.
  descripcion?: string;
  codigo?: string; // MAT, COM, CTA, etc.
  nivel: string; // Inicial, Primaria, Secundaria
  grado?: string; // 1°, 2°, 3°, etc.
  horasSemanales?: number;
  creditos?: number;
  area: string; // Ciencias, Letras, Arte, etc.
  esObligatorio?: boolean;
  estado: boolean;
  id_colegio?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  tipo?: string;//'interno' | 'externo'; // <--- agregado para filtro
}

export interface CreateCursoDto {
  nombre: string;
  descripcion?: string;
  codigo?: string;
  nivel: string;
  grado?: string;
  horasSemanales?: number;
  creditos?: number;
  area: string;
  esObligatorio?: boolean;
  estado: boolean;
  id_colegio?: number;
}

export interface UpdateCursoDto {
  nombre?: string;
  descripcion?: string;
  codigo?: string;
  nivel?: string;
  grado?: string;
  horasSemanales?: number;
  creditos?: number;
  area?: string;
  esObligatorio?: boolean;
  estado?: boolean;
  id_colegio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  // API base URL Cursos
  private apiUrl = environment.apiBaseUrl + '/cursos';

  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /cursos - Listar todos los cursos
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/:id - Obtener curso por ID
  getCursoById(id_curso: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/${id_curso}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/activos - Obtener solo cursos activos
  getCursosActivos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/nivel/:nivel - Obtener cursos por nivel
  getCursosPorNivel(nivel: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/nivel/${nivel}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/grado/:grado - Obtener cursos por grado
  getCursosPorGrado(grado: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/grado/${grado}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/area/:area - Obtener cursos por área
  getCursosPorArea(area: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/area/${area}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/obligatorios - Obtener solo cursos obligatorios
  getCursosObligatorios(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/obligatorios`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/electivos - Obtener solo cursos electivos
  getCursosElectivos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/electivos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/colegio/:id_colegio - Obtener cursos por colegio
  getCursosPorColegio(id_colegio: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/colegio/${id_colegio}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/nivel-grado/:nivel/:grado - Obtener cursos específicos por nivel y grado
  getCursosPorNivelYGrado(nivel: string, grado: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/nivel-grado/${nivel}/${grado}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /cursos - Crear nuevo curso
  crearCurso(curso: CreateCursoDto): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /cursos/:id - Actualizar curso
  actualizarCurso(id_curso: number, curso: UpdateCursoDto): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${id_curso}`, curso, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /cursos/:id - Eliminar curso
  eliminarCurso(id_curso: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_curso}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /cursos/:id/estado - Cambiar estado del curso
  cambiarEstado(id_curso: number, estado: boolean): Observable<Curso> {
    return this.http.patch<Curso>(`${this.apiUrl}/${id_curso}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/areas-disponibles - Obtener lista de áreas disponibles
  getAreasDisponibles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/areas-disponibles`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /cursos/estadisticas/:id_colegio - Obtener estadísticas de cursos
  getEstadisticasCursos(id_colegio: number): Observable<{
    totalCursos: number;
    cursosPorNivel: Record<string, number>;
    cursosPorArea: Record<string, number>;
    horasTotalesSemanales: number;
    cursosObligatorios: number;
    cursosElectivos: number;
  }> {
    return this.http.get<{
      totalCursos: number;
      cursosPorNivel: Record<string, number>;
      cursosPorArea: Record<string, number>;
      horasTotalesSemanales: number;
      cursosObligatorios: number;
      cursosElectivos: number;
    }>(`${this.apiUrl}/estadisticas/${id_colegio}`, {
      headers: this.getAuthHeaders()
    });
  }
}
