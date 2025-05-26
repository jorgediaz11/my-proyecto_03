import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-perfil-admin-pri-muro',                  // Cambié 'app-perfil-admin-pri-muro' a 'app-perfil-admin-pri-muro'
  templateUrl: './perfil-admin-pri-muro.component.html',  // Cambié 'perfil-admin-pri-muro.component.html' a 'perfil-admin-pri-muro.component.html'
  styleUrls: ['./perfil-admin-pri-muro.component.css']    // Cambié 'perfil-admin-pri-muro.component.css' a 'perfil-admin-pri-muro.component.css'
})
export class PerfilAdminPriMuroComponent implements AfterViewInit {
  // Contadores
  totalColegios = 10;
  totalProfesores = 50;
  totalAlumnos = 200;
  totalCursos = 15;

  ngAfterViewInit() {
    this.renderProgressChart();
    this.renderAulasChart();
  }

  renderProgressChart() {
    const canvas = document.getElementById('progressChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('No se encontró el elemento canvas con ID "progressChart"');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D del canvas');
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
            backgroundColor: ['#dc3545', '#ffc107', '#007bff'],
            borderColor: ['#a71d2a', '#b38600', '#145c32'],
            borderWidth: 1,
            barThickness: 40
          }
        ]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }, // Ocultar leyenda
          title: { display: false, text: 'Progreso de Participantes' }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 200,
            title: { display: false, text: 'Cantidad' }
          },
          y: {
            title: { display: false, text: 'Estado' },
            ticks: { align: 'start' }
          }
        }
      }
    });
  }

  renderAulasChart() {
    const canvas = document.getElementById('aulasChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('No se encontró el elemento canvas con ID "aulasChart"');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D del canvas');
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          '1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'
        ],
        datasets: [
          {
            label: 'Registrados',
            data: [8, 15, 12, 20, 18, 10],
            backgroundColor: '#4EAD4F'
          },
          {
            label: 'Pendientes',
            data: [12, 5, 8, 0, 2, 10],
            backgroundColor: '#F59E42'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false, text: 'Alumnos por Aula (Primaria)' }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });
  }
}
