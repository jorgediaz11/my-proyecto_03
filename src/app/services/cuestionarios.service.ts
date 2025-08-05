
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cuestionario {
  id_cuestionario: number;
  titulo: string;
  descripcion?: string;
  estado: boolean;
}

export interface Cuestionario {
  id_cuestionario: number;
  titulo: string;
  descripcion?: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CuestionariosService {
  private apiUrl = environment.apiBaseUrl + '/cuestionario';
  private http = inject(HttpClient);

  getCuestionarios(): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(this.apiUrl);
  }

  getCuestionario(id_cuestionario: number): Observable<Cuestionario> {
    return this.http.get<Cuestionario>(`${this.apiUrl}/${id_cuestionario}`);
  }

  addCuestionario(cuestionario: { titulo: string; descripcion?: string; estado: boolean }): Observable<Cuestionario> {
    return this.http.post<Cuestionario>(this.apiUrl, cuestionario);
  }

  updateCuestionario(id_cuestionario: number, cuestionario: { titulo: string; descripcion?: string; estado: boolean }): Observable<Cuestionario> {
    return this.http.put<Cuestionario>(`${this.apiUrl}/${id_cuestionario}`, cuestionario);
  }

  deleteCuestionario(id_cuestionario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_cuestionario}`);
  }
}
