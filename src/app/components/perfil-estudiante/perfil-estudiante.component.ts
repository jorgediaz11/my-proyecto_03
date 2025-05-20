import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  disabled: boolean;
}

@Component({
  // standalone: true,
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.css']
})
export class PerfilEstudianteComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/perfil-estudiante', disabled: false },                   // Ejemplo de ruta
    { label: 'Cursos', icon: 'book-open', route: '/productos', disabled: true },              // Deshabilitado
    { label: 'Evaluaciones', icon: 'file-alt', route: '/clientes', disabled: true },          // Deshabilitado
    { label: 'Progreso', icon: 'chart-line', route: '/configuracion', disabled: true },       // Deshabilitado
    { label: 'Mensajeria', icon: 'envelope', route: '/reportes', disabled: true },            // Deshabilitado
    { label: 'Cerrar Sesion', icon: 'sign-out-alt', route: '/opciones' , disabled: false },   // Cerrar sesión
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú
  }
}
