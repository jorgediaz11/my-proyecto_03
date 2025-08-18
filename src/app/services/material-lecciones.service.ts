import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MaterialLeccion {
  id_material_leccion: number;
  id_material: number;
  id_leccion: number;
  estado: boolean;
}

export interface CreateMaterialLeccionDto {
  id_material: number;
  id_leccion: number;
  estado: boolean;
}

export interface UpdateMaterialLeccionDto {
  id_material?: number;
  id_leccion?: number;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialLeccionesService {
  private apiUrl = environment.apiBaseUrl + '/material-lecciones';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /material-lecciones - Listar todas las relaciones material-lección
  getMaterialLecciones(): Observable<MaterialLeccion[]> {
    return this.http.get<MaterialLeccion[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /material-lecciones/:id - Obtener relación material-lección por ID
  getMaterialLeccionById(id: number): Observable<MaterialLeccion> {
    return this.http.get<MaterialLeccion>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /material-lecciones - Crear nueva relación material-lección
  crearMaterialLeccion(data: CreateMaterialLeccionDto): Observable<MaterialLeccion> {
    return this.http.post<MaterialLeccion>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /material-lecciones/:id - Actualizar relación material-lección
  actualizarMaterialLeccion(id: number, data: UpdateMaterialLeccionDto): Observable<MaterialLeccion> {
    return this.http.put<MaterialLeccion>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /material-lecciones/:id - Eliminar relación material-lección
  eliminarMaterialLeccion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
