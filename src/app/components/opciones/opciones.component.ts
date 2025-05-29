import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Importar el módulo de enrutamiento
@Component({
  selector: 'app-opciones',                 // Cambié 'app-opciones' a 'app-opciones'
  templateUrl: './opciones.component.html', // Cambié 'opciones.component.html' a 'opciones.component.html'
  styleUrls: ['./opciones.component.css']   // Cambié 'opciones.component.css' a 'opciones.component.css'
})
export class OpcionesComponent {
  // Lógica específica del componente
  constructor(private router: Router) {}

  irAlLogin() {
    this.router.navigate(['/login']);
  }

  irAInicio() {
    this.router.navigate(['/']);
  }

  showUserMenu = false;
  showSidebar = true;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

}
