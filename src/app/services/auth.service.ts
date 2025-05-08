import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Constructor del servicio de autenticación
  login(username: string, password: string): boolean {
    // Aquí puedes implementar la lógica de autenticación
    if (username === 'admin' && password === '1234') {
      return true; // Credenciales válidas
    }
    return false; // Credenciales inválidas
  }
}