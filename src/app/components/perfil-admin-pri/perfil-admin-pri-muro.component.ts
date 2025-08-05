import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { UserStateService, UsuarioAutenticado } from '../../services/user-state.service';

// Interfaces para los datos del administrador eureka
interface EstadisticaSistema {
  totalColegios: number;
  totalUsuarios: number;
  totalEstudiantes: number;
  totalDocentes: number;
  totalAdministradores: number;
  totalCursos: number;
  usuariosActivos: number;
  usuariosInactivos: number;
}

interface DistribucionUsuarios {
  estudiantes: number;
  docentes: number;
  adminPri: number;
  adminSec: number;
  familia: number;
  editores: number;
}

interface RendimientoSistema {
  sesionesActivasHoy: number;
  iniciosSesionSemana: number;
  evaluacionesRealizadas: number;
  materialSubido: number;
  comunicacionesEnviadas: number;
}

interface ColegioDatos {
  id: number;
  nombre: string;
  estudiantes: number;
  docentes: number;
  administradores: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  ultimaActividad: string;
  rendimientoPromedio: number;
}

@Component({
  selector: 'app-perfil-admin-pri-muro',
  templateUrl: './perfil-admin-pri-muro.component.html',
  styleUrls: ['./perfil-admin-pri-muro.component.css']
})
export class PerfilAdminPriMuroComponent implements OnInit, AfterViewInit {

  // ✅ Inyección de servicios
  private userStateService = inject(UserStateService);

  // ✅ Datos del usuario
  usuarioActual: UsuarioAutenticado | null = null;

  // ✅ Datos específicos del sistema (simulando datos reales del backend)
  estadisticasSistema: EstadisticaSistema = {
    totalColegios: 15,
    totalUsuarios: 1247,
    totalEstudiantes: 956,
    totalDocentes: 187,
    totalAdministradores: 45,
    totalCursos: 284,
    usuariosActivos: 1189,
    usuariosInactivos: 58
  };

  distribucionUsuarios: DistribucionUsuarios = {
    estudiantes: 956,
    docentes: 187,
    adminPri: 45,
    adminSec: 75,
    familia: 120,
    editores: 3
  };

  rendimientoSistema: RendimientoSistema = {
    sesionesActivasHoy: 234,
    iniciosSesionSemana: 1589,
    evaluacionesRealizadas: 1245,
    materialSubido: 67,
    comunicacionesEnviadas: 2890
  };

  colegiosDatos: ColegioDatos[] = [
    {
      id: 1,
      nombre: 'Colegio San Remo',
      estudiantes: 289,
      docentes: 45,
      administradores: 8,
      estado: 'activo',
      ultimaActividad: '2025-07-10 14:30',
      rendimientoPromedio: 16.8
    },
    {
      id: 2,
      nombre: 'Institución Educativa Primavera',
      estudiantes: 234,
      docentes: 38,
      administradores: 6,
      estado: 'activo',
      ultimaActividad: '2025-07-10 13:45',
      rendimientoPromedio: 17.2
    },
    {
      id: 3,
      nombre: 'Colegio Tecnológico Futuro',
      estudiantes: 198,
      docentes: 32,
      administradores: 5,
      estado: 'activo',
      ultimaActividad: '2025-07-10 12:15',
      rendimientoPromedio: 15.9
    },
    {
      id: 4,
      nombre: 'Academia Bilingüe Excellence',
      estudiantes: 156,
      docentes: 28,
      administradores: 4,
      estado: 'mantenimiento',
      ultimaActividad: '2025-07-09 16:20',
      rendimientoPromedio: 18.1
    },
    {
      id: 5,
      nombre: 'Colegio Rural Valle Verde',
      estudiantes: 79,
      docentes: 12,
      administradores: 2,
      estado: 'activo',
      ultimaActividad: '2025-07-10 11:30',
      rendimientoPromedio: 14.7
    }
  ];

  // ✅ Contadores dinámicos calculados
  get porcentajeUsuariosActivos(): number {
    return Math.round((this.estadisticasSistema.usuariosActivos / this.estadisticasSistema.totalUsuarios) * 100);
  }

  get promedioEstudiantesPorColegio(): number {
    return Math.round(this.estadisticasSistema.totalEstudiantes / this.estadisticasSistema.totalColegios);
  }

  get promedioDocentesPorColegio(): number {
    return Math.round(this.estadisticasSistema.totalDocentes / this.estadisticasSistema.totalColegios);
  }

  get colegiosActivos(): number {
    return this.colegiosDatos.filter(colegio => colegio.estado === 'activo').length;
  }

  get rendimientoPromedioSistema(): number {
    const promedio = this.colegiosDatos.reduce((sum, colegio) => sum + colegio.rendimientoPromedio, 0) / this.colegiosDatos.length;
    return Math.round(promedio * 10) / 10;
  }

  // ✅ Getters para el usuario
  get nombreAdmin(): string {
    return this.usuarioActual?.nombre || 'Administrador';
  }

  ngOnInit(): void {
    console.log('🚀 PerfilAdminPriMuroComponent iniciando...');

    // ✅ Cargar datos del usuario actual
    this.usuarioActual = this.userStateService.getUsuarioActual();
    if (this.usuarioActual) {
      console.log('👤 Usuario admin cargado en muro:', this.usuarioActual);
    }

    // ✅ Simular carga de datos del sistema (aquí se conectaría al backend)
    this.cargarDatosDelSistema();
  }

  ngAfterViewInit() {
    console.log('📊 Inicializando gráficos del dashboard administrativo...');
    this.renderDistribucionUsuariosChart();
    this.renderRendimientoColegiosChart();
    this.renderActividadSistemaChart();
  }

  // ✅ Método para simular carga de datos (se conectaría al backend)
  cargarDatosDelSistema(): void {
    console.log('📡 Cargando datos del sistema desde el backend...');
    // Aquí se harían las llamadas HTTP al backend para obtener datos reales
    // Por ahora usamos datos simulados arriba
  }

  // ✅ Gráfico de distribución de usuarios por tipo
  renderDistribucionUsuariosChart() {
    console.log('📊 Renderizando gráfico de distribución de usuarios...');
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

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Estudiantes', 'Docentes', 'Admin Principal', 'Admin Secundario', 'Familia', 'Editores'],
        datasets: [{
          data: [
            this.distribucionUsuarios.estudiantes,
            this.distribucionUsuarios.docentes,
            this.distribucionUsuarios.adminPri,
            this.distribucionUsuarios.adminSec,
            this.distribucionUsuarios.familia,
            this.distribucionUsuarios.editores
          ],
          backgroundColor: ['#22c55e', '#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#eab308'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Distribución de Usuarios por Tipo' }
        }
      }
    });
  }

  // ✅ Gráfico de rendimiento por colegios
  renderRendimientoColegiosChart() {
    console.log('📈 Renderizando gráfico de rendimiento por colegios...');
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

    const labels = this.colegiosDatos.map(colegio => colegio.nombre.substring(0, 15) + '...');
    const estudiantes = this.colegiosDatos.map(colegio => colegio.estudiantes);
    const docentes = this.colegiosDatos.map(colegio => colegio.docentes);
    const rendimiento = this.colegiosDatos.map(colegio => colegio.rendimientoPromedio);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Estudiantes',
            data: estudiantes,
            backgroundColor: '#28a745',
            yAxisID: 'y'
          },
          {
            label: 'Docentes',
            data: docentes,
            backgroundColor: '#17a2b8',
            yAxisID: 'y'
          },
          {
            label: 'Rendimiento Promedio',
            data: rendimiento,
            type: 'line',
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            yAxisID: 'y1',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Rendimiento y Población por Colegio' }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Número de Personas' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Rendimiento Académico' },
            grid: { drawOnChartArea: false },
            min: 10,
            max: 20
          }
        }
      }
    });
  }

  // ✅ Gráfico de actividad del sistema
  renderActividadSistemaChart() {
    console.log('📋 Renderizando gráfico de actividad del sistema...');
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
        labels: ['Sesiones Hoy', 'Inicios Semana', 'Evaluaciones', 'Material Subido', 'Comunicaciones'],
        datasets: [{
          label: 'Actividad del Sistema',
          data: [
            this.rendimientoSistema.sesionesActivasHoy,
            this.rendimientoSistema.iniciosSesionSemana,
            this.rendimientoSistema.evaluacionesRealizadas,
            this.rendimientoSistema.materialSubido,
            this.rendimientoSistema.comunicacionesEnviadas
          ],
          backgroundColor: [
            '#28a745', // Verde
            '#17a2b8', // Azul
            '#ffc107', // Amarillo
            '#fd7e14', // Naranja
            '#6f42c1'  // Morado
          ],
          borderColor: [
            '#1e7e34',
            '#117a8b',
            '#e0a800',
            '#e35d04',
            '#59359a'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Actividad del Sistema - Últimos 7 días' }
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
  getEstadoColegio(estado: string): string {
    switch (estado) {
      case 'activo': return '🟢 Activo';
      case 'inactivo': return '🔴 Inactivo';
      case 'mantenimiento': return '🟡 Mantenimiento';
      default: return '⚪ Desconocido';
    }
  }

  getEstadoColegioColor(estado: string): string {
    switch (estado) {
      case 'activo': return 'text-green-600';
      case 'inactivo': return 'text-red-600';
      case 'mantenimiento': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  }

  getRendimientoColor(rendimiento: number): string {
    if (rendimiento >= 17) return 'text-green-600';
    if (rendimiento >= 15) return 'text-blue-600';
    if (rendimiento >= 13) return 'text-yellow-600';
    return 'text-red-600';
  }

  getRendimientoIcon(rendimiento: number): string {
    if (rendimiento >= 17) return '🌟';
    if (rendimiento >= 15) return '👍';
    if (rendimiento >= 13) return '⚠️';
    return '❌';
  }

  formatearFechaActividad(fecha: string): string {
    const dateObj = new Date(fecha);
    return dateObj.toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ✅ Métodos para acciones administrativas
  verDetalleColegio(colegioId: number): void {
    console.log(`🏫 Ver detalle del colegio ID: ${colegioId}`);
    // Aquí se implementaría la navegación al detalle del colegio
  }

  generarReporte(): void {
    console.log('📄 Generando reporte del sistema...');
    // Aquí se implementaría la generación de reportes
  }

  gestionarUsuarios(): void {
    console.log('👥 Navegando a gestión de usuarios...');
    // Aquí se implementaría la navegación a gestión de usuarios
  }
}
