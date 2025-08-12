import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { UserStateService, UsuarioAutenticado } from '../../services/user-state.service';

// Interfaces para los datos del administrador secundario
interface EstadisticasColegio {
  nombreColegio: string;
  totalEstudiantes: number;
  totalDocentes: number;
  totalCursos: number;
  totalAulas: number;
  estudiantesPresentes: number;
  docentesActivos: number;
  cursosEnProgreso: number;
}

interface GradoSeccion {
  grado: string;
  seccion: string;
  estudiantes: number;
  docente: string;
  aula: string;
  asistencia: number;
}

interface RendimientoAcademico {
  grado: string;
  promedioGeneral: number;
  totalEvaluaciones: number;
  estudiantesAprobados: number;
  estudiantesDesaprobados: number;
  porcentajeAprobacion: number;
}

interface ActividadDiaria {
  clasesProgramadas: number;
  clasesRealizadas: number;
  evaluacionesHoy: number;
  materialSubido: number;
  comunicacionesEnviadas: number;
  reportesGenerados: number;
}

interface DocenteInfo {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  cursosAsignados: number;
  horasSemanales: number;
  estado: 'activo' | 'licencia' | 'ausente';
  ultimaConexion: string;
}

@Component({
    selector: 'app-perfil-admin-sec-muro',
    templateUrl: './perfil-admin-sec-muro.component.html',
    styleUrls: ['./perfil-admin-sec-muro.component.css'],
    standalone: false
})
export class PerfilAdminSecMuroComponent implements OnInit, AfterViewInit {

  // ✅ Inyección de servicios
  private userStateService = inject(UserStateService);

  // ✅ Datos del usuario
  usuarioActual: UsuarioAutenticado | null = null;

  // ✅ Datos específicos del colegio (simulando datos reales del backend)
  estadisticasColegio: EstadisticasColegio = {
    nombreColegio: 'Colegio San Remo - Sede Principal',
    totalEstudiantes: 289,
    totalDocentes: 24,
    totalCursos: 45,
    totalAulas: 18,
    estudiantesPresentes: 267,
    docentesActivos: 22,
    cursosEnProgreso: 42
  };

  gradosSecciones: GradoSeccion[] = [
    { grado: '1ro Primaria', seccion: 'A', estudiantes: 28, docente: 'María González', aula: 'P-101', asistencia: 96 },
    { grado: '1ro Primaria', seccion: 'B', estudiantes: 27, docente: 'Ana Martínez', aula: 'P-102', asistencia: 89 },
    { grado: '2do Primaria', seccion: 'A', estudiantes: 30, docente: 'Carmen López', aula: 'P-201', asistencia: 93 },
    { grado: '2do Primaria', seccion: 'B', estudiantes: 29, docente: 'Rosa Díaz', aula: 'P-202', asistencia: 91 },
    { grado: '3ro Primaria', seccion: 'A', estudiantes: 26, docente: 'Luis Ramírez', aula: 'P-301', asistencia: 88 },
    { grado: '4to Primaria', seccion: 'A', estudiantes: 31, docente: 'Patricia Silva', aula: 'P-401', asistencia: 94 },
    { grado: '5to Primaria', seccion: 'A', estudiantes: 25, docente: 'Miguel Torres', aula: 'P-501', asistencia: 92 },
    { grado: '6to Primaria', seccion: 'A', estudiantes: 29, docente: 'Elena Vargas', aula: 'P-601', asistencia: 90 },
    { grado: '1ro Secundaria', seccion: 'A', estudiantes: 24, docente: 'Carlos Mendoza', aula: 'S-101', asistencia: 87 },
    { grado: '2do Secundaria', seccion: 'A', estudiantes: 22, docente: 'Sofía Herrera', aula: 'S-201', asistencia: 85 },
    { grado: '3ro Secundaria', seccion: 'A', estudiantes: 23, docente: 'Roberto Jiménez', aula: 'S-301', asistencia: 89 },
    { grado: '4to Secundaria', seccion: 'A', estudiantes: 21, docente: 'Andrea Morales', aula: 'S-401', asistencia: 91 },
    { grado: '5to Secundaria', seccion: 'A', estudiantes: 20, docente: 'Fernando Castro', aula: 'S-501', asistencia: 95 }
  ];

  rendimientoAcademico: RendimientoAcademico[] = [
    { grado: '1ro Primaria', promedioGeneral: 16.2, totalEvaluaciones: 45, estudiantesAprobados: 52, estudiantesDesaprobados: 3, porcentajeAprobacion: 95 },
    { grado: '2do Primaria', promedioGeneral: 15.8, totalEvaluaciones: 48, estudiantesAprobados: 56, estudiantesDesaprobados: 3, porcentajeAprobacion: 95 },
    { grado: '3ro Primaria', promedioGeneral: 16.5, totalEvaluaciones: 42, estudiantesAprobados: 25, estudiantesDesaprobados: 1, porcentajeAprobacion: 96 },
    { grado: '4to Primaria', promedioGeneral: 15.9, totalEvaluaciones: 51, estudiantesAprobados: 29, estudiantesDesaprobados: 2, porcentajeAprobacion: 94 },
    { grado: '5to Primaria', promedioGeneral: 16.8, totalEvaluaciones: 47, estudiantesAprobados: 24, estudiantesDesaprobados: 1, porcentajeAprobacion: 96 },
    { grado: '6to Primaria', promedioGeneral: 17.1, totalEvaluaciones: 53, estudiantesAprobados: 28, estudiantesDesaprobados: 1, porcentajeAprobacion: 97 },
    { grado: '1ro Secundaria', promedioGeneral: 14.7, totalEvaluaciones: 38, estudiantesAprobados: 21, estudiantesDesaprobados: 3, porcentajeAprobacion: 88 },
    { grado: '2do Secundaria', promedioGeneral: 15.2, totalEvaluaciones: 41, estudiantesAprobados: 20, estudiantesDesaprobados: 2, porcentajeAprobacion: 91 },
    { grado: '3ro Secundaria', promedioGeneral: 15.6, totalEvaluaciones: 44, estudiantesAprobados: 21, estudiantesDesaprobados: 2, porcentajeAprobacion: 91 },
    { grado: '4to Secundaria', promedioGeneral: 16.3, totalEvaluaciones: 39, estudiantesAprobados: 20, estudiantesDesaprobados: 1, porcentajeAprobacion: 95 },
    { grado: '5to Secundaria', promedioGeneral: 16.9, totalEvaluaciones: 42, estudiantesAprobados: 19, estudiantesDesaprobados: 1, porcentajeAprobacion: 95 }
  ];

  actividadDiaria: ActividadDiaria = {
    clasesProgramadas: 48,
    clasesRealizadas: 45,
    evaluacionesHoy: 12,
    materialSubido: 8,
    comunicacionesEnviadas: 23,
    reportesGenerados: 5
  };

  docentesInfo: DocenteInfo[] = [
    { id: 1, nombre: 'María', apellido: 'González', especialidad: 'Educación Inicial', cursosAsignados: 3, horasSemanales: 30, estado: 'activo', ultimaConexion: '2025-07-10 14:30' },
    { id: 2, nombre: 'Ana', apellido: 'Martínez', especialidad: 'Matemáticas', cursosAsignados: 4, horasSemanales: 25, estado: 'activo', ultimaConexion: '2025-07-10 13:45' },
    { id: 3, nombre: 'Carmen', apellido: 'López', especialidad: 'Comunicación', cursosAsignados: 3, horasSemanales: 28, estado: 'activo', ultimaConexion: '2025-07-10 12:15' },
    { id: 4, nombre: 'Luis', apellido: 'Ramírez', especialidad: 'Ciencias', cursosAsignados: 2, horasSemanales: 20, estado: 'licencia', ultimaConexion: '2025-07-08 16:20' },
    { id: 5, nombre: 'Patricia', apellido: 'Silva', especialidad: 'Historia', cursosAsignados: 3, horasSemanales: 24, estado: 'activo', ultimaConexion: '2025-07-10 11:30' }
  ];

  // ✅ Contadores dinámicos calculados
  get porcentajeAsistencia(): number {
    return Math.round((this.estadisticasColegio.estudiantesPresentes / this.estadisticasColegio.totalEstudiantes) * 100);
  }

  get porcentajeDocentesActivos(): number {
    return Math.round((this.estadisticasColegio.docentesActivos / this.estadisticasColegio.totalDocentes) * 100);
  }

  get porcentajeCursosEnProgreso(): number {
    return Math.round((this.estadisticasColegio.cursosEnProgreso / this.estadisticasColegio.totalCursos) * 100);
  }

  get promedioGeneralColegio(): number {
    const promedio = this.rendimientoAcademico.reduce((sum, grado) => sum + grado.promedioGeneral, 0) / this.rendimientoAcademico.length;
    return Math.round(promedio * 10) / 10;
  }

  get porcentajeAprobacionGeneral(): number {
    const promedio = this.rendimientoAcademico.reduce((sum, grado) => sum + grado.porcentajeAprobacion, 0) / this.rendimientoAcademico.length;
    return Math.round(promedio);
  }

  // ✅ Getters para el usuario
  get nombreAdmin(): string {
    return this.usuarioActual?.nombre || 'Administrador';
  }

  ngOnInit(): void {
    console.log('🚀 PerfilAdminSecMuroComponent iniciando...');

    // ✅ Cargar datos del usuario actual
    this.usuarioActual = this.userStateService.getUsuarioActual();
    if (this.usuarioActual) {
      console.log('👤 Usuario admin secundario cargado en muro:', this.usuarioActual);
    }

    // ✅ Simular carga de datos del colegio (aquí se conectaría al backend)
    this.cargarDatosDelColegio();
  }

  ngAfterViewInit() {
    console.log('📊 Inicializando gráficos del dashboard admin secundario...');
    this.renderAsistenciaPorGradoChart();
    this.renderRendimientoAcademicoChart();
    this.renderDistribucionEstudiantesChart();
    this.renderActividadDiariaChart();
  }

  // ✅ Método para simular carga de datos (se conectaría al backend)
  cargarDatosDelColegio(): void {
    console.log('📡 Cargando datos del colegio desde el backend...');
    // Aquí se harían las llamadas HTTP al backend para obtener datos reales del colegio específico
    // Por ahora usamos datos simulados arriba
  }

  // ✅ Gráfico de asistencia por grado
  renderAsistenciaPorGradoChart() {
    console.log('📊 Renderizando gráfico de asistencia por grado...');
    const canvas = document.getElementById('asistenciaChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('❌ No se encontró el elemento canvas con ID "asistenciaChart"');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas');
      return;
    }

    const gradosUnicos = [...new Set(this.gradosSecciones.map(g => g.grado))];
    const asistenciaPromedio = gradosUnicos.map(grado => {
      const gradosDelMismo = this.gradosSecciones.filter(g => g.grado === grado);
      return gradosDelMismo.reduce((sum, g) => sum + g.asistencia, 0) / gradosDelMismo.length;
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: gradosUnicos,
        datasets: [{
          label: 'Asistencia Promedio (%)',
          data: asistenciaPromedio,
          backgroundColor: [
            '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
            '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
            '#f59e0b', '#d97706', '#b45309'
          ],
          borderColor: '#374151',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Asistencia Promedio por Grado' }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Porcentaje de Asistencia' }
          }
        }
      }
    });
  }

  // ✅ Gráfico de rendimiento académico
  renderRendimientoAcademicoChart() {
    console.log('📈 Renderizando gráfico de rendimiento académico...');
    const canvas = document.getElementById('rendimientoChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('❌ No se encontró el elemento canvas con ID "rendimientoChart"');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas');
      return;
    }

    const grados = this.rendimientoAcademico.map(r => r.grado);
    const promedios = this.rendimientoAcademico.map(r => r.promedioGeneral);
    const aprobacion = this.rendimientoAcademico.map(r => r.porcentajeAprobacion);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: grados,
        datasets: [
          {
            label: 'Promedio General',
            data: promedios,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Porcentaje Aprobación',
            data: aprobacion,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: false,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Rendimiento Académico por Grado' }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            min: 0,
            max: 20,
            title: { display: true, text: 'Promedio General' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 0,
            max: 100,
            title: { display: true, text: 'Porcentaje Aprobación' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  // ✅ Gráfico de distribución de estudiantes
  renderDistribucionEstudiantesChart() {
    console.log('📊 Renderizando gráfico de distribución de estudiantes...');
    const canvas = document.getElementById('distribucionChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('❌ No se encontró el elemento canvas con ID "distribucionChart"');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas');
      return;
    }

    // Agrupar por nivel
    const primaria = this.gradosSecciones.filter(g => g.grado.includes('Primaria'));
    const secundaria = this.gradosSecciones.filter(g => g.grado.includes('Secundaria'));

    const totalPrimaria = primaria.reduce((sum, g) => sum + g.estudiantes, 0);
    const totalSecundaria = secundaria.reduce((sum, g) => sum + g.estudiantes, 0);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Primaria', 'Secundaria'],
        datasets: [{
          data: [totalPrimaria, totalSecundaria],
          backgroundColor: ['#22c55e', '#3b82f6'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Distribución de Estudiantes por Nivel' }
        }
      }
    });
  }

  // ✅ Gráfico de actividad diaria
  renderActividadDiariaChart() {
    console.log('📋 Renderizando gráfico de actividad diaria...');
    const canvas = document.getElementById('actividadChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('❌ No se encontró el elemento canvas con ID "actividadChart"');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas');
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Clases Realizadas', 'Evaluaciones', 'Material Subido', 'Comunicaciones', 'Reportes'],
        datasets: [{
          label: 'Actividad de Hoy',
          data: [
            this.actividadDiaria.clasesRealizadas,
            this.actividadDiaria.evaluacionesHoy,
            this.actividadDiaria.materialSubido,
            this.actividadDiaria.comunicacionesEnviadas,
            this.actividadDiaria.reportesGenerados
          ],
          backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'],
          borderColor: ['#16a34a', '#2563eb', '#d97706', '#7c3aed', '#dc2626'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Actividad Diaria del Colegio' }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Cantidad' }
          }
        }
      }
    });
  }

  // ✅ Métodos de utilidad
  getEstadoDocente(estado: string): string {
    switch (estado) {
      case 'activo': return '🟢 Activo';
      case 'licencia': return '🟡 En Licencia';
      case 'ausente': return '🔴 Ausente';
      default: return '⚪ Desconocido';
    }
  }

  getEstadoDocenteColor(estado: string): string {
    switch (estado) {
      case 'activo': return 'text-green-600';
      case 'licencia': return 'text-yellow-600';
      case 'ausente': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getAsistenciaColor(asistencia: number): string {
    if (asistencia >= 95) return 'text-green-600';
    if (asistencia >= 90) return 'text-blue-600';
    if (asistencia >= 85) return 'text-yellow-600';
    return 'text-red-600';
  }

  getRendimientoColor(promedio: number): string {
    if (promedio >= 17) return 'text-green-600';
    if (promedio >= 15) return 'text-blue-600';
    if (promedio >= 13) return 'text-yellow-600';
    return 'text-red-600';
  }

  formatearFecha(fecha: string): string {
    const dateObj = new Date(fecha);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
