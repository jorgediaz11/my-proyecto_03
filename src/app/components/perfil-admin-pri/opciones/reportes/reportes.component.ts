import { Component, OnInit, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';

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
  styleUrls: ['./reportes.component.css']
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

  ngOnInit(): void {
    this.cargarDepartamentos();
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
