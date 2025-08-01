
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UbigeoService, Departamento, Provincia, Distrito } from 'src/app/services/ubigeo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ClasesColService, ClaseCol as ClaseColApi, CreateClaseColDto, UpdateClaseColDto } from 'src/app/services/clases-col.service';
import { ColegiosService, Colegio } from 'src/app/services/colegios.service';


// Interfaz local para visualización (puedes ajustarla si necesitas mostrar más campos)
export interface ClaseCol {
  id_clases?: number;
  id_colegio: number;
  id_docente: number;
  id_nivel: number;
  id_grado: number;
  id_seccion: number;
  id_curso: number;
  //nombre: string; // Agregado para evitar error de propiedad
  //grado?: string; // Agregado para evitar error de propiedad
  //seccion?: string; // Agregado para evitar error de propiedad
  observaciones?: string | null;
  estado: boolean;
}


@Component({
  selector: 'app-clases-col',
  templateUrl: './clases-col.component.html',
  styleUrl: './clases-col.component.css'
})

export class ClasesColComponent implements OnInit, OnDestroy {
  // PROPIEDADES ESENCIALES
  clases: ClaseCol[] = [];
  filteredClases: ClaseCol[] = [];
  paginatedClases: ClaseCol[] = [];

  // CONTROL DE ESTADO
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  showForm = false;
  filtroDepartamento = '';
  filtroProvincia = '';
  filtroDistrito = '';
  isEditing = false;
  editingClaseId?: number;
  loading = false;
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';

  // FORMULARIO REACTIVO
  claseForm!: FormGroup;

  // CLEANUP DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // UBIGEO
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  private ubigeoService = inject(UbigeoService);
  private fb = inject(FormBuilder);
  private clasesColService = inject(ClasesColService);
  private colegiosService = inject(ColegiosService);

  colegios: Colegio[] = [];
  filtroColegio: string = '';

  // PROPIEDADES PARA EL TEMPLATE
  Math = Math;

  // OPCIONES DE NIVELES Y TURNOS
  readonly nivelesEducativos = [
    { value: 'Inicial', label: 'Inicial' },
    { value: 'Primaria', label: 'Primaria' },
    { value: 'Secundaria', label: 'Secundaria' }
  ];
  readonly turnos = [
    { value: 'Mañana', label: 'Mañana' },
    { value: 'Tarde', label: 'Tarde' },
    { value: 'Noche', label: 'Noche' }
  ];

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarClasesCol();
    this.cargarColegios();
  }

  cargarColegios(): void {
    this.colegiosService.getColegiosClientes().subscribe({
      next: (data) => {
        this.colegios = data;
      },
      error: (err) => {
        console.error('Error al cargar colegios clientes:', err);
      }
    });
  }

  cargarClasesCol(): void {
    this.loading = true;
    this.clasesColService.getClasesCol().subscribe({
      next: (data: ClaseColApi[]) => {
        this.clases = data.map(item => ({
          ...item,
          //nombre: item.nombre ?? '', // Asegura que 'nombre' siempre esté presente
          //grado: item.grado ?? '',
          //seccion: item.seccion ?? '',
          observaciones: item.observaciones ?? null,
          estado: item.estado ?? true
        }));
        this.filteredClases = [...this.clases];
        this.updatePaginatedClases();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.handleError('Error al cargar clases');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.filterClases();
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
    this.filterClases();
  }

  // TRACKBY FUNCTION
  trackByClaseId(index: number, clase: ClaseCol): number {
    return clase.id_clases || index;
  }

  // FECHA EN ESPAÑOL
  get todayES(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // INICIALIZACIÓN DEL FORMULARIO
  private initForm(): void {
    this.claseForm = this.fb.group({
      //nombre: ['', [Validators.required, Validators.minLength(3)]],
      //grado: ['', [Validators.required]],
      //seccion: ['', [Validators.required]],
      //turno: ['', [Validators.required]],
      id_colegio: [null, [Validators.required]],
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      estado: [true, [Validators.required]],
      observaciones: ['']
    });
  }

  // FILTRADO DE CLASES
  filterClases(): void {
    let filtered = [...this.clases];
    if (this.filtroColegio) {
      filtered = filtered.filter(clase => String(clase.id_colegio) === this.filtroColegio);
    }
    this.filteredClases = filtered;
    this.currentPage = 1;
    this.updatePaginatedClases();
  }

  // ACTUALIZACIÓN DE PAGINACIÓN
  updatePaginatedClases(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClases = this.filteredClases.slice(startIndex, endIndex);
  }

  // CAMBIO DE PÁGINA
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedClases();
  }

  // CAMBIO DE PESTAÑA
  selectTab(tab: 'tabla' | 'nuevo' | 'avanzado'): void {
    this.activeTab = tab;
    if (tab === 'tabla') {
      this.cancelEdit();
    }
  }

  // CREAR NUEVA CLASE
  createClase(): void {
    this.activeTab = 'nuevo';
    this.isEditing = false;
    this.editingClaseId = undefined;
    this.claseForm.reset();
    this.claseForm.patchValue({
      estado: true
    });
  }

  // GUARDAR CLASE
  saveClase(): void {
    if (this.claseForm.invalid) {
      this.markFormGroupTouched();
      this.handleError('Por favor corrige los errores en el formulario');
      return;
    }
    this.loading = true;
    const formData = this.claseForm.value;
    if (this.isEditing && this.editingClaseId) {
      // Actualizar clase existente
      const updateData: UpdateClaseColDto = { ...formData };
      this.clasesColService.actualizarClaseCol(this.editingClaseId, updateData).subscribe({
        next: () => {
          this.handleSuccess('Clase actualizada exitosamente');
          this.cargarClasesCol();
          this.cancelEdit();
        },
        error: () => {
          this.loading = false;
          this.handleError('Error al actualizar la clase');
        }
      });
    } else {
      // Crear nueva clase
      const createData: CreateClaseColDto = { ...formData };
      this.clasesColService.crearClaseCol(createData).subscribe({
        next: () => {
          this.handleSuccess('Clase creada exitosamente');
          this.cargarClasesCol();
          this.cancelEdit();
        },
        error: () => {
          this.loading = false;
          this.handleError('Error al crear la clase');
        }
      });
    }
  }

  // EDITAR CLASE
  editClase(id_clases: number): void {
    const clase = this.clases.find(c => c.id_clases === id_clases);
    if (!clase) {
      this.handleError('Clase no encontrada');
      return;
    }
    this.isEditing = true;
    this.editingClaseId = id_clases;
    this.activeTab = 'nuevo';
    this.claseForm.patchValue(clase);
  }

  // ELIMINAR CLASE
  deleteClase(id_clases: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta clase?')) return;
    this.clasesColService.eliminarClaseCol(id_clases).subscribe({
      next: () => {
        this.handleSuccess('Clase eliminada exitosamente');
        this.cargarClasesCol();
      },
      error: () => {
        this.handleError('Error al eliminar la clase');
      }
    });
  }

  // VER DETALLES DE LA CLASE
  viewClase(id_clases: number): void {
    const clase = this.clases.find(c => c.id_clases === id_clases);
    if (!clase) {
      this.handleError('Clase no encontrada');
      return;
    }
    alert(`Detalles de la clase: ${JSON.stringify(clase, null, 2)}`);
  }

  // CANCELAR EDICIÓN
  cancelEdit(): void {
    this.isEditing = false;
    this.editingClaseId = undefined;
    this.claseForm.reset();
    this.claseForm.patchValue({
      estado: true
    });
    this.activeTab = 'tabla';
  }

  // LIMPIAR FORMULARIO
  resetForm(): void {
    this.claseForm.reset();
    this.claseForm.patchValue({
      estado: true
    });
  }

  // MARCAR TODOS LOS CAMPOS COMO TOUCHED
  private markFormGroupTouched(): void {
    Object.keys(this.claseForm.controls).forEach(key => {
      const control = this.claseForm.get(key);
      control?.markAsTouched();
    });
  }

  // MANEJO DE ERRORES
  private handleError(message: string): void {
    alert('Error: ' + message);
  }

  // MANEJO DE ÉXITO
  private handleSuccess(message: string): void {
    alert('Éxito: ' + message);
  }

  // PAGINACIÓN - TOTAL DE PÁGINAS
  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredClases.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // GETTER PARA FORMULARIO
  get f() {
    return this.claseForm.controls;
  }

  // VERIFICAR SI EL FORMULARIO PUEDE SER ENVIADO
  get canSubmit(): boolean {
    return this.claseForm.valid && !this.loading;
  }

  // MÉTODOS PARA EL LOGO (NO IMPLEMENTADO)
  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      // Aquí implementarías la lógica para subir el logo
      alert('Logo seleccionado: ' + file.name);
    }
  }

  // MÉTODOS DE VISTA (NO IMPLEMENTADOS)
  viewDocentes(id_clase: number): void {
    alert('Ver docentes de la clase: ' + id_clase);
  }

  // MÉTODO DE FILTRO DE COLEGIOS (placeholder, sin lógica)
  filterDocentes(): void {
    // Aquí se implementará el filtrado de docentes por colegio si se requiere
  }
}
