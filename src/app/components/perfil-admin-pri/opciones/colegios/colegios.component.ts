import { Component, OnInit } from '@angular/core';  // Asegúrate de que el import sea correcto
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
//import { UsuarioService, Usuario } from '../../../../services/usuario.service';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface Colegio { // Define la interfaz Colegio
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

@Component({  // Cambié 'app-colegios' a 'app-colegios'
  selector: 'app-colegios',
  templateUrl: './colegios.component.html',
  styleUrls: ['./colegios.component.css']
})
// export class ColegiosComponent implements OnInit {
export class ColegiosComponent  {
  colegios: Colegio[] = [
    { id:1, nombre: 'Colegio Central', direccion: 'Av. Principal 123', telefono: '987654321' },
    { id:2, nombre: 'Colegio San Martín', direccion: 'Calle Lima 456', telefono: '912345678' },
    { id:3, nombre: 'Colegio América', direccion: 'Jr. Amazonas 789', telefono: '934567890' },
    { id:4, nombre: 'Colegio Santa Rosa', direccion: 'Av. Grau 101', telefono: '945678901' },
    { id:5, nombre: 'Colegio Nacional', direccion: 'Calle Bolívar 202', telefono: '956789012' },
    { id:6, nombre: 'Colegio Moderno', direccion: 'Av. Arequipa 303', telefono: '967890123' },
    { id:7, nombre: 'Colegio Libertad', direccion: 'Jr. Cusco 404', telefono: '978901234' },
    { id:8, nombre: 'Colegio Unión', direccion: 'Av. Tacna 505', telefono: '989012345' },
    { id:9, nombre: 'Colegio Progreso', direccion: 'Calle Piura 606', telefono: '900123456' },
    { id:10, nombre: 'Colegio Esperanza', direccion: 'Jr. Puno 707', telefono: '911234567' },
    { id:11, nombre: 'Colegio Futuro', direccion: 'Av. Angamos 808', telefono: '922345678' },
    { id:12, nombre: 'Colegio Horizonte', direccion: 'Calle Tarapacá 909', telefono: '933456789' },
    { id:13, nombre: 'Colegio San José', direccion: 'Jr. Moquegua 111', telefono: '944567890' },
    { id:14, nombre: 'Colegio San Pedro', direccion: 'Av. Colonial 222', telefono: '955678901' },
    { id:15, nombre: 'Colegio Santa Ana', direccion: 'Calle Junín 333', telefono: '966789012' },
    { id:16, nombre: 'Colegio San Pablo', direccion: 'Jr. Loreto 444', telefono: '977890123' },
    { id:17, nombre: 'Colegio San Lucas', direccion: 'Av. Brasil 555', telefono: '988901234' },
    { id:18, nombre: 'Colegio San Marcos', direccion: 'Calle Ayacucho 666', telefono: '999012345' },
    { id:19, nombre: 'Colegio San Juan', direccion: 'Jr. Huánuco 777', telefono: '910123456' },
    { id:20, nombre: 'Colegio San Mateo', direccion: 'Av. Javier Prado 888', telefono: '921234567' },
    { id:21, nombre: 'Colegio San Gabriel', direccion: 'Calle Libertad 999', telefono: '932345678' },
    { id:22, nombre: 'Colegio San Rafael', direccion: 'Jr. Independencia 121', telefono: '943456789' },
    { id:23, nombre: 'Colegio San Andrés', direccion: 'Av. La Marina 232', telefono: '954567890' },
    { id:24, nombre: 'Colegio San Antonio', direccion: 'Calle Olivos 343', telefono: '965678901' },
    { id:25, nombre: 'Colegio San Francisco', direccion: 'Jr. Palmeras 454', telefono: '976789012' }
  ];

  filteredColegios: Colegio[] = [];
  paginatedColegios: Colegio[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  colegioForm: FormGroup;
  showForm: boolean = false;

  // Definición de las columnas para la tabla
  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.colegioForm = this.fb.group({
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      niveles: [[], Validators.required],
      turnos: [[], Validators.required],
      aforo: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/), // Solo números
        Validators.min(0)
      ]],
      estado: [''], // Valor inicial vacío
    });
  }

  // Método para manejar el evento de clic en el botón de "Crear Colegio"
  ngOnInit(): void {
    this.filteredColegios = [...this.colegios];
    this.updatePaginatedColegios();
  }

  updatePaginatedColegios(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedColegios = this.filteredColegios.slice(startIndex, endIndex);
  }

  filterColegios(): void {
    this.filteredColegios = this.colegios.filter(colegio =>
      colegio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePaginatedColegios();
  }

  createColegio(): void {
    this.showForm = true;
  }

  saveColegio(): void {
    if (this.colegioForm.valid) {
      const newColegio: Colegio = {
        id: this.colegios.length + 1,
        ...this.colegioForm.value
      };
      this.colegios.push(newColegio);
      this.filteredColegios = [...this.colegios];
      this.updatePaginatedColegios();
      this.colegioForm.reset();
      this.showForm = false;

      Swal.fire({
        title: 'Guardado',
        text: 'El nuevo colegio ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelCreate(): void {
    this.colegioForm.reset();
    this.showForm = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedColegios();
  }

  editColegio(id: number): void {
    Swal.fire({
      title: 'Editar Colegio',
      text: `El colegio con ID ${id} será modificado.`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      console.log(`Editar colegio con ID: ${id}`);
    });
  }

  deleteColegio(id: number): void {
    Swal.fire({
      title: 'Eliminar Colegio',
      text: `¿Estás seguro de que deseas eliminar el colegio con ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.colegios = this.colegios.filter(colegio => colegio.id !== id);
        this.filteredColegios = [...this.colegios];
        this.updatePaginatedColegios();
        console.log(`Colegio con ID ${id} eliminado.`);
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  viewColegio(id: number): void {
    const colegio = this.colegios.find(c => c.id === id);
    if (colegio) {
      Swal.fire({
        title: `Detalles del Colegio`,
        html: `
          <p><strong>ID:</strong> ${colegio.id}</p>
          <p><strong>Nombre:</strong> ${colegio.nombre}</p>
          <p><strong>Dirección:</strong> ${colegio.direccion}</p>
          <p><strong>Teléfono:</strong> ${colegio.telefono}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      console.log(`Colegio con ID ${id} no encontrado.`);
    }
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredColegios.length / this.itemsPerPage);
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
        this.colegioForm.reset();
        console.log('Formulario limpiado');
      }
    });
  }

  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado') {
    this.activeTab = tab;
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

// <<Información general:>>
// ID (autogenerado) 01
// Nombre (requerido)
// Código modular (requerido)
// Dirección completa
// Teléfono
// Correo electrónico
// Página web
// Logo
// Director(a) (relación)
// <<Ubigeo:>> 02
// Departamento
// Provincia
// Distrito
// <<Configuración académica:>>
// Niveles educativos ofrecidos ok
// Turnos (mañana/tarde/noche)  ok
// Aforo máximo
// Fecha de fundación       ok
// Estado (Activo/Inactivo) ok
