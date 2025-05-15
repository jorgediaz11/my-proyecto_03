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
    { label: 'Inicio', icon: 'home', route: '/opciones', disabled: false }, // Ejemplo de ruta
    { label: 'Cursos', icon: 'book-open', route: '/productos', disabled: true },
    { label: 'Evaluaciones', icon: 'file-alt', route: '/clientes', disabled: true },
    { label: 'Progreso', icon: 'chart-line', route: '/configuracion', disabled: true },
    { label: 'Mensajeria', icon: 'envelope', route: '/reportes', disabled: true },


  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
