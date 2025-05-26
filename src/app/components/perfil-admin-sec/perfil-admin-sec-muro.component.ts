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

  // Datos para los gráficos
  // Datos simulados
  primariaGrados = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  primariaAlumnos = [30, 28, 32, 27, 29, 31];
  secundariaGrados = ['1ro', '2do', '3ro', '4to', '5to'];
  secundariaAlumnos = [25, 26, 24, 23, 22];

  ngAfterViewInit() {
    console.log('ngAfterViewInit ejecutado');
    this.renderCharts();
  }

  renderCharts() {
    // Gráfico 01: Barras verticales - Alumnos por grado de primaria
    new Chart('chartPrimariaBar', {
      type: 'bar',
      data: {
        labels: this.primariaGrados,
        datasets: [{
          label: 'Alumnos',
          data: this.primariaAlumnos,
          backgroundColor: '#4EAD4F'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // Gráfico 02: Lineal - Alumnos por grado de primaria
    new Chart('chartPrimariaLine', {
      type: 'line',
      data: {
        labels: this.primariaGrados,
        datasets: [{
          label: 'Alumnos',
          data: this.primariaAlumnos,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // Gráfico 03: Barras verticales - Alumnos por grado de secundaria
    new Chart('chartSecundariaBar', {
      type: 'bar',
      data: {
        labels: this.secundariaGrados,
        datasets: [{
          label: 'Alumnos',
          data: this.secundariaAlumnos,
          backgroundColor: '#3B82F6'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // Gráfico 04: Lineal - Alumnos por grado de secundaria
    new Chart('chartSecundariaLine', {
      type: 'line',
      data: {
        labels: this.secundariaGrados,
        datasets: [{
          label: 'Alumnos',
          data: this.secundariaAlumnos,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(59,130,246,0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // Gráfico 05: Pie - Población por grado de primaria
    new Chart('chartPrimariaPie', {
      type: 'pie',
      data: {
        labels: this.primariaGrados,
        datasets: [{
          data: this.primariaAlumnos,
          backgroundColor: [
            '#4EAD4F', '#22c55e', '#a3e635', '#bef264', '#facc15', '#fbbf24'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    // Gráfico 06: Pie - Población por grado de secundaria
    new Chart('chartSecundariaPie', {
      type: 'pie',
      data: {
        labels: this.secundariaGrados,
        datasets: [{
          data: this.secundariaAlumnos,
          backgroundColor: [
            '#3B82F6', '#2563eb', '#60a5fa', '#93c5fd', '#a5b4fc'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

}
