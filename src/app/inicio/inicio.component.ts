import { Component } from '@angular/core';

@Component({    // Asegúrate de que el selector sea único y descriptivo
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  // Lógica específica del componente
  menuItems = [
    { label: 'Inicio', route: '/' },
    { label: 'Nosotros', route: '/nosotros' },
    { label: 'Niveles', route: '/niveles' },
    { label: 'Catálogo', route: '/catalogo' },
    { label: 'Noticias', route: '/noticias' },
    { label: 'Acceso', route: '/login' },         // Enlace al login
    { label: 'Contáctenos', route: '/contacto' }
  ];
  // Propiedades para el título y detalle del menú
  textoTitulo: string = 'Plataforma Eureka';
  textoDetalle: string = 'Detalle del Menu';
  isMenuOpen: any;  // Variable para controlar el estado del menú

  // Método para manejar el clic en un elemento del menú
  onMenuItemClick(item: any, event: Event) {
    event.preventDefault();
    this.textoTitulo = item.label;
    this.textoDetalle = `Has seleccionado el menú: ${item.label}`;
  }

}
