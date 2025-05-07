import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-admin-pri',
  templateUrl: './perfil-admin-pri.component.html',
  styleUrls: ['./perfil-admin-pri.component.css']
})
export class PerfilAdminPriComponent {
  selectedOption: string = 'opcion1'; // Opción seleccionada por defecto

  selectOption(option: string) {
    this.selectedOption = option;
  }
}