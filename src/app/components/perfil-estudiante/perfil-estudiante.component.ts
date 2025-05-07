import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.css']
})
export class PerfilEstudianteComponent {
  // Aquí puedes agregar lógica específica para el perfil de estudiante
  constructor() {}

  // Método de ejemplo para manejar eventos (opcional)
  onNavigateBack(): void {
    console.log('Regresando a la página de opciones...');
  }
}