import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Docente {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  especialidad?: string;
  // Agrega otros campos según tu modelo
}

@Injectable({
  providedIn: 'root'
})
export class DocentesService {
  private apiUrl = 'http://tu-servidor.com/api/docentes'; // Cambia por tu endpoint real

  constructor(private http: HttpClient) {}

  getDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.apiUrl);
  }

  getDocentePorId(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/${id}`);
  }

  crearDocente(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(this.apiUrl, docente);
  }

  actualizarDocente(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/${id}`, docente);
  }

  eliminarDocente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
