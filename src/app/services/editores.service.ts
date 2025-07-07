import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Editor {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  editorial?: string;
  // Agrega otros campos según tu modelo
}

@Injectable({
  providedIn: 'root'
})
export class EditoresService {
  private apiUrl = 'http://tu-servidor.com/api/editores'; // Cambia por tu endpoint real

  constructor(private http: HttpClient) {}

  getEditores(): Observable<Editor[]> {
    return this.http.get<Editor[]>(this.apiUrl);
  }

  getEditorPorId(id: number): Observable<Editor> {
    return this.http.get<Editor>(`${this.apiUrl}/${id}`);
  }

  crearEditor(editor: Editor): Observable<Editor> {
    return this.http.post<Editor>(this.apiUrl, editor);
  }

  actualizarEditor(id: number, editor: Editor): Observable<Editor> {
    return this.http.put<Editor>(`${this.apiUrl}/${id}`, editor);
  }

  eliminarEditor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
