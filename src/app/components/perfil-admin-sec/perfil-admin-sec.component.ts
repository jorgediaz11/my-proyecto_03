import { Component } from '@angular/core';  // Asegúrate de que el import sea correcto

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  disabled: boolean; // Added the missing 'disabled' property
}

@Component({
  // standalone: true,
  selector: 'app-perfil-admin-sec',   // Asegúrate de que el selector sea correcto
  templateUrl: './perfil-admin-sec.component.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./perfil-admin-sec.component.css'] // Asegúrate de que la ruta sea correcta
})
export class PerfilAdminSecComponent {
  // Lógica específica del componente
menuItems: MenuItem[] = [
  { label: 'Inicio', icon: 'home', route: '//perfil-admin-sec', disabled: false },          // Ejemplo de ruta
  { label: 'Docentes', icon: 'chalkboard-teacher', route: '/', disabled: true },            // Deshabilitado
  { label: 'Alumnos', icon: 'user-graduate', route: '/', disabled: true },                  // Deshabilitado
  { label: 'Cursos', icon: 'book', route: '/', disabled: true },                            // Deshabilitado
  { label: 'Calificaciones', icon: 'clipboard-list', route: '/', disabled: true },          // Deshabilitado
  { label: 'Reportes', icon: 'chart-bar', route: '/', disabled: true },                     // Deshabilitado
  { label: 'Mensajería', icon: 'envelope', route: '/', disabled: true },                    // Deshabilitado
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
