
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { Docente } from 'src/app/services/docentes.service';

// Interfaz para clase (mock)
interface ClaseDocente {
  id_docente: number;
  nombre: string;
  grado: string;
  seccion: string;
  materia: string;
  horario: string;
  aula: string;
  estado: 'activa' | 'completada' | 'programada';
}

// ...importaciones y definición de Docente y del componente DocentesComponent...

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {
  // ...existing code...

  viewClases(docenteId: number): void {
    const docente = this.docentes.find(d => d.id_docente === docenteId);
    if (!docente) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Docente no encontrado' });
      return;
    }

    // Datos mock de clases (en un caso real, se obtendrían de un servicio)
    const clases: ClaseDocente[] = [
      { id_docente: 1, nombre: 'Matemáticas 5A', grado: '5to', seccion: 'A', materia: 'Matemáticas', horario: 'Lun-Mie-Vie 08:00-09:30', aula: 'Aula 201', estado: 'activa' },
      { id_docente: 2, nombre: 'Álgebra 4B', grado: '4to', seccion: 'B', materia: 'Álgebra', horario: 'Mar-Jue 10:00-11:30', aula: 'Aula 203', estado: 'completada' },
      { id_docente: 3, nombre: 'Geometría 3C', grado: '3ro', seccion: 'C', materia: 'Geometría', horario: 'Lun-Vie 14:00-15:30', aula: 'Aula 205', estado: 'programada' }
    ];

    let html = '';
    if (clases.length === 0) {
      html = '<p>No hay clases registradas para este docente.</p>';
    } else {
      html = `
        <div style="overflow-x:auto; max-height:350px;">
          <table class="table table-bordered table-sm" style="width:100%; font-size:14px;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Grado</th>
                <th>Sección</th>
                <th>Materia</th>
                <th>Horario</th>
                <th>Aula</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${clases.map(c => `
                <tr>
                  <td>${c.id_docente}</td>
                  <td>${c.nombre}</td>
                  <td>${c.grado}</td>
                  <td>${c.seccion}</td>
                  <td>${c.materia}</td>
                  <td>${c.horario}</td>
                  <td>${c.aula}</td>
                  <td>${c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    Swal.fire({
      title: `Clases de ${docente.nombres} ${docente.apellidos}`,
      html,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '800px'
    });
  }
  docentes: Docente[] = [
    { id_docente: 1, nombres: 'Juan', apellidos: 'Pérez García', correo: 'juan.perez@colegio.com', telefono: '987654321' },
    { id_docente: 2, nombres: 'Ana', apellidos: 'López Torres', correo: 'ana.lopez@colegio.com', telefono: '912345678' },
    { id_docente: 3, nombres: 'Carlos', apellidos: 'Ruiz Díaz', correo: 'carlos.ruiz@colegio.com', telefono: '934567890' },
    { id_docente: 4, nombres: 'Lucía', apellidos: 'Torres Vega', correo: 'lucia.torres@colegio.com', telefono: '945678901' },
    { id_docente: 5, nombres: 'Pedro', apellidos: 'Gómez Ríos', correo: 'pedro.gomez@colegio.com', telefono: '956789012' },
    { id_docente: 6, nombres: 'María', apellidos: 'Sánchez León', correo: 'maria.sanchez@colegio.com', telefono: '967890123' },
    { id_docente: 7, nombres: 'Luis', apellidos: 'Fernández Soto', correo: 'luis.fernandez@colegio.com', telefono: '978901234' },
    { id_docente: 8, nombres: 'Elena', apellidos: 'Ramírez Cruz', correo: 'elena.ramirez@colegio.com', telefono: '989012345' },
    { id_docente: 9, nombres: 'Miguel', apellidos: 'Castro Peña', correo: 'miguel.castro@colegio.com', telefono: '900123456' },
    { id_docente: 10, nombres: 'Patricia', apellidos: 'Vargas Silva', correo: 'patricia.vargas@colegio.com', telefono: '911234567' },
    { id_docente: 11, nombres: 'Jorge', apellidos: 'Morales Paredes', correo: 'jorge.morales@colegio.com', telefono: '922345678' },
    { id_docente: 12, nombres: 'Rosa', apellidos: 'Herrera Salas', correo: 'rosa.herrera@colegio.com', telefono: '933456789' },
    { id_docente: 13, nombres: 'Alberto', apellidos: 'Mendoza Rojas', correo: 'alberto.mendoza@colegio.com', telefono: '944567890' },
    { id_docente: 14, nombres: 'Carmen', apellidos: 'Flores Medina', correo: 'carmen.flores@colegio.com', telefono: '955678901' },
    { id_docente: 15, nombres: 'Ricardo', apellidos: 'Ortega Ramos', correo: 'ricardo.ortega@colegio.com', telefono: '966789012' },
    { id_docente: 16, nombres: 'Sofía', apellidos: 'Guerrero Díaz', correo: 'sofia.guerrero@colegio.com', telefono: '977890123' },
    { id_docente: 17, nombres: 'Gabriel', apellidos: 'Reyes Campos', correo: 'gabriel.reyes@colegio.com', telefono: '988901234' },
    { id_docente: 18, nombres: 'Paula', apellidos: 'Chávez Luna', correo: 'paula.chavez@colegio.com', telefono: '999012345' },
    { id_docente: 19, nombres: 'Andrés', apellidos: 'Silva Torres', correo: 'andres.silva@colegio.com', telefono: '910123456' },
    { id_docente: 20, nombres: 'Valeria', apellidos: 'Paredes Soto', correo: 'valeria.paredes@colegio.com', telefono: '921234567' }
  ];

  filteredDocentes: Docente[] = [];
  paginatedDocentes: Docente[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchDocente = '';
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';
  showForm = false;
  loading = false;
  searchTerm = '';
  // (Ya definidos más abajo, no duplicar)
  filtroColegio = '';

  // ✅ PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // ✅ FORMULARIOS
  usuarioForm!: FormGroup;
  colegioForm!: FormGroup;
  docenteForm!: FormGroup;

  // ✅ ARRAYS DE OPCIONES
  perfiles = [
    { value: 'docente', label: 'Docente' },
    { value: 'coordinador', label: 'Coordinador' },
    { value: 'director', label: 'Director' }
  ];

  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';

  private ubigeoService = inject(UbigeoService);
  // ngOnInit ya está implementado arriba, eliminar duplicado

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
    this.filterDocentes();
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
    this.filterDocentes();
  }

  // ✅ TRACKBY FUNCTION FOR PERFORMANCE
  trackByDocenteId(index: number, docente: Docente): number {
    return docente.id_docente || index;
  }

  // ✅ MÉTODO PARA GUARDAR COLEGIO
  saveColegio(): void {
    if (this.colegioForm.valid) {
      console.log('Guardando colegio:', this.colegioForm.value);
    }
  }

  // Método para manejar el evento de clic en el botón de "Crear Docente"
  ngOnInit(): void {
    this.cargarDepartamentos();
    this.filteredDocentes = [...this.docentes];
    this.updatePaginatedDocentes();
  }

  updatePaginatedDocentes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDocentes = this.filteredDocentes.slice(startIndex, endIndex);
  }

  filterDocentes(): void {
    this.filteredDocentes = this.docentes.filter(docente =>
      docente.nombres.toLowerCase().includes(this.searchDocente.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePaginatedDocentes();
  }

  createDocente(): void {
    this.showForm = true;
  }

  saveDocente(): void {
    if (this.docenteForm.valid) {
      const newdocente: Docente = {
        id: this.docentes.length + 1,
        ...this.docenteForm.value
      };
      this.docentes.push(newdocente);
      this.filteredDocentes = [...this.docentes];
      this.updatePaginatedDocentes();
      this.docenteForm.reset();
      this.showForm = false;

      Swal.fire({
        title: 'Guardado',
        text: 'El nuevo docente ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelCreate(): void {
    this.docenteForm.reset();
    this.showForm = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedDocentes();
  }

  editDocente(id_docente: number): void {
    Swal.fire({
      title: 'Editar Docente',
      text: `El docente con ID ${id_docente} será modificado.`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      console.log(`Editar docente con ID: ${id_docente}`);
    });
  }

  deleteDocente(id_docente: number): void {
    Swal.fire({
      title: 'Eliminar docente',
      text: `¿Estás seguro de que deseas eliminar el docente con ID ${id_docente}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.docentes = this.docentes.filter(docente => docente.id_docente !== id_docente);
        this.filteredDocentes = [...this.docentes];
        this.updatePaginatedDocentes();
        console.log(`docente con ID ${id_docente} eliminado.`);
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  viewDocente(id_docente: number): void {
    const docente = this.docentes.find(c => c.id_docente === id_docente);
    if (docente) {
      Swal.fire({
        title: `Detalles del docente`,
        html: `
          <p><strong>ID:</strong> ${docente.id_docente}</p>
          <p><strong>Nombre:</strong> ${docente.nombres}</p>
          <p><strong>Apellidos:</strong> ${docente.apellidos}</p>
          <p><strong>Correo:</strong> ${docente.correo}</p>
          <p><strong>Teléfono:</strong> ${docente.telefono}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      console.log(`docente con ID ${id_docente} no encontrado.`);
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredDocentes.length / this.itemsPerPage);
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
        this.docenteForm.reset();
        console.log('Formulario limpiado');
      }
    });
  }

  // ✅ MÉTODOS AUXILIARES PARA PESTAÑAS
  isTablaActive(): boolean {
    return this.activeTab === 'tabla';
  }

  isNuevoActive(): boolean {
    return this.activeTab === 'nuevo';
  }

  isAvanzadoActive(): boolean {
    return this.activeTab === 'avanzado';
  }

  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado') {
    this.activeTab = tab;
  }

  private resetFilters(): void {
    this.searchTerm = '';
    this.filtroDepartamento = '';
    this.filtroProvincia = '';
    this.filtroDistrito = '';
    this.filtroColegio = '';
    //this.carga
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
// DNI/Identificación (requerido)
// Fecha de nacimiento
// Género (dropdown)
// Foto/perfil
// Dirección
// Teléfono
// Correo electrónico (validado)
// Estado (Activo/Inactivo)
// <<Campos profesionales:>>
// Especialidad (dropdown)
// Grados académicos
// Años de experiencia
// Cursos asignados (relación múltiple)
// Horario disponible
// Tipo de contrato
// Fecha de contratación
