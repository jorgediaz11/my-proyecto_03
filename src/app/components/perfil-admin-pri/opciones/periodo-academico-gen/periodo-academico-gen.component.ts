import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeriodosAcademicosService, PeriodoAcademico } from 'src/app/services/periodos-academicos.service';
import Swal from 'sweetalert2';

@Component({
		selector: 'app-periodo-academico',
		templateUrl: './periodo-academico-gen.component.html',
		styleUrls: ['./periodo-academico-gen.component.css'],
		standalone: true,
		imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PeriodoAcademicoGenComponent implements OnInit {
	Math = Math;
	periodos: PeriodoAcademico[] = [];
	filteredPeriodos: PeriodoAcademico[] = [];
	paginatedPeriodos: PeriodoAcademico[] = [];
	currentPage = 1;
	itemsPerPage = 10;
	searchTerm = '';
	isEditing = false;
	editingPeriodoId?: number;
	loading = false;
	activeTab: 'tabla' | 'nuevo' = 'tabla';

	periodoForm!: FormGroup;
	private fb = inject(FormBuilder);
	private periodosService = inject(PeriodosAcademicosService);

	ngOnInit(): void {
	this.initForm();
	this.cargarPeriodos();
	}

	cargarPeriodos(): void {
		this.loading = true;
		this.periodosService.getPeriodosAcademicos().subscribe({
			next: (data: PeriodoAcademico[]) => {
				this.periodos = data;
				this.filteredPeriodos = [...data];
				this.updatePaginatedPeriodos();
				this.loading = false;
			},
			error: (error: unknown) => {
				this.loading = false;
				console.error('Error al cargar periodos:', error);
			}
		});
	}

	private initForm(): void {
		this.periodoForm = this.fb.group({
			nombre: ['', [Validators.required, Validators.minLength(2)]],
			anio: [new Date().getFullYear(), [Validators.required, Validators.pattern('^[0-9]{4}$')]],
			fecha_inicio: ['', [Validators.required]],
			fecha_fin: ['', [Validators.required]],
			estado: [true, [Validators.required]]
		});
	}

	filterPeriodos(): void {
		if (!this.searchTerm.trim()) {
			this.filteredPeriodos = [...this.periodos];
		} else {
			this.filteredPeriodos = this.periodos.filter(periodo =>
				periodo.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
			);
		}
		this.currentPage = 1;
		this.updatePaginatedPeriodos();
	}

	updatePaginatedPeriodos(): void {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		this.paginatedPeriodos = this.filteredPeriodos.slice(startIndex, endIndex);
	}

	onPageChange(page: number): void {
		this.currentPage = page;
		this.updatePaginatedPeriodos();
	}

	selectTab(tab: 'tabla' | 'nuevo'): void {
		this.activeTab = tab;
		if (tab === 'nuevo') {
			this.isEditing = false;
			this.periodoForm.reset({ estado: true });
		}
	}

  viewPeriodo(id_periodo: number): void {
      const periodo = this.periodos.find(p => p.id_periodo_academico === id_periodo);
      if (!periodo) {
        this.handleError('Periodo académico no encontrado');
        return;
      }

      Swal.fire({
        title: `Detalles del Periodo Académico`,
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${periodo.id_periodo_academico}</p>
            <p><strong>Nombre:</strong> ${periodo.nombre}</p>
            <p><strong>Estado:</strong> ${periodo.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });

    }

	editPeriodo(id_periodo: number): void {
		this.isEditing = true;
		this.editingPeriodoId = id_periodo;
		const periodo = this.periodos.find(p => p.id_periodo_academico === id_periodo);
		if (periodo) {
			this.periodoForm.patchValue({
				nombre: periodo.nombre,
				anio: periodo.anio,
				fecha_inicio: periodo.fecha_inicio,
				fecha_fin: periodo.fecha_fin,
				estado: periodo.estado
			});
			this.selectTab('nuevo');
		}
	}

  deletePeriodo(id_periodo: number): void {
    const periodo = this.periodos.find(p => p.id_periodo_academico === id_periodo);
    if (!periodo) {
      this.handleError('Periodo académico no encontrado');
      return;
    }

    Swal.fire({
      title: '¿Eliminar Periodo Académico?',
      text: `¿Estás seguro de que deseas eliminar el periodo académico "${periodo.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
		this.loading = true;
		this.periodosService.eliminarPeriodoAcademico(id_periodo).subscribe({
		  next: () => {
			this.loading = false;
			this.handleSuccess('Periodo académico eliminado correctamente');
			this.cargarPeriodos();
		  },
		  error: (error: unknown) => {
			this.loading = false;
			this.handleError('Error al eliminar el periodo académico');
			console.error('Error:', error);
		  }
		});
      }
    });
  }

	detailPeriodo(id_periodo: number): void {
    const periodo = this.periodos.find(p => p.id_periodo_academico === id_periodo);
    if (periodo) {
      Swal.fire({
        title: 'Detalle periodo académico',
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${periodo.id_periodo_academico}</p>
            <p><strong>Nombre:</strong> ${periodo.nombre}</p>
            <p><strong>Estado:</strong> ${periodo.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '600px'
      });
    }
  }

	onSubmit(): void {
		if (this.periodoForm.invalid) return;
		const periodoData = this.periodoForm.value;
		if (this.isEditing && this.editingPeriodoId) {
			// Editar
			this.periodosService.actualizarPeriodoAcademico(this.editingPeriodoId, periodoData).subscribe({
				next: () => {
					this.cargarPeriodos();
					this.isEditing = false;
					this.editingPeriodoId = undefined;
					this.periodoForm.reset({
						nombre: '',
						anio: new Date().getFullYear(),
						fecha_inicio: '',
						fecha_fin: '',
						estado: true
					});
					this.selectTab('tabla');
				},
				error: (error: unknown) => {
					console.error('Error al actualizar periodo académico:', error);
				}
			});
		} else {
			// Crear
			this.periodosService.crearPeriodoAcademico(periodoData).subscribe({
				next: () => {
					this.cargarPeriodos();
					this.periodoForm.reset({
						nombre: '',
						anio: new Date().getFullYear(),
						fecha_inicio: '',
						fecha_fin: '',
						estado: true
					});
					this.selectTab('tabla');
				},
				error: (error: unknown) => {
					console.error('Error al crear periodo académico:', error);
				}
			});
		}
	}

  // ✅ MANEJO DE ERRORES
  private handleError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  // ✅ MANEJO DE ÉXITO
  private handleSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#28a745'
    });
  }

}
