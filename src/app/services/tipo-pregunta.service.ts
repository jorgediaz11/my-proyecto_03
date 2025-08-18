import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TipoPregunta {
  id_tipo_pregunta: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
}

export interface CreateTipoPreguntaDto {
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface UpdateTipoPreguntaDto {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TipoPreguntaService {
  private apiUrl = environment.apiBaseUrl + '/tipo-pregunta';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /tipo-pregunta - Listar todos los tipos de pregunta
  getTiposPregunta(): Observable<TipoPregunta[]> {
    return this.http.get<TipoPregunta[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /tipo-pregunta/:id - Obtener tipo de pregunta por ID
  getTipoPreguntaById(id: number): Observable<TipoPregunta> {
    return this.http.get<TipoPregunta>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /tipo-pregunta - Crear nuevo tipo de pregunta
  crearTipoPregunta(tipo: CreateTipoPreguntaDto): Observable<TipoPregunta> {
    return this.http.post<TipoPregunta>(this.apiUrl, tipo, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /tipo-pregunta/:id - Actualizar tipo de pregunta
  actualizarTipoPregunta(id: number, tipo: UpdateTipoPreguntaDto): Observable<TipoPregunta> {
    return this.http.put<TipoPregunta>(`${this.apiUrl}/${id}`, tipo, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /tipo-pregunta/:id - Eliminar tipo de pregunta
  eliminarTipoPregunta(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
