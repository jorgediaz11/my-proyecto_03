import { Component } from '@angular/core';  // Importa el decorador Component de Angular

interface MenuItem {
  label: string;      // Cambié 'label' a 'label'
  icon: string;       // Cambié 'icon' a 'icon'
  route: string;      // Cambié 'route' a 'route'
  disabled: boolean;  // Added the missing 'disabled' property
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
    { label: 'Inicio', icon: 'home', route: '/perfil-admin-pri', disabled: false },                   // Ruta al muro del perfil
    { label: 'Usuarios', icon: 'user-friends', route: 'usuarios' , disabled: false },         // Cambié 'usuarios' a 'usuarios'
    { label: 'Colegios', icon: 'school', route: 'colegios', disabled: false  },               // Cambié 'colegios' a 'colegios'
    { label: 'Docentes', icon: 'chalkboard-teacher', route: 'docentes', disabled: false  },   // Cambié 'docentes' a 'docentes'
    { label: 'Estudiantes', icon: 'user-graduate', route: 'estudiantes', disabled: false  },  // Cambié 'estudiantes' a 'estudiantes'
    { label: 'Académico', icon: 'book', route: 'academico', disabled: false  },               // Cambié 'academico' a 'academico'
    { label: 'Reportes', icon: 'chart-bar', route: 'reportes', disabled: false  },            // Cambié 'clientes' a 'reportes'
    { label: 'Auditoría', icon: 'clipboard-check', route: 'auditoria', disabled: false  },    // Cambié 'configuracion' a 'configuracion'
    { label: 'Perfil', icon: 'user-circle', route: 'perfil', disabled: false  },              // Cambié 'perfil' a 'perfil'
    { label: 'Cerrar Sesión', icon: 'sign-out-alt', route: '/opciones' , disabled: false },   // Cerrar sesión
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  // Método para manejar el evento de clic en un elemento del menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú
  }
}
