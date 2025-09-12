import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importa los componentes NO standalone del perfil
import { PerfilAdminPriComponent } from './perfil-admin-pri.component';
// ...importa otros componentes NO standalone según tu estructura
import { AreasGenComponent } from './opciones/areas-gen/areas-gen.component';
import { LibrosGenComponent } from './opciones/libros-gen/libros-gen.component';

import { UsuariosGenComponent } from './opciones/usuarios-gen/usuarios-gen.component';
import { ColegiosGenComponent } from './opciones/colegios-gen/colegios-gen.component';
import { DocentesGenComponent } from './opciones/docentes-gen/docentes-gen.component';
import { EstudiantesGenComponent } from './opciones/estudiantes-gen/estudiantes-gen.component';
import { EditoresGenComponent } from './opciones/editores-gen/editores-gen.component';
import { ReportesComponent } from './opciones/reportes/reportes.component'; // Importa el componente de reportes
import { AuditoriaComponent } from './opciones/auditoria/auditoria.component';
import { PerfilGenComponent } from './opciones/perfiles-gen/perfiles-gen.component';
import { AcademicoComponent } from './opciones/academico/academico.component';
import { CursosGenComponent } from './opciones/cursos-gen/cursos-gen.component';
import { ClasesColGenComponent } from './opciones/clases-col-gen/clases-col-gen.component';
import { NivelesGenComponent } from './opciones/niveles-gen/niveles-gen.component';
import { GradosGenComponent } from './opciones/grados-gen/grados-gen.component';
import { SeccionesGenComponent } from './opciones/secciones-gen/secciones-gen.component';
import { GrupofamGenComponent } from './opciones/grupofam-gen/grupofam-gen.component';
import { UnidadesGenComponent } from './opciones/unidades-gen/unidades-gen.component';
import { MaterialesGenComponent } from './opciones/materiales-gen/materiales-gen.component';
import { TipoMaterialGenComponent } from './opciones/tipo-material-gen/tipo-material-gen.component';
import { ActividadesGenComponent } from './opciones/actividades-gen/actividades-gen.component';
import { TipoActividadGenComponent } from './opciones/tipo-actividad-gen/tipo-actividad-gen.component';
import { PeriodoAcademicoGenComponent } from './opciones/periodo-academico-gen/periodo-academico-gen.component';
import { AulasGenComponent } from './opciones/aulas-gen/aulas-gen.component';
import { TipoPreguntaGenComponent } from './opciones/tipo-pregunta-gen/tipo-pregunta-gen.component';

// Importa las rutas secundarias del perfil
import { routes } from './perfil-admin-pri.routes';

@NgModule({
  declarations: [
    PerfilAdminPriComponent,
    // ...otros componentes NO standalone
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // ...otros módulos necesarios para este perfil
    // Standalone components aquí
    AreasGenComponent,
    LibrosGenComponent,
    MaterialesGenComponent,
    NivelesGenComponent,
    ClasesColGenComponent,
    UnidadesGenComponent,
    ActividadesGenComponent,
    TipoActividadGenComponent,
    TipoPreguntaGenComponent,
    PerfilGenComponent,
    PeriodoAcademicoGenComponent,
    UsuariosGenComponent,
    ColegiosGenComponent,
    AulasGenComponent,
    CursosGenComponent,
    EditoresGenComponent,
    GradosGenComponent    
  ]
})
export class PerfilAdminPriModule {}