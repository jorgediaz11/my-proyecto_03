import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LibroPendiente {
  id_activacion: number;
  id_libro: number;
  id_curso: number;
  id_colegio: number;
  id_estudiante: number;
  codigo_libro: string;
  estado: boolean;
  id_grado: number;
}

export interface PendientesActivacionResponse {
  id_estudiante: string;
  id_colegio: string;
  id_grado: string;
  pendientes: LibroPendiente[];
  total_pendientes: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivarLibroService {
  private apiUrl = environment.apiBaseUrl + '/activar-libro';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /activar-libro/pendientes/:id_estudiante/:id_colegio/:id_grado
  getLibrosPendientes(id_estudiante: number | string, id_colegio: number | string, id_grado: number | string): Observable<PendientesActivacionResponse> {
    const url = `${this.apiUrl}/pendientes/${id_estudiante}/${id_colegio}/${id_grado}`;
    return this.http.get<PendientesActivacionResponse>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
