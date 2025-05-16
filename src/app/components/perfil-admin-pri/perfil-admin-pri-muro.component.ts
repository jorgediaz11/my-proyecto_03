import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-perfil-admin-pri-muro',
  standalone: true,
  imports: [],
  templateUrl: './perfil-admin-pri-muro.component.html',
  styleUrls: ['./perfil-admin-pri-muro.component.css']
})
export class PerfilAdminPriMuroComponent implements AfterViewInit {
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
    // Verifica si el elemento canvas existe
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

    // Verifica si Chart.js está disponible
    // new Chart(ctx, {
    //   type: 'bar',
    //   data: {
    //     labels: ['Inscritos', 'En Progreso', 'Completados'],
    //     datasets: [
    //       {
    //         label: 'Participantes',
    //         data: [120, 60, 20],
    //         backgroundColor: ['#dc3545', '#ffc107', '#007bff']
    //       }
    //     ]
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         display: false // Oculta la leyenda
    //       },
    //       title: {
    //         display: true,  // Muestra el título
    //         text: 'Progreso de Participantes'
    //       }
    //     },
    //     scales: {
    //       x: {
    //         title: {
    //           display: false,  // Muestra el título del eje X
    //           text: 'Estado'
    //         },
    //         ticks: {
    //           align: 'center'
    //         }
    //       },
    //       y: {
    //         beginAtZero: true,  // Comienza desde cero
    //         max: 200, // Valor máximo del eje Y
    //         title: {
    //           display: true,
    //           text: 'Cantidad'
    //         }
    //       }
    //     }
    //   }
    // });
    // Verifica si el gráfico se ha creado correctamente
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Inscritos', 'En Progreso', 'Completados'],
    datasets: [
      {
        label: 'Participantes',
        data: [120, 60, 20],
        backgroundColor: ['#dc3545', '#ffc107', '#007bff'],
        borderColor: ['#a71d2a', '#b38600', '#145c32'], // Puedes ajustar los colores del borde
        borderWidth: 1, // Grosor del borde
        barThickness: 40 // Ajusta este valor para la mitad del grosor por defecto (prueba con 15 o menos)
      }
    ]
  },
  options: {
    responsive: true,
    indexAxis: 'y', // <-- Esto hace que las barras sean horizontales
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Progreso de Participantes'
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 200,
        title: {
          display: false,
          text: 'Cantidad'
        }
      },
      y: {
        title: {
          display: false,
          text: 'Estado'
        },
        ticks: {
          // align: 'center'
          align: 'start' // Alinea los labels a la izquierda
        }
      }
    }
  }
});


  }
}
