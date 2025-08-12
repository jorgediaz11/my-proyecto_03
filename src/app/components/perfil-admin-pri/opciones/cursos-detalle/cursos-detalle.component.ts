
import { Component, OnInit, Input, inject } from '@angular/core';
import { CursosDetalleService, CursoDetalle } from 'src/app/services/cursos-detalle.service';

@Component({
    selector: 'app-cursos-detalle',
    templateUrl: './cursos-detalle.component.html',
    standalone: false
})
export class CursosDetalleComponent implements OnInit {
  @Input() id!: number;
  curso?: CursoDetalle;
  loading = true;

  cursosDetalleService = inject(CursosDetalleService);

  ngOnInit() {
    if (this.id) {
      this.cursosDetalleService.getDetalleCurso(this.id).subscribe(data => {
        this.curso = {
          id_curso: data.id_curso,
          nombre: data.nombre_curso,
          descripcion: data.descripcion_curso,
          unidades: (data.unidades || []).map(unidad => ({
            id_unidad: unidad.id_unidad,
            nombre: unidad.nombre_unidad,
            orden: unidad.orden_unidad,
            descripcion: unidad.descripcion_unidad,
            lecciones: (unidad.lecciones || []).map(leccion => ({
              id_leccion: leccion.id_leccion,
              titulo: leccion.titulo_leccion,
              contenido: leccion.contenido_leccion
            }))
          }))
        };
        this.loading = false;
      });
    }
  }
}
