import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-perfil-admin-sec',
  templateUrl: './perfil-admin-sec.component.html',
  styleUrls: ['./perfil-admin-sec.component.css']
})
export class PerfilAdminSecComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/inicio' }, // Ejemplo de ruta
    { label: 'Docentes', icon: 'list', route: '/productos' },
    { label: 'Alumnos', icon: 'users', route: '/clientes' },
    { label: 'Cursos', icon: 'users', route: '/clientes' },
    { label: 'Calificaciones', icon: 'cogs', route: '/configuracion' },
    { label: 'Reportes', icon: 'chart-bar', route: '/reportes' },
    { label: 'Mensajeria', icon: 'chart-bar', route: '/reportes' },
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
