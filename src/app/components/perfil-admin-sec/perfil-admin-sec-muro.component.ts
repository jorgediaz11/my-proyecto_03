import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'perfil-admin-sec-muro',
  standalone: true,
  imports: [],
  templateUrl: './perfil-admin-sec-muro.component.html',
  styleUrl: './perfil-admin-sec-muro.component.css'
})
export class PerfilAdminSecMuroComponent {
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
    type: 'bar',
    data: {
      labels: ['Inscritos', 'En Progreso', 'Completados'],
      datasets: [
        {
          label: 'Participantes',
          data: [120, 60, 20],
          backgroundColor: ['#007bff', '#ffc107', '#28a745']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}
}
