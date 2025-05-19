import { Component } from '@angular/core';

@Component({  // Cambié 'standalone: true' a 'standalone: false'
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {  // Cambié 'UsuariosComponent' a 'UsuariosComponent'
  usuarios = [
    { nombre: 'Juan Pérez', email: 'juan.perez@example.com' },
    { nombre: 'María López', email: 'maria.lopez@example.com' },
    { nombre: 'Carlos García', email: 'carlos.garcia@example.com' }
  ];

  activeTab = 'listado'; // Pestaña activa por defecto

  agregarUsuario(nombre: string, email: string) {
    const nuevoUsuario = { nombre, email };
    this.usuarios.push(nuevoUsuario); // Agregar el nuevo usuario al arreglo
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
