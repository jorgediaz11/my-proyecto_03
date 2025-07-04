import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  disabled: boolean;  // Propiedad para indicar si el elemento está deshabilitado
}

@Component({
  // standalone: true,
  selector: 'app-perfil-familia',
  templateUrl: './perfil-familia.component.html',
  styleUrls: ['./perfil-familia.component.css']
})
export class PerfilFamiliaComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '//perfil-familia', disabled: false },                   // Ejemplo de ruta
    { label: 'Progreso', icon: 'chart-line', route: '/productos', disabled: true },           // Deshabilitado
    { label: 'Comunicados', icon: 'bullhorn', route: '/configuracion', disabled: true },      // Deshabilitado
    { label: 'Mensajería', icon: 'envelope', route: '/reportes', disabled: true },            // Deshabilitado
    { label: 'Cerrar sesión', icon: 'sign-out-alt', route: '/opciones' , disabled: false },   // Cerrar sesión
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú
  }

  showUserMenu = false; // Cambié 'showUserMenu' a 'showUserMenu'
  showSidebar = true;   // Cambié 'showSidebar' a 'showSidebar'

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

}
