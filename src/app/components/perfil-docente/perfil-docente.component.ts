import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-perfil-docente',
  templateUrl: './perfil-docente.component.html',
  styleUrls: ['./perfil-docente.component.css']
})
export class PerfilDocenteComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/inicio' }, // Ejemplo de ruta
    { label: 'Docentes', icon: 'list', route: '/productos' },
    { label: 'Cursos', icon: 'users', route: '/clientes' },
    { label: 'Aulas', icon: 'users', route: '/clientes' },
    { label: 'Calificaciones', icon: 'cogs', route: '/configuracion' },
    { label: 'Mensajeria', icon: 'chart-bar', route: '/reportes' },
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
