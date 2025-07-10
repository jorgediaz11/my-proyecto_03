import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { UserStateService } from '../../services/user-state.service';

// Interfaces para el dashboard del editor
interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  totalCapitulos: number;
  capitulosPublicados: number;
  recursos: number;
  ultimaActualizacion: Date;
  estado: 'activa' | 'en_revision' | 'borrador';
}

interface Capitulo {
  id: number;
  materiaId: number;
  titulo: string;
  descripcion: string;
  orden: number;
  estado: 'publicado' | 'borrador' | 'revision';
  recursos: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

interface Recurso {
  id: number;
  capituloId: number;
  tipo: 'video' | 'documento' | 'imagen' | 'ejercicio' | 'evaluacion';
  nombre: string;
  tamano: string;
  fechaSubida: Date;
  estado: 'activo' | 'pendiente' | 'archivado';
}

interface EstadisticasEditor {
  materiasGestionadas: number;
  capitulosCreados: number;
  recursosSubidos: number;
  revisionesPendientes: number;
  materiasPublicadas: number;
  interaccionesHoy: number;
}

@Component({
  selector: 'app-perfil-editor-muro',
  templateUrl: './perfil-editor-muro.component.html',
  styleUrl: './perfil-editor-muro.component.css'
})
export class PerfilEditorMuroComponent implements OnInit, OnDestroy, AfterViewInit {

  // Suscripciones
  private subscription = new Subscription();

  // Estado del usuario
  userRole = '';
  userName = '';

  // Servicios
  private userStateService = inject(UserStateService);

  // Charts
  materiasChart?: Chart;
  recursosChart?: Chart;
  actividadChart?: Chart;

  // Datos del dashboard
  estadisticas: EstadisticasEditor = {
    materiasGestionadas: 0,
    capitulosCreados: 0,
    recursosSubidos: 0,
    revisionesPendientes: 0,
    materiasPublicadas: 0,
    interaccionesHoy: 0
  };

  materias: Materia[] = [];
  capitulosRecientes: Capitulo[] = [];
  recursosRecientes: Recurso[] = [];

  // Control de vistas
  vistaActual: 'dashboard' | 'materias' | 'capitulos' | 'recursos' = 'dashboard';
  materiaSeleccionada?: Materia;

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
        this.userRole = 'editor';
        this.userName = userData.nombre || 'Editor';
      }
    });
    this.subscription.add(userSub);
  }

  private initializeData(): void {
    this.generateMaterias();
    this.generateEstadisticas();
    this.generateCapitulosRecientes();
    this.generateRecursosRecientes();
  }

  private generateMaterias(): void {
    this.materias = [
      {
        id: 1,
        nombre: 'Matemática',
        descripcion: 'Álgebra, geometría y cálculo para todos los niveles',
        icono: '📐',
        color: '#3b82f6',
        totalCapitulos: 48,
        capitulosPublicados: 42,
        recursos: 156,
        ultimaActualizacion: new Date(2024, 0, 15),
        estado: 'activa'
      },
      {
        id: 2,
        nombre: 'Comunicación',
        descripcion: 'Lenguaje, literatura y expresión oral y escrita',
        icono: '📚',
        color: '#10b981',
        totalCapitulos: 36,
        capitulosPublicados: 30,
        recursos: 98,
        ultimaActualizacion: new Date(2024, 0, 12),
        estado: 'activa'
      },
      {
        id: 3,
        nombre: 'Ciencias Naturales',
        descripcion: 'Biología, química y física aplicada',
        icono: '🔬',
        color: '#8b5cf6',
        totalCapitulos: 42,
        capitulosPublicados: 38,
        recursos: 134,
        ultimaActualizacion: new Date(2024, 0, 10),
        estado: 'activa'
      },
      {
        id: 4,
        nombre: 'Historia',
        descripcion: 'Historia universal y del Perú',
        icono: '🏛️',
        color: '#f59e0b',
        totalCapitulos: 24,
        capitulosPublicados: 20,
        recursos: 76,
        ultimaActualizacion: new Date(2024, 0, 8),
        estado: 'activa'
      },
      {
        id: 5,
        nombre: 'Geografía',
        descripcion: 'Geografía física y humana',
        icono: '🌍',
        color: '#06b6d4',
        totalCapitulos: 18,
        capitulosPublicados: 14,
        recursos: 52,
        ultimaActualizacion: new Date(2024, 0, 5),
        estado: 'en_revision'
      },
      {
        id: 6,
        nombre: 'Educación Física',
        descripcion: 'Deportes, salud y actividad física',
        icono: '⚽',
        color: '#ef4444',
        totalCapitulos: 12,
        capitulosPublicados: 8,
        recursos: 34,
        ultimaActualizacion: new Date(2024, 0, 3),
        estado: 'borrador'
      }
    ];
  }

  private generateEstadisticas(): void {
    this.estadisticas = {
      materiasGestionadas: this.materias.length,
      capitulosCreados: this.materias.reduce((sum, m) => sum + m.totalCapitulos, 0),
      recursosSubidos: this.materias.reduce((sum, m) => sum + m.recursos, 0),
      revisionesPendientes: this.materias.filter(m => m.estado === 'en_revision').length,
      materiasPublicadas: this.materias.filter(m => m.estado === 'activa').length,
      interaccionesHoy: Math.floor(Math.random() * 50) + 20
    };
  }

  private generateCapitulosRecientes(): void {
    this.capitulosRecientes = [
      {
        id: 1,
        materiaId: 1,
        titulo: 'Ecuaciones Cuadráticas',
        descripcion: 'Resolución de ecuaciones de segundo grado',
        orden: 15,
        estado: 'publicado',
        recursos: 8,
        fechaCreacion: new Date(2024, 0, 15),
        fechaActualizacion: new Date(2024, 0, 15)
      },
      {
        id: 2,
        materiaId: 2,
        titulo: 'Análisis Sintáctico',
        descripcion: 'Estructura y componentes de la oración',
        orden: 12,
        estado: 'revision',
        recursos: 6,
        fechaCreacion: new Date(2024, 0, 14),
        fechaActualizacion: new Date(2024, 0, 14)
      },
      {
        id: 3,
        materiaId: 3,
        titulo: 'Sistema Digestivo',
        descripcion: 'Anatomía y fisiología del aparato digestivo',
        orden: 8,
        estado: 'publicado',
        recursos: 12,
        fechaCreacion: new Date(2024, 0, 13),
        fechaActualizacion: new Date(2024, 0, 13)
      },
      {
        id: 4,
        materiaId: 4,
        titulo: 'Guerra del Pacífico',
        descripcion: 'Causas, desarrollo y consecuencias',
        orden: 18,
        estado: 'borrador',
        recursos: 4,
        fechaCreacion: new Date(2024, 0, 12),
        fechaActualizacion: new Date(2024, 0, 12)
      },
      {
        id: 5,
        materiaId: 1,
        titulo: 'Geometría Analítica',
        descripcion: 'Coordenadas cartesianas y ecuaciones de rectas',
        orden: 16,
        estado: 'publicado',
        recursos: 10,
        fechaCreacion: new Date(2024, 0, 11),
        fechaActualizacion: new Date(2024, 0, 11)
      }
    ];
  }

  private generateRecursosRecientes(): void {
    this.recursosRecientes = [
      {
        id: 1,
        capituloId: 1,
        tipo: 'video',
        nombre: 'Resolución paso a paso de ecuaciones cuadráticas',
        tamano: '45.2 MB',
        fechaSubida: new Date(2024, 0, 15),
        estado: 'activo'
      },
      {
        id: 2,
        capituloId: 2,
        tipo: 'documento',
        nombre: 'Guía de análisis sintáctico.pdf',
        tamano: '2.8 MB',
        fechaSubida: new Date(2024, 0, 14),
        estado: 'pendiente'
      },
      {
        id: 3,
        capituloId: 3,
        tipo: 'imagen',
        nombre: 'Diagrama del sistema digestivo',
        tamano: '1.5 MB',
        fechaSubida: new Date(2024, 0, 13),
        estado: 'activo'
      },
      {
        id: 4,
        capituloId: 1,
        tipo: 'ejercicio',
        nombre: 'Ejercicios de práctica - Ecuaciones',
        tamano: '856 KB',
        fechaSubida: new Date(2024, 0, 12),
        estado: 'activo'
      },
      {
        id: 5,
        capituloId: 4,
        tipo: 'documento',
        nombre: 'Cronología Guerra del Pacífico.docx',
        tamano: '3.2 MB',
        fechaSubida: new Date(2024, 0, 11),
        estado: 'pendiente'
      }
    ];
  }

  private initializeCharts(): void {
    this.createMateriasChart();
    this.createRecursosChart();
    this.createActividadChart();
  }

  private createMateriasChart(): void {
    const ctx = document.getElementById('materiasChart') as HTMLCanvasElement;
    if (ctx) {
      this.materiasChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Publicadas', 'En Revisión', 'Borrador'],
          datasets: [{
            data: [
              this.materias.filter(m => m.estado === 'activa').length,
              this.materias.filter(m => m.estado === 'en_revision').length,
              this.materias.filter(m => m.estado === 'borrador').length
            ],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
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
  }

  private createRecursosChart(): void {
    const ctx = document.getElementById('recursosChart') as HTMLCanvasElement;
    if (ctx) {
      const tiposRecursos = ['video', 'documento', 'imagen', 'ejercicio', 'evaluacion'];
      const data = tiposRecursos.map(tipo =>
        this.recursosRecientes.filter(r => r.tipo === tipo).length
      );

      this.recursosChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Videos', 'Documentos', 'Imágenes', 'Ejercicios', 'Evaluaciones'],
          datasets: [{
            label: 'Recursos',
            data: data,
            backgroundColor: '#3b82f6',
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
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }

  private createActividadChart(): void {
    const ctx = document.getElementById('actividadChart') as HTMLCanvasElement;
    if (ctx) {
      const labels = this.getLast7Days();
      const data = labels.map(() => Math.floor(Math.random() * 15) + 5);

      this.actividadChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Recursos Creados',
            data: data,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
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
              beginAtZero: true,
              ticks: {
                stepSize: 5
              }
            }
          }
        }
      });
    }
  }

  private destroyCharts(): void {
    if (this.materiasChart) {
      this.materiasChart.destroy();
    }
    if (this.recursosChart) {
      this.recursosChart.destroy();
    }
    if (this.actividadChart) {
      this.actividadChart.destroy();
    }
  }

  // Métodos utilitarios
  getLast7Days(): string[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));
    }
    return days;
  }

  getMateriaNombre(materiaId: number): string {
    const materia = this.materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : 'Sin materia';
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'activa':
      case 'publicado':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'en_revision':
      case 'revision':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'borrador':
      case 'archivado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEstadoTexto(estado: string): string {
    switch(estado) {
      case 'activa': return 'Activa';
      case 'en_revision': return 'En Revisión';
      case 'borrador': return 'Borrador';
      case 'publicado': return 'Publicado';
      case 'revision': return 'En Revisión';
      case 'activo': return 'Activo';
      case 'pendiente': return 'Pendiente';
      case 'archivado': return 'Archivado';
      default: return estado;
    }
  }

  getTipoIcon(tipo: string): string {
    switch(tipo) {
      case 'video': return '🎥';
      case 'documento': return '📄';
      case 'imagen': return '🖼️';
      case 'ejercicio': return '✏️';
      case 'evaluacion': return '📝';
      default: return '📁';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getProgresoMateria(materia: Materia): number {
    return Math.round((materia.capitulosPublicados / materia.totalCapitulos) * 100);
  }

  // Métodos de navegación
  cambiarVista(vista: 'dashboard' | 'materias' | 'capitulos' | 'recursos'): void {
    this.vistaActual = vista;
    this.materiaSeleccionada = undefined;
  }

  verDetalleMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.vistaActual = 'materias';
  }

  // Métodos de acciones (simulados)
  crearNuevaMateria(): void {
    console.log('Crear nueva materia - Funcionalidad a implementar');
  }

  editarMateria(materia: Materia): void {
    console.log('Editar materia:', materia.nombre);
  }

  crearCapitulo(materiaId?: number): void {
    console.log('Crear nuevo capítulo para materia:', materiaId);
  }

  editarCapitulo(capitulo: Capitulo): void {
    console.log('Editar capítulo:', capitulo.titulo);
  }

  subirRecurso(): void {
    console.log('Subir nuevo recurso - Funcionalidad a implementar');
  }

  eliminarRecurso(recurso: Recurso): void {
    console.log('Eliminar recurso:', recurso.nombre);
  }
}
