
import { Component, OnInit, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { ColegiosService, Colegio } from 'src/app/services/colegios.service';
import { CursosService, Curso } from 'src/app/services/cursos.service';
import { NivelesService, Nivel } from 'src/app/services/niveles.service';
import { GradosService, Grado } from 'src/app/services/grados.service';
import { SeccionesService, Seccion } from 'src/app/services/secciones.service';

interface Estudiante {
  nombre: string;
  colegio: string;
  nivel: string;
  curso: string;
  notas: number;
}

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.css'],
    standalone: false
})
export class ReportesComponent implements OnInit {
  estudiantes: Estudiante[] = [
    { nombre: 'Juan Pérez', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Matemáticas', notas: 15 },
    { nombre: 'Ana López', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Comunicación', notas: 18 },
    { nombre: 'Carlos Ruiz', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Historia', notas: 14 },
    { nombre: 'Lucía Torres', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Ciencias', notas: 17 },
    { nombre: 'Pedro Gómez', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Matemáticas', notas: 16 },
    // ...agrega más estudiantes hasta tener 50
    { nombre: 'Estudiante 6', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Comunicación', notas: 19 },
    { nombre: 'Estudiante 7', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Historia', notas: 13 },
    { nombre: 'Estudiante 8', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Ciencias', notas: 17 },
    { nombre: 'Estudiante 9', colegio: 'Colegio América', nivel: 'Secundaria', curso: 'Matemáticas', notas: 15 },
    { nombre: 'Estudiante 10', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Comunicación', notas: 18 },
    { nombre: 'Estudiante 11', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Historia', notas: 14 },
    { nombre: 'Estudiante 12', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Ciencias', notas: 16 },
    { nombre: 'Estudiante 13', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Matemáticas', notas: 17 },
    { nombre: 'Estudiante 14', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Comunicación', notas: 15 },
    { nombre: 'Estudiante 15', colegio: 'Colegio América', nivel: 'Secundaria', curso: 'Historia', notas: 18 },
    { nombre: 'Estudiante 16', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Ciencias', notas: 13 },
    { nombre: 'Estudiante 17', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Matemáticas', notas: 19 },
    { nombre: 'Estudiante 18', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Comunicación', notas: 14 },
    { nombre: 'Estudiante 19', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Historia', notas: 16 },
    { nombre: 'Estudiante 20', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Ciencias', notas: 17 },
    { nombre: 'Estudiante 21', colegio: 'Colegio América', nivel: 'Secundaria', curso: 'Matemáticas', notas: 15 },
    { nombre: 'Estudiante 22', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Comunicación', notas: 18 },
    { nombre: 'Estudiante 23', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Historia', notas: 14 },
    { nombre: 'Estudiante 24', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Ciencias', notas: 16 },
    { nombre: 'Estudiante 25', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Matemáticas', notas: 17 },
    { nombre: 'Estudiante 26', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Comunicación', notas: 15 },
    { nombre: 'Estudiante 27', colegio: 'Colegio América', nivel: 'Secundaria', curso: 'Historia', notas: 18 },
    { nombre: 'Estudiante 28', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Ciencias', notas: 13 },
    { nombre: 'Estudiante 29', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Matemáticas', notas: 19 },
    { nombre: 'Estudiante 30', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Comunicación', notas: 14 },
    { nombre: 'Estudiante 31', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Historia', notas: 16 },
    { nombre: 'Estudiante 32', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Ciencias', notas: 17 },
    { nombre: 'Estudiante 33', colegio: 'Colegio América', nivel: 'Secundaria', curso: 'Matemáticas', notas: 15 },
    { nombre: 'Estudiante 34', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Comunicación', notas: 18 },
    { nombre: 'Estudiante 35', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Historia', notas: 14 },
    { nombre: 'Estudiante 36', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Ciencias', notas: 16 },
    { nombre: 'Estudiante 37', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Matemáticas', notas: 17 },
    { nombre: 'Estudiante 38', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Comunicación', notas: 15 },
    { nombre: 'Estudiante 39', colegio: 'Colegio América', nivel: 'Secundaria', curso: 'Historia', notas: 18 },
    { nombre: 'Estudiante 40', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Ciencias', notas: 13 },
    { nombre: 'Estudiante 41', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Matemáticas', notas: 19 },
    { nombre: 'Estudiante 42', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Comunicación', notas: 14 },
    { nombre: 'Estudiante 43', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Historia', notas: 16 },
    { nombre: 'Estudiante 44', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Ciencias', notas: 17 },
    { nombre: 'Estudiante 45', colegio: 'Colegio América', nivel: 'Secundaria', curso: 'Matemáticas', notas: 15 },
    { nombre: 'Estudiante 46', colegio: 'Colegio Central', nivel: 'Primaria', curso: 'Comunicación', notas: 18 },
    { nombre: 'Estudiante 47', colegio: 'Colegio San Martín', nivel: 'Secundaria', curso: 'Historia', notas: 14 },
    { nombre: 'Estudiante 48', colegio: 'Colegio América', nivel: 'Primaria', curso: 'Ciencias', notas: 16 },
    { nombre: 'Estudiante 49', colegio: 'Colegio Central', nivel: 'Secundaria', curso: 'Matemáticas', notas: 17 },
    { nombre: 'Estudiante 50', colegio: 'Colegio San Martín', nivel: 'Primaria', curso: 'Comunicación', notas: 15 }
  ];
  // Fin de la lista de estudiantes

  colegiosClientes: Colegio[] = [];
  cursos: Curso[] = [];
  niveles: Nivel[] = [];
  grados: Grado[] = [];
  secciones: Seccion[] = [];
  filtroColegio: string = '';
  filtroCurso: string = '';
  filtroNivel: string = '';
  filtroGrado: string = '';
  filtroSeccion: string = '';

  pageSize = 8;
  currentPage = 1;

  // Filtros y datos de ubicación
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  private ubigeoService = inject(UbigeoService);
  private colegiosService = inject(ColegiosService);
  private cursosService = inject(CursosService);
  private nivelesService = inject(NivelesService);
  private gradosService = inject(GradosService);
  private seccionesService = inject(SeccionesService);

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarColegiosClientes();
    this.cargarNiveles();
  }

  cargarNiveles(): void {
    this.nivelesService.getNiveles().subscribe(niveles => {
      this.niveles = niveles;
    });
  }

  cargarGradosPorNivel(nivelNombre: string): void {
    if (!nivelNombre) {
      this.grados = [];
      this.filtroGrado = '';
      this.secciones = [];
      this.filtroSeccion = '';
      this.cursos = [];
      this.filtroCurso = '';
      return;
    }
    const nivelObj = this.niveles.find(n => n.nombre === nivelNombre);
    if (!nivelObj) {
      this.grados = [];
      this.filtroGrado = '';
      this.secciones = [];
      this.filtroSeccion = '';
      this.cursos = [];
      this.filtroCurso = '';
      return;
    }
    this.gradosService.getGradosPorIdNivel(nivelObj.id_nivel).subscribe(grados => {
      this.grados = grados;
      this.filtroGrado = '';
      this.secciones = [];
      this.filtroSeccion = '';
      this.cursos = [];
      this.filtroCurso = '';
    });
  }

  cargarSeccionesPorGrado(grado: string): void {
    if (!grado) {
      this.secciones = [];
      this.filtroSeccion = '';
      this.cursos = [];
      this.filtroCurso = '';
      return;
    }
    this.seccionesService.getSecciones().subscribe(secciones => {
      // Filtrar secciones por grado si el endpoint lo permite, si no, mostrar todas
      this.secciones = secciones.filter(s => s.nombre && grado ? true : true); // Ajustar si hay relación
      this.filtroSeccion = '';
      this.cursos = [];
      this.filtroCurso = '';
    });
  }

  cargarCursosPorGrado(grado: string): void {
    if (!grado) {
      this.cursos = [];
      this.filtroCurso = '';
      return;
    }
    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos.filter(c => c.grado && c.grado.nombre === grado);
      this.filtroCurso = '';
    });
  }


  cargarColegiosClientes(): void {
    this.colegiosService.getColegiosClientes().subscribe(colegios => {
      this.colegiosClientes = colegios;
    });
  }

  onNivelChange(): void {
    this.cargarGradosPorNivel(this.filtroNivel);
  }

  onGradoChange(): void {
    this.cargarSeccionesPorGrado(this.filtroGrado);
    this.cargarCursosPorGrado(this.filtroGrado);
  }

  cargarCursos(): void {
    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos;
    });
  }

  cargarDepartamentos(): void {
    this.ubigeoService.getDepartamentos().subscribe(deps => {
      this.departamentos = deps;
      this.filtroDepartamento = '';
      this.provincias = [];
      this.distritos = [];
      this.filtroProvincia = '';
      this.filtroDistrito = '';
    });
  }

  onDepartamentoChange(): void {
    const dep = this.departamentos.find(d => d.departamento === this.filtroDepartamento);
    if (dep) {
      const idDep = dep.id_ubigeo;
      this.ubigeoService.getProvincias(idDep).subscribe(provs => {
        this.provincias = provs;
        this.filtroProvincia = '';
        this.distritos = [];
        this.filtroDistrito = '';
      });
    } else {
      this.provincias = [];
      this.distritos = [];
      this.filtroProvincia = '';
      this.filtroDistrito = '';
    }
  }

  onProvinciaChange(): void {
    const prov = this.provincias.find(p => p.provincia === this.filtroProvincia);
    if (prov) {
      const idProv = prov.id_ubigeo;
      this.ubigeoService.getDistritos(idProv).subscribe(dists => {
        this.distritos = dists;
        this.filtroDistrito = '';
      });
    } else {
      this.distritos = [];
      this.filtroDistrito = '';
    }
  }

  get totalPages(): number {
    return Math.ceil(this.estudiantes.length / this.pageSize);
  }

  get estudiantesPaginados(): Estudiante[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.estudiantes.slice(start, start + this.pageSize);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
    }
  }

}
