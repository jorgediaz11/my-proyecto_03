import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Nivel {
  id_nivel: number;
  nombre: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NivelesService {
  private apiUrl = environment.apiBaseUrl + '/nivel';
  private http = inject(HttpClient);

  getNiveles(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.apiUrl);
  }

  getNivel(id_nivel: number): Observable<Nivel> {
    return this.http.get<Nivel>(`${this.apiUrl}/${id_nivel}`);
  }

  addNivel(nivel: { nombre: string; estado: boolean }): Observable<Nivel> {
    return this.http.post<Nivel>(this.apiUrl, nivel);
  }

  updateNivel(id_nivel: number, nivel: { nombre: string; estado: boolean }): Observable<Nivel> {
    return this.http.put<Nivel>(`${this.apiUrl}/${id_nivel}`, nivel);
  }

  deleteNivel(id_nivel: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_nivel}`);
  }
}
