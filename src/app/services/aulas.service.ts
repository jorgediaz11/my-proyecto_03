import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Aula {
  id_aula: number;
  nombre: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AulasService {
  private apiUrl = environment.apiBaseUrl + '/aulas';
  private http = inject(HttpClient);

  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl);
  }

  getAula(id_aula: number): Observable<Aula> {
    return this.http.get<Aula>(`${this.apiUrl}/${id_aula}`);
  }

  addAula(aula: { nombre: string; estado: boolean }): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl, aula);
  }

  updateAula(id_aula: number, aula: { nombre: string; estado: boolean }): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/${id_aula}`, aula);
  }

  deleteAula(id_aula: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_aula}`);
  }
}
