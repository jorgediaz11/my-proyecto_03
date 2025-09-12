import { Routes } from '@angular/router';
import { PerfilAdminPriComponent } from './perfil-admin-pri.component';
import { PerfilAdminPriMuroComponent } from './perfil-admin-pri-muro.component';
import { UsuariosGenComponent } from './opciones/usuarios-gen/usuarios-gen.component';
import { ColegiosGenComponent } from './opciones/colegios-gen/colegios-gen.component';
import { DocentesGenComponent } from './opciones/docentes-gen/docentes-gen.component';
import { ClasesColGenComponent } from './opciones/clases-col-gen/clases-col-gen.component';
import { EstudiantesGenComponent } from './opciones/estudiantes-gen/estudiantes-gen.component';
import { PerfilGenComponent } from './opciones/perfiles-gen/perfiles-gen.component';
import { CursosGenComponent } from './opciones/cursos-gen/cursos-gen.component';
import { NivelesGenComponent } from './opciones/niveles-gen/niveles-gen.component';
import { GradosGenComponent } from './opciones/grados-gen/grados-gen.component';
import { SeccionesGenComponent } from './opciones/secciones-gen/secciones-gen.component';
import { UnidadesGenComponent } from './opciones/unidades-gen/unidades-gen.component';
import { TipoMaterialGenComponent } from './opciones/tipo-material-gen/tipo-material-gen.component';
import { MaterialesGenComponent } from './opciones/materiales-gen/materiales-gen.component';
import { GrupofamGenComponent } from './opciones/grupofam-gen/grupofam-gen.component';
import { EditoresGenComponent } from './opciones/editores-gen/editores-gen.component';
import { AreasGenComponent } from './opciones/areas-gen/areas-gen.component';
import { PreguntasGenComponent } from './opciones/preguntas-gen/preguntas-gen.component';
import { LeccionesGenComponent } from './opciones/lecciones-gen/lecciones-gen.component';
import { LibrosGenComponent } from './opciones/libros-gen/libros-gen.component';
import { AulasGenComponent } from './opciones/aulas-gen/aulas-gen.component';
import { PeriodoAcademicoGenComponent } from './opciones/periodo-academico-gen/periodo-academico-gen.component';
import { ActividadesGenComponent } from './opciones/actividades-gen/actividades-gen.component';
import { TipoActividadGenComponent } from './opciones/tipo-actividad-gen/tipo-actividad-gen.component';
import { CuestionariosGenComponent } from './opciones/cuestionarios-gen/cuestionarios-gen.component';
import { AcademicoComponent } from './opciones/academico/academico.component';
import { ReportesComponent } from './opciones/reportes/reportes.component';
import { AuditoriaComponent } from './opciones/auditoria/auditoria.component';

export const routes: Routes = [
  {
    path: '', //perfil-admin-pri
    component: PerfilAdminPriComponent,
    children: [
      { path: '', component: PerfilAdminPriMuroComponent },
      { path: 'usuarios', component: UsuariosGenComponent },
      { path: 'colegios', component: ColegiosGenComponent },
      { path: 'docentes', component: DocentesGenComponent },
      { path: 'clases', component: ClasesColGenComponent },
      { path: 'estudiantes', component: EstudiantesGenComponent },
      { path: 'academico', component: AcademicoComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'auditoria', component: AuditoriaComponent },
      { path: 'perfiles', component: PerfilGenComponent },
      { path: 'cursos', component: CursosGenComponent },
      { path: 'niveles', component: NivelesGenComponent },
      { path: 'grados', component: GradosGenComponent },
      { path: 'secciones', component: SeccionesGenComponent },
      { path: 'unidades', component: UnidadesGenComponent },
      { path: 'tipomaterial', component: TipoMaterialGenComponent },
      { path: 'materiales', component: MaterialesGenComponent },
      { path: 'grupofam', component: GrupofamGenComponent },
      { path: 'editores', component: EditoresGenComponent },
      { path: 'areas', component: AreasGenComponent },
      { path: 'preguntas', component: PreguntasGenComponent },
      { path: 'lecciones', component: LeccionesGenComponent },
      { path: 'libros', component: LibrosGenComponent },
      { path: 'aulas', component: AulasGenComponent },
      { path: 'periodo-academico', component: PeriodoAcademicoGenComponent },
      { path: 'actividades', component: ActividadesGenComponent },
      { path: 'tipo-actividad', component: TipoActividadGenComponent },
      { path: 'cuestionarios', component: CuestionariosGenComponent }
    ]
  }
];