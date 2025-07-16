import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Perfil {
  id_perfil: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface CreatePerfilDto {
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface UpdatePerfilDto {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:3000/perfiles';
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPerfiles(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getPerfilById(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  crearPerfil(perfil: CreatePerfilDto): Observable<Perfil> {
    return this.http.post<Perfil>(this.apiUrl, perfil, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarPerfil(id: number, perfil: UpdatePerfilDto): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.apiUrl}/${id}`, perfil, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarPerfil(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
