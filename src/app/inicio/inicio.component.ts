import { Component } from '@angular/core';

export interface MenuItem {
  label: string;
  route: string;
}

@Component({    // Asegúrate de que el selector sea único y descriptivo
  selector: 'app-inicio',   // Selector del componente, utilizado en las plantillas HTML
  templateUrl: './inicio.component.html', // Ruta al archivo de plantilla HTML del componente
  styleUrls: ['./inicio.component.css'] // Ruta al archivo de estilos CSS del componente
})
export class InicioComponent {
  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', route: '/' },              // Enlace a la página de inicio
    { label: 'Nosotros', route: '/nosotros' },    // Enlace a la página "Nosotros"
    { label: 'Niveles', route: '/niveles' },      // Enlace a la página "Niveles"
    { label: 'Catálogo', route: '/catalogo' },    // Enlace al catálogo
    { label: 'Noticias', route: '/noticias' },    // Enlace a la página de noticias
    { label: 'Acceso', route: '/login' },         // Enlace al login
    { label: 'Contáctenos', route: '/contacto' }  // Enlace a la página de contacto
  ];
  // Propiedades para el título y detalle del menú
  textoTitulo = 'Plataforma Eureka 01';
  textoDetalle = 'Detalle del Menu 01';
  isMenuOpen = false;  // Variable para controlar el estado del menú

  // Método para manejar el clic en un elemento del menú
  onMenuItemClick(item: MenuItem, event: Event) {
    event.preventDefault();
    this.textoTitulo = item.label;                                  // Actualiza el título del menú
    this.textoDetalle = `Has seleccionado el menú: ${item.label}`;  // Actualiza el título y detalle del menú
  }

}
