import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Actividad {
  id_actividad: number;
  nombre: string;
  descripcion?: string;
  fecha: string;
  id_tipo: number;
  id_colegio: number;
  estado: boolean;
}

export interface CreateActividadDto {
  nombre: string;
  descripcion?: string;
  fecha: string;
  id_tipo: number;
  id_colegio: number;
  estado: boolean;
}

export interface UpdateActividadDto extends Partial<CreateActividadDto> {
  id_actividad: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private apiUrl = environment.apiBaseUrl + '/actividad';
  private http = inject(HttpClient);

  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.apiUrl);
  }

  getActividadById(id_actividad: number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.apiUrl}/${id_actividad}`);
  }

  crearActividad(actividad: Omit<Actividad, 'id_actividad'>): Observable<Actividad> {
    return this.http.post<Actividad>(this.apiUrl, actividad);
  }

  actualizarActividad(id_actividad: number, actividad: Partial<Actividad>): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.apiUrl}/${id_actividad}`, actividad);
  }

  eliminarActividad(id_actividad: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_actividad}`);
  }
}
