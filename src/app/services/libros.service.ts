import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces para tipado de Libros
export interface Libro {
  id_libro?: number;
  titulo: string;
  autor: string;
  descripcion?: string;
  editorial?: string;
  anio_publicacion?: number;
  estado: boolean;
  id_area?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateLibroDto {
  titulo: string;
  autor: string;
  descripcion?: string;
  editorial?: string;
  anio_publicacion?: number;
  estado: boolean;
  id_area?: number;
}

export interface UpdateLibroDto {
  titulo?: string;
  autor?: string;
  descripcion?: string;
  editorial?: string;
  anio_publicacion?: number;
  estado?: boolean;
  id_area?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private apiUrl = environment.apiBaseUrl + '/libros';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /libros - Listar todos los libros
  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /libros/:id - Obtener libro por ID
  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /libros/activos - Obtener solo libros activos
  getLibrosActivos(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /libros/area/:id_area - Obtener libros por área
  getLibrosPorArea(id_area: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/area/${id_area}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /libros - Crear nuevo libro
  crearLibro(libro: CreateLibroDto): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /libros/:id - Actualizar libro
  actualizarLibro(id: number, libro: UpdateLibroDto): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${id}`, libro, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /libros/:id - Eliminar libro
  eliminarLibro(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /libros/:id/estado - Cambiar estado del libro
  cambiarEstado(id: number, estado: boolean): Observable<Libro> {
    return this.http.patch<Libro>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }
}
