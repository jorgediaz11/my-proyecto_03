import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'perfil-estudiante-muro',
  standalone: true,
  imports: [],
  templateUrl: './perfil-estudiante-muro.component.html',
  styleUrl: './perfil-estudiante-muro.component.css'
})
export class PerfilEstudianteMuroComponent {
  // Contadores
  totalColegios = 10;
  totalProfesores = 50;
  totalAlumnos = 200;
  totalCursos = 15;

  ngAfterViewInit() {
    console.log('ngAfterViewInit ejecutado');
    this.renderChart();
  }

  renderChart() {
  console.log('Inicializando el gráfico...');
  const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
  if (!ctx) {
    console.error('No se encontró el elemento canvas con ID "progressChart"');
    return;
  }

  new Chart(ctx, {
    type: 'bar',          // Tipo de gráfico 'bar'
    data: {
      labels: ['Inscritos', 'En Progreso', 'Completados'],
      datasets: [
        {
          label: 'Participantes',   // Cambié 'Participantes' a 'Participantes'
          data: [120, 60, 20],      // Cambié los datos a [120, 60, 20]
          backgroundColor: ['#28a745', '#ffc107', '#28a745']
        }
      ]
    },
    options: {
      responsive: true,   // Hacer el gráfico responsivo
      plugins: {          // Configuración de los plugins
        legend: {         // Ocultar la leyenda
          display: false  // Oculta la leyenda
        }
      }
    }
  });
}
}
