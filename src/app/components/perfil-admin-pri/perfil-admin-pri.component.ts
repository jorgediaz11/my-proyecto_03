import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-perfil-admin-pri',
  templateUrl: './perfil-admin-pri.component.html',
  styleUrls: ['./perfil-admin-pri.component.css']
})
export class PerfilAdminPriComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/opciones' }, // Ejemplo de ruta
    { label: 'Colegios', icon: 'school', route: 'colegios' },
    { label: 'Docentes', icon: 'chalkboard-teacher', route: 'docentes' },
    { label: 'Estudiantes', icon: 'user-graduate', route: 'estudiantes' },
    { label: 'Materias', icon: 'book', route: 'materias' },
    { label: 'Aulas', icon: 'users', route: '/clientes' },
    { label: 'Configuración', icon: 'cogs', route: '/configuracion' },
    { label: 'Reportes', icon: 'chart-bar', route: '/reportes' },
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
