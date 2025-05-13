import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-perfil-familia',
  templateUrl: './perfil-familia.component.html',
  styleUrls: ['./perfil-familia.component.css']
})
export class PerfilFamiliaComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/inicio' }, // Ejemplo de ruta
    { label: 'Progreso', icon: 'list', route: '/productos' },
    { label: 'Comunicados', icon: 'cogs', route: '/configuracion' },
    { label: 'Mensajeria', icon: 'chart-bar', route: '/reportes' },
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
