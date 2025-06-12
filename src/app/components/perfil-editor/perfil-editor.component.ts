import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  disabled: boolean;  // Added the missing 'disabled' property
}

@Component({
// standalone: true,
  selector: 'perfil-editor',
  templateUrl: './perfil-editor.component.html',
  styleUrl: './perfil-editor.component.css'
})
export class PerfilEditorComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '//perfil-editor', disabled: false },                   // Habilitado
    { label: 'Clases', icon: 'chalkboard-teacher', route: '/', disabled: true },              // Deshabilitado
    { label: 'Estudiantes', icon: 'user-graduate', route: '/', disabled: true },              // Deshabilitado
    { label: 'Calificaciones', icon: 'clipboard-list', route: '/', disabled: true },          // Deshabilitado
    { label: 'Reportes', icon: 'chart-bar', route: '/', disabled: true },                     // Deshabilitado
    { label: 'Mensajería', icon: 'envelope', route: '/', disabled: true },                    // Deshabilitado
    { label: 'Cerrar sesión', icon: 'sign-out-alt', route: '/opciones' , disabled: false },   // Cerrar sesión
  ];

  // isMenuOpen = true; // Controla el estado del menú (abierto/cerrado)

  // toggleMenu() {
  //   this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú
  // }

  constructor(private router: Router) {}

  irAlLogin() {
    this.router.navigate(['/login']); // Cambié 'irAlLogin' a 'irAlLogin'
  }

  irAInicio() {
    this.router.navigate(['/']);  // Cambié 'irAInicio' a 'irAInicio'
  }

  showUserMenu = false; // Cambié 'showUserMenu' a 'showUserMenu'
  showSidebar = true;   // Cambié 'showSidebar' a 'showSidebar'

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu; // Cambié 'toggleUserMenu' a 'toggleUserMenu'
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar; // Cambié 'toggleSidebar' a 'toggleSidebar'
  }


}
