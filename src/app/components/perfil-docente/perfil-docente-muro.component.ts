import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { Chart } from 'chart.js';
import { UserStateService, UsuarioAutenticado } from '../../services/user-state.service';

// Interfaces para los datos del docente
interface Clase {
  id: number;
  nombre: string;
  grado: string;
  seccion: string;
  materia: string;
  horario: string;
  aula: string;
  totalEstudiantes: number;
  estudiantesPresentes: number;
  proximaClase: string;
  estado: 'activa' | 'completada' | 'programada';
}

interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  clase: string;
  grado: string;
  promedio: number;
  asistencia: number;
  estado: 'activo' | 'inactivo';
  ultimaEvaluacion?: number;
  comentarios?: string;
}

@Component({
    selector: 'app-perfil-docente-muro',
    templateUrl: './perfil-docente-muro.component.html',
    styleUrl: './perfil-docente-muro.component.css',
    standalone: false
})
export class PerfilDocenteMuroComponent implements OnInit, AfterViewInit {

  // ✅ Inyección de servicios
  private userStateService = inject(UserStateService);

  // ✅ Datos del usuario
  usuarioActual: UsuarioAutenticado | null = null;

  // ✅ Datos específicos del docente
  misClases: Clase[] = [
    {
      id: 1,
      nombre: 'Matemáticas 5A',
      grado: '5to',
      seccion: 'A',
      materia: 'Matemáticas',
      horario: 'Lun-Mie-Vie 08:00-09:30',
      aula: 'Aula 201',
      totalEstudiantes: 28,
      estudiantesPresentes: 26,
      proximaClase: '2025-07-11 08:00',
      estado: 'activa'
    },
    {
      id: 2,
      nombre: 'Álgebra 4B',
      grado: '4to',
      seccion: 'B',
      materia: 'Álgebra',
      horario: 'Mar-Jue 10:00-11:30',
      aula: 'Aula 203',
      totalEstudiantes: 25,
      estudiantesPresentes: 23,
      proximaClase: '2025-07-11 10:00',
      estado: 'activa'
    },
    {
      id: 3,
      nombre: 'Geometría 3C',
      grado: '3ro',
      seccion: 'C',
      materia: 'Geometría',
      horario: 'Lun-Vie 14:00-15:30',
      aula: 'Aula 105',
      totalEstudiantes: 30,
      estudiantesPresentes: 28,
      proximaClase: '2025-07-11 14:00',
      estado: 'activa'
    }
  ];

  misEstudiantes: Estudiante[] = [
    {
      id: 1,
      nombre: 'Ana',
      apellido: 'García López',
      clase: 'Matemáticas 5A',
      grado: '5to A',
      promedio: 18.5,
      asistencia: 95,
      estado: 'activo',
      ultimaEvaluacion: 19,
      comentarios: 'Excelente rendimiento'
    },
    {
      id: 2,
      nombre: 'Carlos',
      apellido: 'Rodríguez Silva',
      clase: 'Matemáticas 5A',
      grado: '5to A',
      promedio: 14.8,
      asistencia: 88,
      estado: 'activo',
      ultimaEvaluacion: 15,
      comentarios: 'Necesita refuerzo'
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'Martínez Cruz',
      clase: 'Álgebra 4B',
      grado: '4to B',
      promedio: 16.2,
      asistencia: 92,
      estado: 'activo',
      ultimaEvaluacion: 17,
      comentarios: 'Buen progreso'
    },
    {
      id: 4,
      nombre: 'José',
      apellido: 'López Herrera',
      clase: 'Geometría 3C',
      grado: '3ro C',
      promedio: 13.5,
      asistencia: 78,
      estado: 'activo',
      ultimaEvaluacion: 12,
      comentarios: 'Requiere atención'
    },
    {
      id: 5,
      nombre: 'Lucía',
      apellido: 'Fernández Mora',
      clase: 'Geometría 3C',
      grado: '3ro C',
      promedio: 17.8,
      asistencia: 98,
      estado: 'activo',
      ultimaEvaluacion: 18,
      comentarios: 'Estudiante destacada'
    }
  ];

  // ✅ Contadores dinámicos temporal
  get totalClases(): number {
    return this.misClases.length;
  }

  get clasesActivas(): number {
    return this.misClases.filter(clase => clase.estado === 'activa').length;
  }

  get totalEstudiantesAcargo(): number {
    return this.misClases.reduce((total, clase) => total + clase.totalEstudiantes, 0);
  }

  get promedioAsistencia(): number {
    const totalPresentes = this.misClases.reduce((total, clase) => total + clase.estudiantesPresentes, 0);
    const totalEstudiantes = this.misClases.reduce((total, clase) => total + clase.totalEstudiantes, 0);
    return totalEstudiantes > 0 ? Math.round((totalPresentes / totalEstudiantes) * 100) : 0;
  }

  get estudiantesEnRiesgo(): number {
    return this.misEstudiantes.filter(estudiante => estudiante.promedio < 14 || estudiante.asistencia < 80).length;
  }

  // ✅ Getters para el usuario
  get nombreDocente(): string {
    return this.usuarioActual?.nombre || 'Docente';
  }

  ngOnInit(): void {
    console.log('🚀 PerfilDocenteMuroComponent iniciando...');

    // ✅ Cargar datos del usuario actual
    this.usuarioActual = this.userStateService.getUsuarioActual();
    if (this.usuarioActual) {
      console.log('👤 Usuario docente cargado en muro:', this.usuarioActual);
    }
  }

  ngAfterViewInit() {
    console.log('📊 Inicializando gráficos del dashboard docente...');
    this.renderAsistenciaChart();
    this.renderRendimientoChart();
  }

  renderAsistenciaChart() {
    console.log('📈 Renderizando gráfico de asistencia por grado (barras agrupadas)...');
    const ctx = document.getElementById('asistenciaChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('❌ No se encontró el elemento canvas con ID "asistenciaChart"');
      return;
    }

    // Agrupar por grado y sumar presentes/ausentes
    const gradosUnicos = [...new Set(this.misClases.map(clase => clase.grado))]
      .sort((a, b) => {
        // Extrae el número del grado para ordenar
        const numA = parseInt(a.replace(/\D/g, ''), 10);
        const numB = parseInt(b.replace(/\D/g, ''), 10);
        return numA - numB;
      });

    const presentesPorGrado = gradosUnicos.map(grado =>
      this.misClases
        .filter(clase => clase.grado === grado)
        .reduce((sum, clase) => sum + clase.estudiantesPresentes, 0)
    );

    const ausentesPorGrado = gradosUnicos.map(grado =>
      this.misClases
        .filter(clase => clase.grado === grado)
        .reduce((sum, clase) => sum + (clase.totalEstudiantes - clase.estudiantesPresentes), 0)
    );

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: gradosUnicos,
        datasets: [
          {
            label: 'Presentes',
            data: presentesPorGrado,
            backgroundColor: '#28a745',
            borderColor: '#28a745',
            borderWidth: 1,
            barPercentage: 0.5,        // <-- Aquí
            categoryPercentage: 0.6    // <-- Aquí
          },
          {
            label: 'Ausentes',
            data: ausentesPorGrado,
            backgroundColor: '#dc3545',
            borderColor: '#dc3545',
            borderWidth: 1,
            barPercentage: 0.5,
            categoryPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Asistencia por Grado' }
        },
        scales: {
          x: {
            type: 'category',
            title: { display: true, text: 'Grado' }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });


  }


  renderRendimientoChart() {
    console.log('📊 Renderizando gráfico de rendimiento (barras horizontales)...');
    const ctx = document.getElementById('rendimientoChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('❌ No se encontró el elemento canvas con ID "rendimientoChart"');
      return;
    }

    // Agrupar estudiantes por rango de notas
    const excelente = this.misEstudiantes.filter(e => e.promedio >= 17).length;
    const bueno = this.misEstudiantes.filter(e => e.promedio >= 14 && e.promedio < 17).length;
    const regular = this.misEstudiantes.filter(e => e.promedio >= 11 && e.promedio < 14).length;
    const deficiente = this.misEstudiantes.filter(e => e.promedio < 11).length;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Excelente (17-20)', 'Bueno (14-16)', 'Regular (11-13)', 'Deficiente (0-10)'],
        datasets: [{
          label: 'Cantidad de Estudiantes',
          data: [excelente, bueno, regular, deficiente],
          backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545'],
          borderWidth: 2,
          barPercentage: 0.5,
          categoryPercentage: 0.6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Rendimiento de Estudiantes' }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: 'Cantidad de Estudiantes' }
          },
          y: {
            title: { display: true, text: 'Rango de Promedio' }
          }
        }
      }
    });

  }

  // ✅ Métodos de utilidad
  getPromedioColor(promedio: number): string {
    if (promedio >= 17) return 'text-green-600';
    if (promedio >= 14) return 'text-blue-600';
    if (promedio >= 11) return 'text-yellow-600';
    return 'text-red-600';
  }

  getPromedioIcon(promedio: number): string {
    if (promedio >= 17) return '🌟';
    if (promedio >= 14) return '👍';
    if (promedio >= 11) return '⚠️';
    return '❌';
  }

  getAsistenciaColor(asistencia: number): string {
    if (asistencia >= 90) return 'text-green-600';
    if (asistencia >= 80) return 'text-yellow-600';
    return 'text-red-600';
  }

  getEstadoClaseIcon(estado: string): string {
    switch (estado) {
      case 'activa': return '🟢';
      case 'completada': return '✅';
      case 'programada': return '🔵';
      default: return '⚪';
    }
  }

  getClasePorcentajeAsistencia(clase: Clase): number {
    return Math.round((clase.estudiantesPresentes / clase.totalEstudiantes) * 100);
  }

  formatearHorario(horario: string): string {
    return horario.replace('-', ' - ');
  }

  getEstudiantesPorClase(nombreClase: string): Estudiante[] {
    return this.misEstudiantes.filter(estudiante => estudiante.clase === nombreClase);
  }

  // ✅ Método para filtrar estudiantes en riesgo
  getEstudiantesEnRiesgo(): Estudiante[] {
    return this.misEstudiantes.filter(estudiante =>
      estudiante.promedio < 14 || estudiante.asistencia < 80
    );
  }
}
