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
    { label: 'Acceso', route: '/login' }, // Enlace al login
    { label: 'Contáctenos', route: '/contacto' }
  ];

  textoSeleccionado: string = 'Bienvenido a Nuestra Plataforma';

  onMenuItemClick(item: any, event: Event) {
    event.preventDefault();
    this.textoSeleccionado = item.label;
  }

}
