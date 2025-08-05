import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PeriodoAcadem {
  id_periodo: number;
  nombre: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodosAcademService {
  private apiUrl = environment.apiBaseUrl + '/periodo-academ';
  private http = inject(HttpClient);

  getPeriodos(): Observable<PeriodoAcadem[]> {
    return this.http.get<PeriodoAcadem[]>(this.apiUrl);
  }

  getPeriodo(id_periodo: number): Observable<PeriodoAcadem> {
    return this.http.get<PeriodoAcadem>(`${this.apiUrl}/${id_periodo}`);
  }

  addPeriodo(periodo: { nombre: string; estado: boolean }): Observable<PeriodoAcadem> {
    return this.http.post<PeriodoAcadem>(this.apiUrl, periodo);
  }

  updatePeriodo(id_periodo: number, periodo: { nombre: string; estado: boolean }): Observable<PeriodoAcadem> {
    return this.http.put<PeriodoAcadem>(`${this.apiUrl}/${id_periodo}`, periodo);
  }

  deletePeriodo(id_periodo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_periodo}`);
  }
}
