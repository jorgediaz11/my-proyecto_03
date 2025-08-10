
import { Component, OnInit, Input, inject } from '@angular/core';
import { CursosDetalleService, CursoDetalle } from 'src/app/services/cursos-detalle.service';

@Component({
  selector: 'app-cursos-detalle',
  templateUrl: './cursos-detalle.component.html'
})
export class CursosDetalleComponent implements OnInit {
  @Input() id!: number;
  curso?: CursoDetalle;
  loading = true;

  cursosDetalleService = inject(CursosDetalleService);

  ngOnInit() {
    if (this.id) {
      this.cursosDetalleService.getDetalleCurso(this.id).subscribe(data => {
        this.curso = data;
        this.loading = false;
      });
    }
  }
}
