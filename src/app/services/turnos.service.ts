import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ⏰ Interfaces para tipado de Turnos
export interface Turno {
  id?: number;
  nombre: string; // Mañana, Tarde, Noche
  descripcion?: string;
  horaInicio: string; // formato HH:mm
  horaFin: string; // formato HH:mm
  estado: boolean;
  idColegio?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateTurnoDto {
  nombre: string;
  descripcion?: string;
  horaInicio: string;
  horaFin: string;
  estado: boolean;
  idColegio?: number;
}

export interface UpdateTurnoDto {
  nombre?: string;
  descripcion?: string;
  horaInicio?: string;
  horaFin?: string;
  estado?: boolean;
  idColegio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private apiUrl = 'http://localhost:3000/turnos';

  private http = inject(HttpClient);

  // Obtener headers con JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /turnos - Listar todos los turnos
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /turnos/:id - Obtener turno por ID
  getTurnoById(id: number): Observable<Turno> {
    return this.http.get<Turno>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /turnos/activos - Obtener solo turnos activos
  getTurnosActivos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /turnos/colegio/:idColegio - Obtener turnos por colegio
  getTurnosPorColegio(idColegio: number): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/colegio/${idColegio}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST /turnos - Crear nuevo turno
  crearTurno(turno: CreateTurnoDto): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT /turnos/:id - Actualizar turno
  actualizarTurno(id: number, turno: UpdateTurnoDto): Observable<Turno> {
    return this.http.put<Turno>(`${this.apiUrl}/${id}`, turno, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE /turnos/:id - Eliminar turno
  eliminarTurno(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PATCH /turnos/:id/estado - Cambiar estado del turno
  cambiarEstado(id: number, estado: boolean): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}/estado`, { estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // GET /turnos/validar-horario - Validar que no haya conflictos de horario
  validarHorario(horaInicio: string, horaFin: string, idColegio?: number): Observable<{
    valido: boolean;
    conflictos: Turno[];
  }> {
    const params = new URLSearchParams();
    params.append('horaInicio', horaInicio);
    params.append('horaFin', horaFin);
    if (idColegio) {
      params.append('idColegio', idColegio.toString());
    }

    return this.http.get<{ valido: boolean; conflictos: Turno[] }>(`${this.apiUrl}/validar-horario?${params}`, {
      headers: this.getAuthHeaders()
    });
  }
}
