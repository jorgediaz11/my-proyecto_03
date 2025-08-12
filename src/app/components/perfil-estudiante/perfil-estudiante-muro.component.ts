import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { Chart } from 'chart.js';
import { UserStateService, UsuarioAutenticado } from '../../services/user-state.service';
import { CommonModule } from '@angular/common';
import { ActivarLibrosComponent } from '../activar-libros/activar-libros.component';
// Interfaces para los datos del estudiante
interface Curso {
  id: number;
  nombre: string;
  profesor: string;
  progreso: number;
  ultimaClase: string;
  proximaClase: string;
  estado: 'activo' | 'completado' | 'pendiente';
}

interface Evaluacion {
  id: number;
  titulo: string;
  curso: string;
  fecha: string;
  tipo: 'examen' | 'tarea' | 'proyecto';
  estado: 'pendiente' | 'entregado' | 'calificado';
  nota?: number;
}

@Component({
    selector: 'app-perfil-estudiante-muro',
    templateUrl: './perfil-estudiante-muro.component.html',
    styleUrls: ['./perfil-estudiante-muro.component.css'],
    imports: [CommonModule, ActivarLibrosComponent]
})

export class PerfilEstudianteMuroComponent implements OnInit, AfterViewInit {
  // Modal Activar Libro
  mostrarModalActivarLibro = false;

  onActivarLibro() {
    this.mostrarModalActivarLibro = true;
  }

  cerrarModalActivarLibro() {
    this.mostrarModalActivarLibro = false;
  }

  // ✅ Inyección de servicios
  private userStateService = inject(UserStateService);

  // ✅ Datos del usuario
  usuarioActual: UsuarioAutenticado | null = null;

  // ✅ Datos específicos del estudiante
  misCursos: Curso[] = [
    {
      id: 1,
      nombre: 'Matemáticas Avanzadas',
      profesor: 'Prof. García',
      progreso: 75,
      ultimaClase: 'Ecuaciones Diferenciales',
      proximaClase: '2025-07-12 08:00',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Historia Universal',
      profesor: 'Prof. Rodríguez',
      progreso: 60,
      ultimaClase: 'Segunda Guerra Mundial',
      proximaClase: '2025-07-11 10:00',
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Química Orgánica',
      profesor: 'Prof. Martínez',
      progreso: 45,
      ultimaClase: 'Compuestos Aromáticos',
      proximaClase: '2025-07-13 14:00',
      estado: 'activo'
    },
    {
      id: 4,
      nombre: 'Literatura Española',
      profesor: 'Prof. López',
      progreso: 90,
      ultimaClase: 'Generación del 98',
      proximaClase: '2025-07-12 11:00',
      estado: 'activo'
    }
  ];

  proximasEvaluaciones: Evaluacion[] = [
    {
      id: 1,
      titulo: 'Examen Parcial - Cálculo Integral',
      curso: 'Matemáticas Avanzadas',
      fecha: '2025-07-15',
      tipo: 'examen',
      estado: 'pendiente'
    },
    {
      id: 2,
      titulo: 'Ensayo - Revolución Francesa',
      curso: 'Historia Universal',
      fecha: '2025-07-18',
      tipo: 'tarea',
      estado: 'pendiente'
    },
    {
      id: 3,
      titulo: 'Laboratorio - Síntesis Orgánica',
      curso: 'Química Orgánica',
      fecha: '2025-07-20',
      tipo: 'proyecto',
      estado: 'pendiente'
    }
  ];

  // ✅ Contadores dinámicos
  get totalCursos(): number {
    return this.misCursos.length;
  }

  get cursosActivos(): number {
    return this.misCursos.filter(curso => curso.estado === 'activo').length;
  }

  get progresoPromedio(): number {
    const promedio = this.misCursos.reduce((sum, curso) => sum + curso.progreso, 0) / this.misCursos.length;
    return Math.round(promedio);
  }

  get evaluacionesPendientes(): number {
    return this.proximasEvaluaciones.filter(evaluacion => evaluacion.estado === 'pendiente').length;
  }

  // ✅ Getters para el usuario
  get nombreEstudiante(): string {
    return this.usuarioActual?.nombre || 'Estudiante';
  }

  ngOnInit(): void {
    console.log('🚀 PerfilEstudianteMuroComponent iniciando...');

    // ✅ Cargar datos del usuario actual
    this.usuarioActual = this.userStateService.getUsuarioActual();
    if (this.usuarioActual) {
      console.log('👤 Usuario cargado en muro:', this.usuarioActual);
    }
  }

  ngAfterViewInit() {
    console.log('📊 Inicializando gráficos del dashboard estudiantil...');
    this.renderProgressChart();
    this.renderEvaluacionesChart();
  }

  renderProgressChart() {
    console.log('📈 Renderizando gráfico de progreso...');
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('❌ No se encontró el elemento canvas con ID "progressChart"');
      return;
    }

    const labels = this.misCursos.map(curso => curso.nombre);
    const data = this.misCursos.map(curso => curso.progreso);
    const colors = this.misCursos.map(curso => curso.progreso >= 70 ? '#28a745' : curso.progreso >= 40 ? '#ffc107' : '#dc3545');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Progreso (%)',
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  renderEvaluacionesChart() {
    console.log('📋 Renderizando gráfico de evaluaciones...');
    const ctx = document.getElementById('evaluacionesChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('❌ No se encontró el elemento canvas con ID "evaluacionesChart"');
      return;
    }

    const tiposCount = {
      examen: this.proximasEvaluaciones.filter(e => e.tipo === 'examen').length,
      tarea: this.proximasEvaluaciones.filter(e => e.tipo === 'tarea').length,
      proyecto: this.proximasEvaluaciones.filter(e => e.tipo === 'proyecto').length
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Exámenes', 'Tareas', 'Proyectos'],
        datasets: [{
          data: [tiposCount.examen, tiposCount.tarea, tiposCount.proyecto],
          backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // ✅ Métodos de utilidad
  getProgresoColor(progreso: number): string {
    if (progreso >= 70) return 'text-green-600';
    if (progreso >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  getProgresoIcon(progreso: number): string {
    if (progreso >= 70) return '✅';
    if (progreso >= 40) return '⚠️';
    return '❌';
  }

  getTipoEvaluacionIcon(tipo: string): string {
    switch (tipo) {
      case 'examen': return '📝';
      case 'tarea': return '📋';
      case 'proyecto': return '🎯';
      default: return '📄';
    }
  }

  formatearFecha(fecha: string): string {
    const dateObj = new Date(fecha);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
