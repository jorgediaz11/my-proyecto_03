import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-activar-libros',
    templateUrl: './activar-libros.component.html',
    styleUrls: ['./activar-libros.component.css'],
    imports: [FormsModule]
})
export class ActivarLibrosComponent {
  @Output() cerrar = new EventEmitter<void>();
  codigoLibro = '';
  codigosActivados = 0;

  get textoBoton() {
    return this.codigosActivados === 0 ? 'Activar' : 'Siguiente';
  }

  activarLibro() {
    // Simulación de activación de hasta 4 códigos
    alert('Código enviado: ' + this.codigoLibro);
    this.codigoLibro = '';
    if (this.codigosActivados < 4) {
      this.codigosActivados++;
    }
  }

  cerrarVentana() {
    this.cerrar.emit();
  }
}
