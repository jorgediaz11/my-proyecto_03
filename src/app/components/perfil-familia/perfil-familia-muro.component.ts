import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { UserStateService } from '../../services/user-state.service';

// Interfaces para el dashboard de familia
interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  nivel: string; // ← nuevo campo
  grado: string;
  seccion: string;
  edad: number;
  avatar: string;
  promedio: number;
  asistencia: number;
  comportamiento: 'excelente' | 'bueno' | 'regular' | 'necesita_mejora';
  cursos: { titulo: string }[]; // ← agrega esta línea
  ultimasNotas: NotaReciente[];
}

interface NotaReciente {
  id: number;
  materia: string;
  nota: number;
  fecha: Date;
  tipo: 'examen' | 'tarea' | 'practica' | 'participacion';
  descripcion: string;
}

interface EventoEscolar {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  tipo: 'reunion' | 'evento' | 'examen' | 'entrega' | 'ceremonia';
  importante: boolean;
  grado?: string;
}

interface ComunicacionDocente {
  id: number;
  docenteNombre: string;
  materia: string;
  mensaje: string;
  fecha: Date;
  tipo: 'info' | 'alerta' | 'felicitacion' | 'citacion';
  leido: boolean;
  estudianteId: number;
}

interface EstadisticasFamilia {
  totalHijos: number;
  promedioGeneral: number;
  asistenciaPromedio: number;
  mensajesPendientes: number;
  proximosEventos: number;
  tareaspendientes: number;
}

@Component({
    selector: 'app-perfil-familia-muro',
    templateUrl: './perfil-familia-muro.component.html',
    styleUrl: './perfil-familia-muro.component.css',
    standalone: true,
    imports: [CommonModule],
})
export class PerfilFamiliaMuroComponent implements OnInit, OnDestroy, AfterViewInit {

  // Suscripciones
  private subscription = new Subscription();

  // Servicios
  private userStateService = inject(UserStateService);

  // Estado del usuario
  userRole = '';
  userName = '';

  // Charts
  rendimientoChart?: Chart;
  asistenciaChart?: Chart;
  materiaChart?: Chart;

  // Datos del dashboard
  estadisticas: EstadisticasFamilia = {
    totalHijos: 0,
    promedioGeneral: 0,
    asistenciaPromedio: 0,
    mensajesPendientes: 0,
    proximosEventos: 0,
    tareaspendientes: 0
  };

  estudiantes: Estudiante[] = [];
  eventosProximos: EventoEscolar[] = [];
  comunicaciones: ComunicacionDocente[] = [];

  // Control de vistas
  vistaActual: 'dashboard' | 'estudiantes' | 'notas' | 'comunicaciones' | 'eventos' = 'dashboard';
  estudianteSeleccionado?: Estudiante;

  ngOnInit(): void {
    // Registrar Chart.js
    Chart.register(...registerables);
    this.initializeData();
    this.setupUserSubscription();
  }

  ngAfterViewInit(): void {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyCharts();
  }

  private setupUserSubscription(): void {
    const userSub = this.userStateService.usuarioActual$.subscribe(userData => {
      if (userData) {
        this.userRole = 'familia';
        this.userName = userData.nombre || 'Familia';
      }
    });
    this.subscription.add(userSub);
  }

  private initializeData(): void {
    this.generateEstudiantes();
    this.generateEstadisticas();
    this.generateEventos();
    this.generateComunicaciones();
  }

  private generateEstudiantes(): void {
    this.estudiantes = [
      {
        id: 1,
        nombre: 'María José',
        apellido: 'García López',
        nivel: 'Primaria',
        grado: '5to',
        seccion: 'A',
        edad: 10,
        avatar: '👧',
        promedio: 16.8,
        asistencia: 95,
        comportamiento: 'excelente',
        cursos: [
          { titulo: 'Matemáticas' },
          { titulo: 'Comunicación' },
          { titulo: 'Ciencias' }
        ],
        ultimasNotas: [
          {
            id: 1,
            materia: 'Matemáticas',
            nota: 18,
            fecha: new Date(2024, 0, 15),
            tipo: 'examen',
            descripcion: 'Examen de fracciones'
          },
          {
            id: 2,
            materia: 'Comunicación',
            nota: 17,
            fecha: new Date(2024, 0, 14),
            tipo: 'tarea',
            descripcion: 'Ensayo sobre medio ambiente'
          },
          {
            id: 3,
            materia: 'Ciencias',
            nota: 16,
            fecha: new Date(2024, 0, 12),
            tipo: 'practica',
            descripcion: 'Experimento de plantas'
          }
        ]
      },
      {
        id: 2,
        nombre: 'Carlos Alberto',
        apellido: 'García López',
        nivel: 'Secundaria',
        grado: '2do',
        seccion: 'B',
        edad: 13,
        avatar: '👦',
        promedio: 14.5,
        asistencia: 88,
        comportamiento: 'bueno',
        cursos: [
          { titulo: 'Historia' },
          { titulo: 'Matemáticas' },
          { titulo: 'Inglés' }
        ],
        ultimasNotas: [
          {
            id: 4,
            materia: 'Historia',
            nota: 15,
            fecha: new Date(2024, 0, 15),
            tipo: 'examen',
            descripcion: 'Guerra del Pacífico'
          },
          {
            id: 5,
            materia: 'Matemáticas',
            nota: 14,
            fecha: new Date(2024, 0, 13),
            tipo: 'tarea',
            descripcion: 'Ecuaciones lineales'
          },
          {
            id: 6,
            materia: 'Inglés',
            nota: 15,
            fecha: new Date(2024, 0, 11),
            tipo: 'participacion',
            descripcion: 'Conversación oral'
          }
        ]
      }
    ];
  }

  private generateEstadisticas(): void {
    this.estadisticas = {
      totalHijos: this.estudiantes.length,
      promedioGeneral: this.calcularPromedioGeneral(),
      asistenciaPromedio: this.calcularAsistenciaPromedio(),
      mensajesPendientes: 3,
      proximosEventos: 2,
      tareaspendientes: 5
    };
  }

  private generateEventos(): void {
    this.eventosProximos = [
      {
        id: 1,
        titulo: 'Reunión de Padres',
        descripcion: 'Reunión trimestral para revisar el progreso académico',
        fecha: new Date(2024, 0, 20),
        tipo: 'reunion',
        importante: true,
        grado: '5to Primaria'
      },
      {
        id: 2,
        titulo: 'Festival de Ciencias',
        descripcion: 'Presentación de proyectos científicos',
        fecha: new Date(2024, 0, 25),
        tipo: 'evento',
        importante: false
      },
      {
        id: 3,
        titulo: 'Examen de Matemáticas',
        descripcion: 'Evaluación del segundo bimestre',
        fecha: new Date(2024, 0, 18),
        tipo: 'examen',
        importante: true,
        grado: '2do Secundaria'
      },
      {
        id: 4,
        titulo: 'Entrega de Libreta',
        descripcion: 'Entrega de calificaciones del bimestre',
        fecha: new Date(2024, 0, 22),
        tipo: 'entrega',
        importante: true
      },
      {
        id: 5,
        titulo: 'Día del Logro',
        descripcion: 'Ceremonia de reconocimiento a estudiantes destacados',
        fecha: new Date(2024, 0, 28),
        tipo: 'ceremonia',
        importante: false
      }
    ];
  }

  private generateComunicaciones(): void {
    this.comunicaciones = [
      {
        id: 1,
        docenteNombre: 'Prof. Ana Martínez',
        materia: 'Matemáticas',
        mensaje: 'María José ha mostrado excelente progreso en fracciones. Felicitaciones.',
        fecha: new Date(2024, 0, 15),
        tipo: 'felicitacion',
        leido: false,
        estudianteId: 1
      },
      {
        id: 2,
        docenteNombre: 'Prof. Luis Ramírez',
        materia: 'Historia',
        mensaje: 'Carlos necesita mejorar su participación en clase. Sería conveniente conversar.',
        fecha: new Date(2024, 0, 14),
        tipo: 'alerta',
        leido: false,
        estudianteId: 2
      },
      {
        id: 3,
        docenteNombre: 'Prof. Carmen Torres',
        materia: 'Comunicación',
        mensaje: 'Recordatorio: Entrega del ensayo sobre medio ambiente es mañana.',
        fecha: new Date(2024, 0, 13),
        tipo: 'info',
        leido: true,
        estudianteId: 1
      },
      {
        id: 4,
        docenteNombre: 'Coordinación Académica',
        materia: 'General',
        mensaje: 'Citación para reunión el viernes 20 a las 3:00 PM para revisar el rendimiento académico.',
        fecha: new Date(2024, 0, 12),
        tipo: 'citacion',
        leido: false,
        estudianteId: 2
      }
    ];
  }

  private initializeCharts(): void {
    // Destruir gráficos existentes antes de crear nuevos
    this.destroyCharts();

    // Crear gráficos con verificación de elementos DOM
    setTimeout(() => {
      this.createRendimientoChart();
      this.createAsistenciaChart();
      this.createMateriaChart();
    }, 200);
  }

  private createRendimientoChart(): void {
    const ctx = document.getElementById('rendimientoChart') as HTMLCanvasElement;
    if (!ctx) {
      console.warn('Elemento rendimientoChart no encontrado');
      return;
    }

    // Verificar si ya existe un gráfico y destruirlo
    if (this.rendimientoChart) {
      this.rendimientoChart.destroy();
    }

    const labels = this.getLast6Months();
    const data1 = [16.2, 16.5, 16.8, 16.4, 16.9, 16.8]; // María José
    const data2 = [14.1, 14.3, 14.5, 14.2, 14.7, 14.5]; // Carlos

    this.rendimientoChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'María José',
            data: data1,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Carlos Alberto',
            data: data2,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 10,
            max: 20,
            ticks: {
              stepSize: 2
            }
          }
        }
      }
    });
  }

  private createAsistenciaChart(): void {
    const ctx = document.getElementById('asistenciaChart') as HTMLCanvasElement;
    if (!ctx) {
      console.warn('Elemento asistenciaChart no encontrado');
      return;
    }

    // Verificar si ya existe un gráfico y destruirlo
    if (this.asistenciaChart) {
      this.asistenciaChart.destroy();
    }

    this.asistenciaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Asistencias', 'Faltas'],
          datasets: [{
            data: [this.estadisticas.asistenciaPromedio, 100 - this.estadisticas.asistenciaPromedio],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
  }

  private createMateriaChart(): void {
    const ctx = document.getElementById('materiaChart') as HTMLCanvasElement;
    if (!ctx) {
      console.warn('Elemento materiaChart no encontrado');
      return;
    }

    // Verificar si ya existe un gráfico y destruirlo
    if (this.materiaChart) {
      this.materiaChart.destroy();
    }

    const materias = ['Matemáticas', 'Comunicación', 'Ciencias', 'Historia', 'Inglés'];
    const promedios = [17, 16.5, 16, 15, 15.5];

    this.materiaChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: materias,
          datasets: [{
            label: 'Promedio',
            data: promedios,
            backgroundColor: '#8b5cf6',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 10,
              max: 20,
              ticks: {
                stepSize: 2
              }
            }
          }
        }
      });
  }

  private destroyCharts(): void {
    if (this.rendimientoChart) {
      this.rendimientoChart.destroy();
    }
    if (this.asistenciaChart) {
      this.asistenciaChart.destroy();
    }
    if (this.materiaChart) {
      this.materiaChart.destroy();
    }
  }

  // Métodos utilitarios temporales
  calcularPromedioGeneral(): number {
    if (this.estudiantes.length === 0) return 0;
    const suma = this.estudiantes.reduce((acc, est) => acc + est.promedio, 0);
    return Math.round((suma / this.estudiantes.length) * 10) / 10;
  }

  calcularAsistenciaPromedio(): number {
    if (this.estudiantes.length === 0) return 0;
    const suma = this.estudiantes.reduce((acc, est) => acc + est.asistencia, 0);
    return Math.round(suma / this.estudiantes.length);
  }

  getLast6Months(): string[] {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const result = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      result.push(months[date.getMonth()]);
    }
    return result;
  }

  getComportamientoClass(comportamiento: string): string {
    switch(comportamiento) {
      case 'excelente':
        return 'bg-green-100 text-green-800';
      case 'bueno':
        return 'bg-blue-100 text-blue-800';
      case 'regular':
        return 'bg-yellow-100 text-yellow-800';
      case 'necesita_mejora':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getComportamientoTexto(comportamiento: string): string {
    switch(comportamiento) {
      case 'excelente': return 'Excelente';
      case 'bueno': return 'Bueno';
      case 'regular': return 'Regular';
      case 'necesita_mejora': return 'Necesita Mejora';
      default: return comportamiento;
    }
  }

  getTipoEventoClass(tipo: string): string {
    switch(tipo) {
      case 'reunion':
      case 'citacion':
        return 'bg-blue-100 text-blue-800';
      case 'examen':
        return 'bg-red-100 text-red-800';
      case 'evento':
      case 'ceremonia':
        return 'bg-purple-100 text-purple-800';
      case 'entrega':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoComunicacionClass(tipo: string): string {
    switch(tipo) {
      case 'felicitacion':
        return 'bg-green-100 text-green-800';
      case 'alerta':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'citacion':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateWithTime(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getNotaClass(nota: number): string {
    if (nota >= 17) return 'text-green-600 font-bold';
    if (nota >= 14) return 'text-blue-600 font-medium';
    if (nota >= 11) return 'text-yellow-600 font-medium';
    return 'text-red-600 font-bold';
  }

  getDiasHastaEvento(fecha: Date): number {
    const hoy = new Date();
    const diferencia = fecha.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  getEstudianteNombre(estudianteId: number): string {
    const estudiante = this.estudiantes.find(e => e.id === estudianteId);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'Estudiante no encontrado';
  }

  // Métodos de navegación
  cambiarVista(vista: 'dashboard' | 'estudiantes' | 'notas' | 'comunicaciones' | 'eventos'): void {
    this.vistaActual = vista;
    this.estudianteSeleccionado = undefined;
  }

  verDetalleEstudiante(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
    this.vistaActual = 'estudiantes';
  }

  marcarComoLeido(comunicacion: ComunicacionDocente): void {
    comunicacion.leido = true;
    this.estadisticas.mensajesPendientes = this.comunicaciones.filter(c => !c.leido).length;
  }

  // Métodos de acciones (simulados)
  contactarDocente(docenteNombre: string): void {
    console.log('Contactar docente:', docenteNombre);
  }

  verCalendarioCompleto(): void {
    console.log('Ver calendario completo - Funcionalidad a implementar');
  }

  descargarReporte(estudianteId: number): void {
    console.log('Descargar reporte para estudiante:', estudianteId);
  }

  programarReunion(): void {
    console.log('Programar reunión - Funcionalidad a implementar');
  }

  // Métodos para accesibilidad - manejo de eventos de teclado
  handleKeydown(event: KeyboardEvent, action: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }

  handleTabNavigation(event: KeyboardEvent, estudiante?: Estudiante): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (estudiante) {
        this.verDetalleEstudiante(estudiante);
      }
    }
  }

  handleVistaKeydown(event: KeyboardEvent, vista: 'dashboard' | 'estudiantes' | 'notas' | 'comunicaciones' | 'eventos'): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.cambiarVista(vista);
    }
  }

  handleComunicacionKeydown(event: KeyboardEvent, comunicacion: ComunicacionDocente): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.marcarComoLeido(comunicacion);
    }
  }

  handleContactarDocenteKeydown(event: KeyboardEvent, docenteNombre: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.contactarDocente(docenteNombre);
    }
  }

  handleCalendarioKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.verCalendarioCompleto();
    }
  }

  handleDescargarReporteKeydown(event: KeyboardEvent, estudianteId: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.descargarReporte(estudianteId);
    }
  }

  handleProgramarReunionKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.programarReunion();
    }
  }

  getCursosTitulos(cursos: { titulo: string }[]): string {
    return cursos.map(curso => curso.titulo).join(', ');
  }

}
