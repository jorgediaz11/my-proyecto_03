import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Departamento {
  id_ubigeo: string;
  departamento: string;
}
export interface Provincia {
  id_ubigeo: string;
  provincia: string;
}
export interface Distrito {
  id_ubigeo: string;  // Identificador único del distrito
  distrito: string;
}

@Injectable({ providedIn: 'root' })
export class UbigeoService {
  private readonly apiUrl = environment.apiBaseUrl + '/ubigeo';
  private http = inject(HttpClient);

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.apiUrl}/departamentos`);
  }

  getProvincias(idDepartamento: string): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.apiUrl}/provincias/${idDepartamento}`);
  }

  getDistritos(idProvincia: string): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.apiUrl}/distritos/${idProvincia}`);
  }
}
