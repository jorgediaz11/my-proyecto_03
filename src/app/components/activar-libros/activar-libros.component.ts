import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivarLibroService } from '../../services/activar-libro.service';

@Component({
  selector: 'app-activar-libros',
  templateUrl: './activar-libros.component.html',
  styleUrls: ['./activar-libros.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ActivarLibrosComponent {
  @Output() cerrar = new EventEmitter<void>();
  codigoLibro = '';
  codigosActivados = 0;
  mensaje: string = '';
  // Ejemplo de datos, reemplaza por los reales del formulario
  libroData = {
    id_colegio: 16615,
    id_estudiante: 251,
    id_curso: 2,
    codigo_libro: '4CKZ-QOWP-EFB5',
    estado: true
  };

  constructor(private activarLibroService: ActivarLibroService) {}

  activarLibro() {
    this.activarLibroService.activarLibroEstado(this.libroData).subscribe({
      next: (resp) => {
        this.mensaje = resp.message;
      },
      error: () => {
        this.mensaje = 'Error al activar el libro';
      }
    });
  }

  get textoBoton() {
    return this.codigosActivados === 0 ? 'Activar' : 'Siguiente';
  }

  // activarLibro() {
  //   // Simulación de activación de hasta 4 códigos
  //   alert('Código enviado: ' + this.codigoLibro);
  //   this.codigoLibro = '';
  //   if (this.codigosActivados < 4) {
  //     this.codigosActivados++;
  //   }
  // }



  cerrarVentana() {
    this.cerrar.emit();
  }
}
