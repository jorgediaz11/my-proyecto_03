import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ✅ INTERFACE COMPLETA PARA COLEGIO
export interface Colegio {
  id?: number;
  nombre: string;
  codigoModular: string;
  direccion: string;
  telefono: string;
  correo: string;
  website?: string;
  logo?: string;
  director?: string;
  departamento: string;
  provincia: string;
  distrito: string;
  nivelesEducativos: string[];
  turnos: string[];
  aforoMaximo: number;
  fechaFundacion: string;
  estado: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// ✅ INTERFACES PARA CRUD
export interface CreateColegioDto {
  nombre: string;
  codigoModular: string;
  direccion: string;
  telefono: string;
  correo: string;
  website?: string;
  logo?: string;
  director?: string;
  departamento: string;
  provincia: string;
  distrito: string;
  nivelesEducativos: string[];
  turnos: string[];
  aforoMaximo: number;
  fechaFundacion: string;
  estado: boolean;
}

export interface UpdateColegioDto extends Partial<CreateColegioDto> {
  id: number;
}

// ✅ INTERFACE PARA RESPUESTAS
export interface ColegioResponse {
  colegios: Colegio[];
  total: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ColegiosService {
  // ✅ CONFIGURACIÓN DE API
  private readonly apiUrl = environment.apiBaseUrl + '/colegios';

  // ✅ INYECCIÓN CON INJECT()
  private http = inject(HttpClient);

  // ✅ OBTENER TODOS LOS COLEGIOS
  getColegios(): Observable<Colegio[]> {
    console.log('ColegiosService.getColegios llamado');
    return this.http.get<Colegio[]>(this.apiUrl);
  }

  // ✅ OBTENER COLEGIO POR ID
  getColegioPorId(id: number): Observable<Colegio> {
    console.log('ColegiosService.getColegioPorId llamado con ID:', id);
    return this.http.get<Colegio>(`${this.apiUrl}/${id}`);
  }

  // ✅ CREAR NUEVO COLEGIO
  crearColegio(colegio: CreateColegioDto): Observable<Colegio> {
    console.log('ColegiosService.crearColegio llamado con:', colegio);
    return this.http.post<Colegio>(this.apiUrl, colegio);
  }

  // ✅ ACTUALIZAR COLEGIO
  actualizarColegio(id: number, colegio: UpdateColegioDto): Observable<Colegio> {
    console.log('ColegiosService.actualizarColegio llamado con ID:', id, 'datos:', colegio);
    return this.http.put<Colegio>(`${this.apiUrl}/${id}`, colegio);
  }

  // ✅ ELIMINAR COLEGIO
  eliminarColegio(id: number): Observable<{ message: string }> {
    console.log('ColegiosService.eliminarColegio llamado con ID:', id);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // ✅ VERIFICAR SI CÓDIGO MODULAR EXISTE
  verificarCodigoModular(codigoModular: string, excludeId?: number): Observable<{ exists: boolean }> {
    console.log('ColegiosService.verificarCodigoModular llamado con:', codigoModular);
    const params = excludeId ? `?excludeId=${excludeId}` : '';
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-codigo/${codigoModular}${params}`);
  }

  // ✅ BUSCAR COLEGIOS POR NOMBRE
  buscarColegios(termino: string): Observable<Colegio[]> {
    console.log('ColegiosService.buscarColegios llamado con:', termino);
    return this.http.get<Colegio[]>(`${this.apiUrl}/search?q=${termino}`);
  }
}
