import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClaseCol {
  id_clases?: number;
  id_colegio: number;
  id_docente: number;
  id_nivel: number;
  id_grado: number;
  id_seccion: number;
  id_curso: number;
  observaciones?: string | null;
  estado: boolean;
}

export interface CreateClaseColDto {
  id_colegio: number;
  id_docente: number;
  id_nivel: number;
  id_grado: number;
  id_seccion: number;
  id_curso: number;
  observaciones?: string | null;
  estado: boolean;
}

export interface UpdateClaseColDto {
  id_colegio?: number;
  id_docente?: number;
  id_nivel?: number;
  id_grado?: number;
  id_seccion?: number;
  id_curso?: number;
  observaciones?: string | null;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClasesColService {
  private apiUrl = environment.apiBaseUrl + '/clases-col';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getClasesCol(): Observable<ClaseCol[]> {
    return this.http.get<ClaseCol[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getClaseColById(id_clases: number): Observable<ClaseCol> {
    return this.http.get<ClaseCol>(`${this.apiUrl}/${id_clases}`, {
      headers: this.getAuthHeaders()
    });
  }

  crearClaseCol(clase: CreateClaseColDto): Observable<ClaseCol> {
    return this.http.post<ClaseCol>(this.apiUrl, clase, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarClaseCol(id_clases: number, clase: UpdateClaseColDto): Observable<ClaseCol> {
    return this.http.put<ClaseCol>(`${this.apiUrl}/${id_clases}`, clase, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarClaseCol(id_clases: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_clases}`, {
      headers: this.getAuthHeaders()
    });
  }
}
