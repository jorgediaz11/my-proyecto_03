import { Component, OnInit, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { ColegiosService, Colegio } from 'src/app/services/colegios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface Estudiante { // Define la interfaz Estudiante
  id_estudiante: number;
  nombres: string;
  apellidos: string;
  id_curso: string;
  nivel: string;
  grado: string;
  seccion: string;
}

@Component({  // Cambié 'app-estudiantes' a 'app-estudiantes'
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
// export class EstudiantesComponent implements OnInit {
export class EstudiantesComponent implements OnInit {
  // === UBIGEO Y COLEGIOS ===
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  colegios: Colegio[] = [];
  private ubigeoService = inject(UbigeoService);
  private colegiosService = inject(ColegiosService);
  estudiantes: Estudiante[] = [
    { id_estudiante: 1, nombres: 'Juan', apellidos: 'Pérez García', nivel: 'Primaria', grado: '1°', seccion: 'A', id_curso: 'PRI-1-A' },
    { id_estudiante: 2, nombres: 'Ana', apellidos: 'López Torres', nivel: 'Primaria', grado: '1°', seccion: 'B', id_curso: 'PRI-1-B' },
    { id_estudiante: 3, nombres: 'Carlos', apellidos: 'Ruiz Díaz', nivel: 'Primaria', grado: '2°', seccion: 'A', id_curso: 'PRI-2-A' },
    { id_estudiante: 4, nombres: 'Lucía', apellidos: 'Torres Vega', nivel: 'Primaria', grado: '2°', seccion: 'B', id_curso: 'PRI-2-B' },
    { id_estudiante: 5, nombres: 'Pedro', apellidos: 'Gómez Ríos', nivel: 'Primaria', grado: '3°', seccion: 'A', id_curso: 'PRI-3-A' },
    { id_estudiante: 6, nombres: 'María', apellidos: 'Sánchez León', nivel: 'Primaria', grado: '3°', seccion: 'B', id_curso: 'PRI-3-B' },
    { id_estudiante: 7, nombres: 'Luis', apellidos: 'Fernández Soto', nivel: 'Primaria', grado: '4°', seccion: 'A', id_curso: 'PRI-4-A' },
    { id_estudiante: 8, nombres: 'Elena', apellidos: 'Ramírez Cruz', nivel: 'Primaria', grado: '4°', seccion: 'B', id_curso: 'PRI-4-B' },
    { id_estudiante: 9, nombres: 'Miguel', apellidos: 'Castro Peña', nivel: 'Primaria', grado: '5°', seccion: 'A', id_curso: 'PRI-5-A' },
    { id_estudiante: 10, nombres: 'Patricia', apellidos: 'Vargas Silva', nivel: 'Primaria', grado: '5°', seccion: 'B', id_curso: 'PRI-5-B' },
    { id_estudiante: 11, nombres: 'Jorge', apellidos: 'Morales Paredes', nivel: 'Primaria', grado: '6°', seccion: 'A', id_curso: 'PRI-6-A' },
    { id_estudiante: 12, nombres: 'Rosa', apellidos: 'Herrera Salas', nivel: 'Primaria', grado: '6°', seccion: 'B', id_curso: 'PRI-6-B' },
    { id_estudiante: 13, nombres: 'Alberto', apellidos: 'Mendoza Rojas', nivel: 'Secundaria', grado: '1°', seccion: 'A', id_curso: 'SEC-1-A' },
    { id_estudiante: 14, nombres: 'Carmen', apellidos: 'Flores Medina', nivel: 'Secundaria', grado: '1°', seccion: 'B', id_curso: 'SEC-1-B' },
    { id_estudiante: 15, nombres: 'Ricardo', apellidos: 'Ortega Ramos', nivel: 'Secundaria', grado: '2°', seccion: 'A', id_curso: 'SEC-2-A' },
    { id_estudiante: 16, nombres: 'Sofía', apellidos: 'Guerrero Díaz', nivel: 'Secundaria', grado: '2°', seccion: 'B', id_curso: 'SEC-2-B' },
    { id_estudiante: 17, nombres: 'Gabriel', apellidos: 'Reyes Campos', nivel: 'Secundaria', grado: '3°', seccion: 'A', id_curso: 'SEC-3-A' },
    { id_estudiante: 18, nombres: 'Paula', apellidos: 'Chávez Luna', nivel: 'Secundaria', grado: '3°', seccion: 'B', id_curso: 'SEC-3-B' },
    { id_estudiante: 19, nombres: 'Andrés', apellidos: 'Silva Torres', nivel: 'Secundaria', grado: '4°', seccion: 'A', id_curso: 'SEC-4-A' },
    { id_estudiante: 20, nombres: 'Valeria', apellidos: 'Paredes Soto', nivel: 'Secundaria', grado: '4°', seccion: 'B', id_curso: 'SEC-4-B' },
    { id_estudiante: 21, nombres: 'Martín', apellidos: 'Ríos Guzmán', nivel: 'Secundaria', grado: '5°', seccion: 'A', id_curso: 'SEC-5-A' },
    { id_estudiante: 22, nombres: 'Natalia', apellidos: 'Vega Salas', nivel: 'Secundaria', grado: '5°', seccion: 'B', id_curso: 'SEC-5-B' },
    { id_estudiante: 23, nombres: 'Diego', apellidos: 'Campos León', nivel: 'Secundaria', grado: '6°', seccion: 'A', id_curso: 'SEC-6-A' },
    { id_estudiante: 24, nombres: 'Camila', apellidos: 'Mora Rojas', nivel: 'Secundaria', grado: '6°', seccion: 'B', id_curso: 'SEC-6-B' },
    { id_estudiante: 25, nombres: 'Esteban', apellidos: 'Paz Torres', nivel: 'Primaria', grado: '1°', seccion: 'C', id_curso: 'PRI-1-C' },
    { id_estudiante: 26, nombres: 'Daniela', apellidos: 'Soto Díaz', nivel: 'Primaria', grado: '2°', seccion: 'C', id_curso: 'PRI-2-C' },
    { id_estudiante: 27, nombres: 'Tomás', apellidos: 'León Silva', nivel: 'Primaria', grado: '3°', seccion: 'C', id_curso: 'PRI-3-C' },
    { id_estudiante: 28, nombres: 'Mónica', apellidos: 'García Paredes', nivel: 'Primaria', grado: '4°', seccion: 'C', id_curso: 'PRI-4-C' },
    { id_estudiante: 29, nombres: 'Felipe', apellidos: 'Ramos Medina', nivel: 'Primaria', grado: '5°', seccion: 'C', id_curso: 'PRI-5-C' },
    { id_estudiante: 30, nombres: 'Lorena', apellidos: 'Salas Guzmán', nivel: 'Primaria', grado: '6°', seccion: 'C', id_curso: 'PRI-6-C' },
    { id_estudiante: 31, nombres: 'Hugo', apellidos: 'Mendoza Flores', nivel: 'Secundaria', grado: '1°', seccion: 'C', id_curso: 'SEC-1-C' },
    { id_estudiante: 32, nombres: 'Sandra', apellidos: 'Ortega Luna', nivel: 'Secundaria', grado: '2°', seccion: 'C', id_curso: 'SEC-2-C' },
    { id_estudiante: 33, nombres: 'Pablo', apellidos: 'Guerrero Campos', nivel: 'Secundaria', grado: '3°', seccion: 'C', id_curso: 'SEC-3-C' },
    { id_estudiante: 34, nombres: 'Alicia', apellidos: 'Reyes Ramos', nivel: 'Secundaria', grado: '4°', seccion: 'C', id_curso: 'SEC-4-C' },
    { id_estudiante: 35, nombres: 'Oscar', apellidos: 'Chávez León', nivel: 'Secundaria', grado: '5°', seccion: 'C', id_curso: 'SEC-5-C' },
    { id_estudiante: 36, nombres: 'Marina', apellidos: 'Silva Torres', nivel: 'Secundaria', grado: '6°', seccion: 'C', id_curso: 'SEC-6-C' },
    { id_estudiante: 37, nombres: 'Iván', apellidos: 'Paredes Soto', nivel: 'Primaria', grado: '1°', seccion: 'D', id_curso: 'PRI-1-D' },
    { id_estudiante: 38, nombres: 'Julia', apellidos: 'Ríos Guzmán', nivel: 'Primaria', grado: '2°', seccion: 'D', id_curso: 'PRI-2-D' },
    { id_estudiante: 39, nombres: 'Emilio', apellidos: 'Vega Salas', nivel: 'Primaria', grado: '3°', seccion: 'D', id_curso: 'PRI-3-D' },
    { id_estudiante: 40, nombres: 'Teresa', apellidos: 'Campos León', nivel: 'Primaria', grado: '4°', seccion: 'D', id_curso: 'PRI-4-D' },
    { id_estudiante: 41, nombres: 'Samuel', apellidos: 'Mora Rojas', nivel: 'Primaria', grado: '5°', seccion: 'D', id_curso: 'PRI-5-D' },
    { id_estudiante: 42, nombres: 'Verónica', apellidos: 'Paz Torres', nivel: 'Primaria', grado: '6°', seccion: 'D', id_curso: 'PRI-6-D' },
    { id_estudiante: 43, nombres: 'Raúl', apellidos: 'Soto Díaz', nivel: 'Secundaria', grado: '1°', seccion: 'D', id_curso: 'SEC-1-D' },
    { id_estudiante: 44, nombres: 'Silvia', apellidos: 'León Silva', nivel: 'Secundaria', grado: '2°', seccion: 'D', id_curso: 'SEC-2-D' },
    { id_estudiante: 45, nombres: 'Mario', apellidos: 'García Paredes', nivel: 'Secundaria', grado: '3°', seccion: 'D', id_curso: 'SEC-3-D' },
    { id_estudiante: 46, nombres: 'Patricia', apellidos: 'Ramos Medina', nivel: 'Secundaria', grado: '4°', seccion: 'D', id_curso: 'SEC-4-D' }
  ];


  filteredEstudiantes: Estudiante[] = [];
  paginatedEstudiantes: Estudiante[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  filtroColegio = '';

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  estudianteForm: FormGroup;
  showForm = false;

  // ✅ Propiedades necesarias para la plantilla HTML estandarizada
  loading = false;
  activeTab = 'tabla';
  searchEstudiante = '';
  isEditing = false;
  todayES = new Date().toLocaleDateString('es-ES');

  // ✅ Propiedades adicionales para los formularios y perfiles
  perfiles = [
    { value: 'estudiante', label: 'Estudiante' },
    { value: 'estudiante-avanzado', label: 'Estudiante Avanzado' }
  ];

  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  // Definición de las columnas para la tabla
  constructor() {
    this.estudianteForm = this.fb.group({
      usuario: ['', Validators.required],
      //perfil: [this.perfiles[0]?.value || 'Admin Pri', Validators.required],
      perfil: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      nivel: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
    });
  }

  // Método para manejar el evento de clic en el botón de "Crear Estudiante"
ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarColegios();
  this.filteredEstudiantes = [...this.estudiantes];
  this.updatePaginatedEstudiantes();
}

  updatePaginatedEstudiantes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEstudiantes = this.filteredEstudiantes.slice(startIndex, endIndex);
  }

  filterEstudiantes(): void {
    // Solo filtrar por nombre/apellido
    let lista = this.estudiantes;
    if (this.searchEstudiante) {
      lista = lista.filter(estudiante =>
        estudiante.nombres.toLowerCase().includes(this.searchEstudiante.toLowerCase()) ||
        estudiante.apellidos.toLowerCase().includes(this.searchEstudiante.toLowerCase())
      );
    }
    this.filteredEstudiantes = lista;
    this.currentPage = 1;
    this.updatePaginatedEstudiantes();
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
      const idDep = dep.id_ubigeo.substring(0, 2);
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
    this.filterEstudiantes();
  }

  onProvinciaChange(): void {
    const prov = this.provincias.find(p => p.provincia === this.filtroProvincia);
    if (prov) {
      const idProv = prov.id_ubigeo.substring(0, 4);
      this.ubigeoService.getDistritos(idProv).subscribe(dists => {
        this.distritos = dists;
        this.filtroDistrito = '';
      });
    } else {
      this.distritos = [];
      this.filtroDistrito = '';
    }
    this.filterEstudiantes();
  }

  cargarColegios(): void {
    this.colegiosService.getColegios().subscribe(data => {
      this.colegios = data;
    });
  }

  createEstudiante(): void {
    this.showForm = true;
  }

  saveEstudiante(): void {
    if (this.estudianteForm.valid) {
      const newestudiante: Estudiante = {
        id_estudiante: this.estudiantes.length + 1,
        ...this.estudianteForm.value
      };
      this.estudiantes.push(newestudiante);
      this.filteredEstudiantes = [...this.estudiantes];
      this.updatePaginatedEstudiantes();
      this.estudianteForm.reset();
      this.showForm = false;

      Swal.fire({
        title: 'Guardado',
        text: 'El nuevo estudiante ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelCreate(): void {
    this.estudianteForm.reset();
    this.showForm = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEstudiantes();
  }

  editEstudiante(id_estudiante: number): void {
    Swal.fire({
      title: 'Editar Estudiante',
      text: `El estudiante con ID ${id_estudiante} será modificado.`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      console.log(`Editar estudiante con ID: ${id_estudiante}`);
    });
  }

  deleteEstudiante(id_estudiante: number): void {
    Swal.fire({
      title: 'Eliminar estudiante',
      text: `¿Estás seguro de que deseas eliminar el estudiante con ID ${id_estudiante}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.estudiantes = this.estudiantes.filter(estudiante => estudiante.id_estudiante !== id_estudiante);
        this.filteredEstudiantes = [...this.estudiantes];
        this.updatePaginatedEstudiantes();
        console.log(`estudiante con ID ${id_estudiante} eliminado.`);
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  viewEstudiante(id_estudiante: number): void {
    const estudiante = this.estudiantes.find(c => c.id_estudiante === id_estudiante);
    if (estudiante) {
      Swal.fire({
        title: `Detalles del estudiante`,
        html: `
          <p><strong>ID:</strong> ${estudiante.id_estudiante}</p>
          <p><strong>Nombres:</strong> ${estudiante.nombres}</p>
          <p><strong>Apellidos:</strong> ${estudiante.apellidos}</p>
          <p><strong>Nivel:</strong> ${estudiante.nivel}</p>
          <p><strong>Grado:</strong> ${estudiante.grado}</p>
          <p><strong>Sección:</strong> ${estudiante.seccion}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      console.log(`estudiante con ID ${id_estudiante} no encontrado.`);
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredEstudiantes.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  resetForm(): void {
    Swal.fire({
      title: 'Limpiar Formulario',
      text: '¿Estás seguro de que deseas limpiar todos los campos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.estudianteForm.reset();
        console.log('Formulario limpiado');
      }
    });
  }

  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado') {
    this.activeTab = tab;
  }

  // ✅ Métodos adicionales necesarios para la plantilla estandarizada
  onSubmit() {
    if (this.estudianteForm.valid) {
      this.loading = true;
      // Simular proceso de guardado
      setTimeout(() => {
        console.log('Estudiante guardado:', this.estudianteForm.value);
        this.loading = false;
        this.activeTab = 'tabla';
        this.resetFormSimple();
      }, 1500);
    }
  }

  resetFormSimple() {
    this.estudianteForm.reset();
    this.isEditing = false;
  }

  // ✅ Métodos para la funcionalidad de la tabla
  trackByEstudianteId(index: number, estudiante: Estudiante): number {
    return estudiante.id_estudiante;
  }

  private resetFilters(): void {
    this.searchTerm = '';
    this.filtroDepartamento = '';
    this.filtroProvincia = '';
    this.filtroDistrito = '';
    this.filtroColegio = '';
    //this.carga
  }


  viewCursos(id_estudiante: number): void {
  const estudiante = this.estudiantes.find(e => e.id_estudiante === id_estudiante);

  if (estudiante) {
    const cursos = [
      {
        id: estudiante.id_curso,
        nombre: 'Nombre de curso no disponible',
        nivel: estudiante.nivel,
        grado: estudiante.grado,
        seccion: estudiante.seccion
      }
    ];

    const tablaCursos = `
      <table style="width:100%;text-align:left;border-collapse:collapse;">
        <thead>
          <tr>
            <th style='border-bottom:1px solid #ccc;padding:4px;'>Código</th>
            <th style='border-bottom:1px solid #ccc;padding:4px;'>Nombre Curso</th>
            <th style='border-bottom:1px solid #ccc;padding:4px;'>Nivel</th>
            <th style='border-bottom:1px solid #ccc;padding:4px;'>Grado</th>
            <th style='border-bottom:1px solid #ccc;padding:4px;'>Sección</th>
          </tr>
        </thead>
        <tbody>
          ${cursos.map(c => `
            <tr>
              <td style='padding:4px;'>${c.id}</td>
              <td style='padding:4px;'>${c.nombre}</td>
              <td style='padding:4px;'>${c.nivel}</td>
              <td style='padding:4px;'>${c.grado}</td>
              <td style='padding:4px;'>${c.seccion}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: 'Cursos del Estudiante',
      html: tablaCursos,
      width: 600,
      icon: 'info'
    });
  } else {
    Swal.fire({
      title: 'No encontrado',
      text: 'No se encontró el estudiante seleccionado.',
      icon: 'warning'
    });
  }
}

}

// Services
// export class UsuariosComponent implements OnInit {
//   usuarios: Usuario[] = [];
//   mensajeError: string = ''; // Para mostrar mensajes de error en el template

//   constructor(private usuarioService: UsuarioService) { }

//   ngOnInit(): void {
//     this.cargarUsuarios();
//   }

//   cargarUsuarios(): void {
//     this.usuarioService.getUsuarios().subscribe(
//       (data: Usuario[]) => {
//         this.usuarios = data;
//         this.mensajeError = ''; // Limpia cualquier mensaje de error anterior
//       },
//       (error) => {
//         console.error('Error al cargar los usuarios:', error);
//         this.mensajeError = 'Error al cargar la lista de usuarios. Por favor, inténtalo de nuevo más tarde.';
//         // Aquí podrías implementar una lógica más sofisticada para manejar diferentes tipos de errores
//       }
//     );
//   }

//   // Aquí irían los métodos para crear, editar, eliminar usuarios, etc.
// }

// <<Campos básicos:>>
// ID (autogenerado)
// Nombres (requerido)
// Apellidos (requerido)
// Fecha de nacimiento
// Género (dropdown)
// DNI/Identificación (requerido)
// Foto/perfil
// Dirección
// Teléfono
// Correo electrónico (validado)
// Estado (Activo/Inactivo)
// <<Campos académicos:>>
// Colegio (relación)
// Nivel educativo
// Grado
// Sección
// Fecha de ingreso
// Promedio académico
// Observaciones
