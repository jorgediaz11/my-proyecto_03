import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-docente',
  templateUrl: './perfil-docente.component.html',
  styleUrls: ['./perfil-docente.component.css']
})
export class PerfilDocenteComponent {
  // Aquí puedes agregar lógica específica para el perfil de docente
  constructor() {}

  // Método de ejemplo (puedes eliminarlo si no es necesario)
  onNavigateBack(): void {
    console.log('Regresando a la página de opciones...');
  }
}