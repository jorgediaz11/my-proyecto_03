import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TipoAcceso {
  id_tipo_acceso: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
}

export interface CreateTipoAccesoDto {
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface UpdateTipoAccesoDto {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TipoAccesoService {
  private apiUrl = environment.apiBaseUrl + '/tipo-acceso';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /tipo-acceso - Listar todos los tipos de acceso
  getTiposAcceso(): Observable<TipoAcceso[]> {
    return this.http.get<TipoAcceso[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /tipo-acceso/:id - Obtener tipo de acceso por ID
  getTipoAccesoById(id: number): Observable<TipoAcceso> {
    return this.http.get<TipoAcceso>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /tipo-acceso - Crear nuevo tipo de acceso
  crearTipoAcceso(tipo: CreateTipoAccesoDto): Observable<TipoAcceso> {
    return this.http.post<TipoAcceso>(this.apiUrl, tipo, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /tipo-acceso/:id - Actualizar tipo de acceso
  actualizarTipoAcceso(id: number, tipo: UpdateTipoAccesoDto): Observable<TipoAcceso> {
    return this.http.put<TipoAcceso>(`${this.apiUrl}/${id}`, tipo, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /tipo-acceso/:id - Eliminar tipo de acceso
  eliminarTipoAcceso(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
