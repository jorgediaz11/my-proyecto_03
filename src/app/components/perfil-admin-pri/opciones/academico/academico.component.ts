import { Component } from '@angular/core';

@Component({
  selector: 'app-academico',
  templateUrl: './academico.component.html',  //  Path: src/app/components/perfil-admin-pri/opciones/academico/academico.component.html
  styleUrls: ['./academico.component.css']
})
export class AcademicoComponent { // Cambié 'AcademicoComponent' a 'app-academico'
  academicos = [
    { title: 'Cursos', image: 'assets/images/cursos.png', link: '/academico/cursos' },
    { title: 'Niveles', image: 'assets/images/niveles.png', link: '/academico/niveles' },
    { title: 'Grados', image: 'assets/images/grados.png', link: '/academico/grados' },
    { title: 'Secciones', image: 'assets/images/secciones.png', link: '/academico/secciones' }
  ];
}
