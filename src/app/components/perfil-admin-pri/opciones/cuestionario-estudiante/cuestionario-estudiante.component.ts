
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cuestionario-estudiante',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './cuestionario-estudiante.component.html',
  styleUrls: ['./cuestionario-estudiante.component.css']
})
export class CuestionarioEstudianteComponent {
  enunciados = ['2 + 3', '6 - 2', '4 + 4'];
  opciones = ['5', '4', '8'];
  valores_respuesta = [
    '5',    // Pregunta 01
    '6',    // Pregunta 02
    '3',    // Pregunta 03
    '8',    // Pregunta 04
    // Pregunta 05: Emparejamiento
    [
      { enunciado: '5', opcion: 'Cinco' },
      { enunciado: '3', opcion: 'Tres' },
      { enunciado: '8', opcion: 'Ocho' }
    ],
    // Pregunta 06: Emparejamiento
    [
      { enunciado: '2 + 3', opcion: '5' },
      { enunciado: '6 - 2', opcion: '4' },
      { enunciado: '4 + 4', opcion: '8' }
    ]
  ];

  dragOverIdx: number | null = null;
  enviarIntentado = false;
  respuesta1: string = '';
  respuesta2: string = '';
  respuesta3: string = '';
  respuesta4: string = '';
  relacion5: string[] = ['', '', ''];
  respuestas: (number | null)[] = Array(this.enunciados.length).fill(null);
  explicacion7: string = '';
  explicacion8: string = '';
  archivo9: File | null = null;
  archivo10: File | null = null;

  avisos: string[] = Array(this.enunciados.length).fill('');

  isPair(obj: any): obj is { enunciado: string; opcion: string } {
    return obj && typeof obj === 'object' && 'enunciado' in obj && 'opcion' in obj;
  }

  validarEmparejamientos(): void {
    this.avisos = this.enunciados.map((_, i) => {
      if (!this.isValidRespuesta(this.respuestas[i])) {
        return 'Debes emparejar esta operación.';
      }
      return '';
    });
  }

  faltanEmparejamientos(): boolean {
    return this.respuestas.some(r => r === null || r === undefined);
  }

  validarRespuestas(): boolean[] {
    this.enviarIntentado = true;
    this.validarEmparejamientos(); // ← Aquí
    console.log('Respuestas:', this.respuestas); // Verifica el estado

    // Aquí puedes agregar la lógica de validación y mostrar mensajes
    // Ejemplo: si algún campo está vacío, no continuar
    if (
      !this.respuesta1 ||
      !this.respuesta2 ||
      !this.respuesta3 ||
      !this.respuesta4 ||
      this.relacion5.some(r => !r) ||
      this.respuestas.some(r => r === null) ||
      !this.explicacion7 ||
      !this.explicacion8 ||
      !this.archivo9 ||
      !this.archivo10      
    ) {
      // Mostrar mensaje de error o resaltar campos
      return [];
    }
    // ...lógica de validación y envío...
    const resultados: boolean[] = [];

    // Construir las respuestas del estudiante
    const estudianteRespuestas = [
      this.respuesta1,
      this.respuesta2,
      this.respuesta3,
      this.respuesta4,
      this.relacion5.map((opcion, idx) => ({ enunciado: this.opciones[idx], opcion })),
      this.enunciados.map((enunciado, idx) => ({ enunciado, opcion: this.opciones[this.respuestas[idx] ?? 0] }))
    ];

    // Preguntas 1 a 4 (respuestas directas)
    for (let i = 0; i < 4; i++) {
      resultados.push(estudianteRespuestas[i] === this.valores_respuesta[i]);
    }

    // Preguntas 5 y 6 (emparejamiento)
    const emparejamientoEstudiante5 = estudianteRespuestas[4];
    const emparejamientoCorrecto5 = this.valores_respuesta[4];
    const correcto5 = Array.isArray(emparejamientoEstudiante5) && Array.isArray(emparejamientoCorrecto5)
      ? this.compararEmparejamientos(emparejamientoEstudiante5, emparejamientoCorrecto5)
      : false;

    const emparejamientoEstudiante6 = estudianteRespuestas[5];
    const emparejamientoCorrecto6 = this.valores_respuesta[5];
    const correcto6 = Array.isArray(emparejamientoEstudiante6) && Array.isArray(emparejamientoCorrecto6)
      ? this.compararEmparejamientos(emparejamientoEstudiante6, emparejamientoCorrecto6)
      : false;

    return resultados;
  }

  private compararEmparejamientos(arrEst: any[], arrCor: any[]): boolean {
    if (arrEst.length !== arrCor.length) return false;
    for (let j = 0; j < arrCor.length; j++) {
      const est = arrEst[j];
      const cor = arrCor[j];
      if (
        !this.isPair(est) || !this.isPair(cor) ||
        est.enunciado !== cor.enunciado ||
        est.opcion !== cor.opcion
      ) {
        return false;
      }
    }
    return true;
  }

  onDrop(event: any, enunciadoIdx: number): void {
    const opcionIdx = event.item.data;
    this.respuestas[enunciadoIdx] = opcionIdx;
    console.log('Respuestas:', this.respuestas); // Para depuración
  }

  isValidRespuesta(idx: number | null | undefined): boolean {
    return typeof idx === 'number' && idx >= 0 && idx < this.opciones.length;
  }

  onArchivoChange(event: any, num: number) {
    const file = event.target.files[0];
    if (num === 9) this.archivo9 = file;
    if (num === 10) this.archivo10 = file;
  }

  isRelacionIncompleta(): boolean {
    return this.enviarIntentado && this.respuestas.some(r => r === null);
  }

  resetearValores(): void {
    this.respuesta1 = '';
    this.respuesta2 = '';
    this.respuesta3 = '';
    this.respuesta4 = '';
    this.relacion5 = Array(3).fill('');
    this.respuestas = Array(this.enunciados.length).fill(null);
    this.explicacion7 = '';
    this.explicacion8 = '';
    this.archivo9 = null;
    this.archivo10 = null;
    this.enviarIntentado = false;
  }

}
