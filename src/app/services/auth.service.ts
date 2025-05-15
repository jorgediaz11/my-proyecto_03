import { Injectable } from '@angular/core';

// Importar el módulo de enrutamiento
@Injectable({
  providedIn: 'root'
})
export class AuthService {  //  Servicio de autenticación
  // Constructor del servicio de autenticación
  login(username: string, password: string): boolean {
    // Aquí puedes implementar la lógica de autenticación
    if (username === 'admin' && password === '1122') {
      return true; // Credenciales válidas
    }
    return false; // Credenciales inválidas
  }
}
