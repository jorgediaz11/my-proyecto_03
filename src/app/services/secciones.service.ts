import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Modelo simple alineado al backend
export interface Seccion {
  id_seccion: number;
  nombre: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SeccionesService {

  private apiUrl = environment.apiBaseUrl + '/seccion';
  private http = inject(HttpClient);

  // GET /seccion - Listar todas las secciones
  getSecciones(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(this.apiUrl);
  }

  // GET /seccion/:id - Obtener sección por ID
  getSeccionById(id_seccion: number): Observable<Seccion> {
    return this.http.get<Seccion>(`${this.apiUrl}/${id_seccion}`);
  }

  // POST /seccion - Crear nueva sección
  crearSeccion(seccion: { nombre: string; estado: boolean }): Observable<Seccion> {
    return this.http.post<Seccion>(this.apiUrl, seccion);
  }

  actualizarSeccion(id_seccion: number, seccion: { nombre: string; estado: boolean }): Observable<Seccion> {
    return this.http.put<Seccion>(`${this.apiUrl}/${id_seccion}`, seccion);
  }

  eliminarSeccion(id_seccion: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id_seccion}`);
  }
}
