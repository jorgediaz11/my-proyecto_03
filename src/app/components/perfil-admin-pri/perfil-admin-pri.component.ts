import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  // standalone: true,
  selector: 'app-perfil-admin-pri',
  templateUrl: './perfil-admin-pri.component.html',
  styleUrls: ['./perfil-admin-pri.component.css']
})
export class PerfilAdminPriComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/opciones' },        // Ejemplo de ruta
    { label: 'Usuarios', icon: 'users', route: 'usuarios' },      // Cambié 'usuarios' a 'usuarios'
    { label: 'Colegios', icon: 'school', route: 'colegios' },     // Cambié 'colegios' a 'colegios'
    { label: 'Docentes', icon: 'chalkboard-teacher', route: 'docentes' }, // Cambié 'docentes' a 'docentes'
    { label: 'Estudiantes', icon: 'user-graduate', route: 'estudiantes' },  // Cambié 'estudiantes' a 'estudiantes'
    { label: 'Academico', icon: 'book', route: 'academico' },     // Cambié 'academico' a 'academico'
    { label: 'Reportes', icon: 'users', route: 'reportes' },      // Cambié 'clientes' a 'reportes'
    { label: 'Auditoria', icon: 'cogs', route: 'auditoria' }, // Cambié 'configuracion' a 'configuracion'
    { label: 'Perfil', icon: 'chart-bar', route: 'perfil' },      // Cambié 'perfil' a 'perfil'
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  // Método para manejar el evento de clic en un elemento del menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
