import { Component, OnInit, inject } from '@angular/core';
import { CursosService, Curso } from '../../../../services/cursos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  filteredCursos: Curso[] = [];
  paginatedCursos: Curso[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchCurso = '';
  activeTab: 'tabla' | 'nuevo' | 'avanzado' = 'tabla';
  showForm = false;
  loading = false;

  // Formularios
  cursoForm!: FormGroup;

  private cursosService = inject(CursosService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.getCursos();
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      codigo: [''],
      nivel: ['', Validators.required],
      grado: [''],
      horasSemanales: [null],
      creditos: [null],
      area: ['', Validators.required],
      esObligatorio: [false],
      estado: [true, Validators.required],
      id_colegio: [null]
    });
  }

  getCursos() {
    this.loading = true;
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.filteredCursos = data;
        this.setPaginatedCursos();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los cursos', 'error');
      }
    });
  }

  setPaginatedCursos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCursos = this.filteredCursos.slice(start, end);
  }

  onSearch() {
    const term = this.searchCurso.toLowerCase();
    this.filteredCursos = this.cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(term) ||
      (curso.codigo && curso.codigo.toLowerCase().includes(term))
    );
    this.currentPage = 1;
    this.setPaginatedCursos();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.setPaginatedCursos();
  }

  onSubmit() {
    if (this.cursoForm.invalid) return;
    const newCurso = this.cursoForm.value;
    this.cursosService.crearCurso(newCurso).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Curso creado correctamente', 'success');
        this.getCursos();
        this.activeTab = 'tabla';
        this.cursoForm.reset();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el curso', 'error');
      }
    });
  }

  // Métodos auxiliares para paginación en el template
  getTotalPages(): number {
    return Math.ceil(this.filteredCursos.length / this.itemsPerPage) || 1;
  }

  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredCursos.length);
  }

  getPagesArray(): number[] {
    return Array(this.getTotalPages()).fill(0);
  }
}
