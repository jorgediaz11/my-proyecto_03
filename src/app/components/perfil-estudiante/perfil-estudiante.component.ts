import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.css']
})
export class PerfilEstudianteComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/inicio' }, // Ejemplo de ruta
    { label: 'Docentes', icon: 'list', route: '/productos' },
    { label: 'Alumnos', icon: 'users', route: '/clientes' },
    { label: 'Aulas', icon: 'users', route: '/clientes' },
    { label: 'Configuración', icon: 'cogs', route: '/configuracion' },
    { label: 'Reportes', icon: 'chart-bar', route: '/reportes' },
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}