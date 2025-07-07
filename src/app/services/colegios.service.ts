import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Colegio {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  website?: string;
  correo?: string;
  // Agrega otros campos según tu modelo
}

@Injectable({
  providedIn: 'root'
})
export class ColegiosService {
  private apiUrl = 'http://tu-servidor.com/api/colegios'; // Cambia por tu endpoint real

  constructor(private http: HttpClient) {}

  getColegios(): Observable<Colegio[]> {
    return this.http.get<Colegio[]>(this.apiUrl);
  }

  getColegioPorId(id: number): Observable<Colegio> {
    return this.http.get<Colegio>(`${this.apiUrl}/${id}`);
  }

  crearColegio(colegio: Colegio): Observable<Colegio> {
    return this.http.post<Colegio>(this.apiUrl, colegio);
  }

  actualizarColegio(id: number, colegio: Colegio): Observable<Colegio> {
    return this.http.put<Colegio>(`${this.apiUrl}/${id}`, colegio);
  }

  eliminarColegio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
