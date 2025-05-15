import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  disabled: boolean; // Added the missing 'disabled' property
}

@Component({
  // standalone: true,
  selector: 'app-perfil-admin-sec',
  templateUrl: './perfil-admin-sec.component.html',
  styleUrls: ['./perfil-admin-sec.component.css']
})
export class PerfilAdminSecComponent {
  // Lógica específica del componente
menuItems: MenuItem[] = [
  { label: 'Inicio', icon: 'home', route: '/opciones', disabled: false },        // Ejemplo de ruta
  { label: 'Docentes', icon: 'chalkboard-teacher', route: '/', disabled: true }, // Deshabilitado
  { label: 'Alumnos', icon: 'user-graduate', route: '/', disabled: true }, // Deshabilitado
  { label: 'Cursos', icon: 'book', route: '/', disabled: true }, // Deshabilitado
  { label: 'Calificaciones', icon: 'clipboard-list', route: '/', disabled: true }, // Deshabilitado
  { label: 'Reportes', icon: 'chart-bar', route: '/', disabled: true }, // Deshabilitado
  { label: 'Mensajeria', icon: 'envelope', route: '/', disabled: true }, // Deshabilitado
];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
