
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaz alineada al endpoint
export interface Perfil {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

// DTO para crear y actualizar
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
export class PerfilesService {
  private readonly apiUrl = environment.apiBaseUrl + '/perfiles';
  private http = inject(HttpClient);

  // CRUD básico
  getPerfiles(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getPerfilById(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  crearPerfil(perfil: CreatePerfilDto): Observable<Perfil> {
    return this.http.post<Perfil>(this.apiUrl, perfil).pipe(catchError(this.handleError));
  }

  actualizarPerfil(id: number, perfil: UpdatePerfilDto): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.apiUrl}/${id}`, perfil).pipe(catchError(this.handleError));
  }

  eliminarPerfil(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Error desconocido';
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  };
}
