import { Component } from '@angular/core';

@Component({
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

  textoTitulo: string = 'Bienvenido a Nuestra Plataforma';
  textoDetalle: string = 'Detalle del Menu';
  isMenuOpen: any;

  onMenuItemClick(item: any, event: Event) {    // Método para manejar el clic en un elemento del menú
    event.preventDefault();
    this.textoTitulo = item.label;
    this.textoDetalle = `Has seleccionado el menú: ${item.label}`;
  }

}
