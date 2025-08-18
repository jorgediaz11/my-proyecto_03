import { LibrosComponent } from './components/perfil-admin-pri/opciones/libros/libros.component';
import { LeccionesComponent } from './components/perfil-admin-pri/opciones/lecciones/lecciones.component';
import { AreasComponent } from './components/perfil-admin-pri/opciones/areas/areas.component';
import { PreguntasComponent } from './components/perfil-admin-pri/opciones/preguntas/preguntas.component';
import { Routes } from '@angular/router';
// Inicio
import { InicioComponent } from './inicio/inicio.component';
// Login / Registro
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
import { LoginRecuperaComponent } from './components/login-recupera/login-recupera.component'; // Importar el componente de recuperación de contraseña
// Menu TMP Opciones
import { OpcionesComponent } from './components/opciones/opciones.component';
// Perfil Administrador Pri
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { PerfilAdminPriMuroComponent } from './components/perfil-admin-pri/perfil-admin-pri-muro.component'; // Importar el nuevo componente
import { UsuariosComponent } from './components/perfil-admin-pri/opciones/usuarios/usuarios.component';
import { ColegiosComponent } from './components/perfil-admin-pri/opciones/colegios/colegios.component';
import { ClasesColComponent } from './components/perfil-admin-pri/opciones/clases-col/clases-col.component';
import { DocentesComponent } from './components/perfil-admin-pri/opciones/docentes/docentes.component';
import { EstudiantesComponent } from './components/perfil-admin-pri/opciones/estudiantes/estudiantes.component';
import { AcademicoComponent } from './components/perfil-admin-pri/opciones/academico/academico.component';
import { ReportesComponent } from './components/perfil-admin-pri/opciones/reportes/reportes.component';
import { AuditoriaComponent } from './components/perfil-admin-pri/opciones/auditoria/auditoria.component';
import { PerfilComponent } from './components/perfil-admin-pri/opciones/perfiles/perfiles.component';
import { CursosComponent } from './components/perfil-admin-pri/opciones/cursos/cursos.component';
import { NivelesComponent } from './components/perfil-admin-pri/opciones/niveles/niveles.component';
import { GradosComponent } from './components/perfil-admin-pri/opciones/grados/grados.component';
import { SeccionesComponent } from './components/perfil-admin-pri/opciones/secciones/secciones.component';
import { GrupofamComponent } from './components/perfil-admin-pri/opciones/grupofam/grupofam.component';
import { UnidadesComponent } from './components/perfil-admin-pri/opciones/unidades/unidades.component';
import { MaterialesComponent } from './components/perfil-admin-pri/opciones/materiales/materiales.component';
import { TipoMaterialComponent } from './components/perfil-admin-pri/opciones/tipo-material/tipo-material.component';
import { CuestionariosComponent } from './components/perfil-admin-pri/opciones/cuestionarios/cuestionarios.component';
import { AulasComponent } from './components/perfil-admin-pri/opciones/aulas/aulas.component';
import { PeriodoAcademicoComponent } from './components/perfil-admin-pri/opciones/periodo-academico/periodo-academico.component';
import { ActividadesComponent } from './components/perfil-admin-pri/opciones/actividades/actividades.component';
import { TipoActividadComponent } from './components/perfil-admin-pri/opciones/tipo-actividad/tipo-actividad.component';
// Perfil Administrador Sec
import { PerfilAdminSecComponent } from './components/perfil-admin-sec/perfil-admin-sec.component';
import { PerfilAdminSecMuroComponent } from './components/perfil-admin-sec/perfil-admin-sec-muro.component'; // Importar el nuevo componente
// Perfil Docente
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
import { PerfilDocenteMuroComponent } from './components/perfil-docente/perfil-docente-muro.component';     // Importar el nuevo componente
// Perfil Estudiante
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
import { PerfilEstudianteMuroComponent } from './components/perfil-estudiante/perfil-estudiante-muro.component';   // Importar el nuevo componente
// Perfil Familia
import { PerfilFamiliaComponent } from './components/perfil-familia/perfil-familia.component';
import { PerfilFamiliaMuroComponent } from './components/perfil-familia/perfil-familia-muro.component';   // Importar el nuevo componente
// Perfil Editor
import { PerfilEditorComponent } from './components/perfil-editor/perfil-editor.component';
import { PerfilEditorMuroComponent } from './components/perfil-editor/perfil-editor-muro.component'; // Importar el nuevo componente

// Test Component
import { TestEndpointsComponent } from './test-endpoints.component';

// Confirm Dialog
export const routes: Routes = [
// Ruta para el inicio
  { path: '', component: InicioComponent }, // Componente inicial

  // Ruta para el login y registro
  { path: 'login', component: LoginFormComponent },         // Ruta para el login
  { path: 'login-registro', component: LoginRegistroComponent },  // Ruta para el registro
  { path: 'login-recupera', component: LoginRecuperaComponent }, // Ruta para la recuperación de contraseña

  // Agregar estas líneas a tu array de routes existente
  { path: 'users', component: UsuariosComponent },
  { path: 'users/create', component: UsuariosComponent }, // o un componente específico de creación
  { path: 'users/edit/:id', component: UsuariosComponent }, // o un componente específico de edición

  // Ruta para el menú de opciones
  { path: 'opciones', component: OpcionesComponent },       // Ruta para la página de opciones

  // Ruta para el perfil de admin
  { path: 'perfil-admin-pri',                               // Ruta para el perfil de admin pri
    component: PerfilAdminPriComponent,
    children: [
      { path: '', component: PerfilAdminPriMuroComponent }, // Ruta predeterminada
      { path: 'usuarios', component: UsuariosComponent },   // Ruta para la sección de usuarios
      { path: 'colegios', component: ColegiosComponent },   // Ruta para la sección de colegios
      { path: 'docentes', component: DocentesComponent },   // Ruta para la sección de docentes
      { path: 'clases', component: ClasesColComponent },    // Ruta para la sección de clases
      { path: 'estudiantes', component: EstudiantesComponent }, // Ruta para la sección de estudiantes
      { path: 'academico', component: AcademicoComponent }, // Ruta para la sección académica
      { path: 'reportes', component: ReportesComponent },   // Ruta para la sección de reportes
      { path: 'auditoria', component: AuditoriaComponent }, // Ruta para la sección de configuración
      { path: 'perfiles', component: PerfilComponent },       // Ruta para la sección de perfiles
      { path: 'cursos', component: CursosComponent },       // Ruta para la sección de cursos
      { path: 'niveles', component: NivelesComponent },       // Ruta para la sección de niveles
      { path: 'grados', component: GradosComponent },       // Ruta para la sección de grados
      { path: 'secciones', component: SeccionesComponent },   // Ruta para la sección de secciones
      { path: 'unidades', component: UnidadesComponent },     // Ruta para la sección de unidades
      { path: 'tipomaterial', component: TipoMaterialComponent }, // Ruta para la sección de tipo de material
      { path: 'materiales', component: MaterialesComponent },     // Ruta para la sección de materiales
      { path: 'grupofam', component: GrupofamComponent },     // Ruta para la sección de grupo familiar
  { path: 'areas', component: AreasComponent }, // Ruta para la sección de áreas
  { path: 'preguntas', component: PreguntasComponent }, // Ruta para la sección de preguntas
  { path: 'lecciones', component: LeccionesComponent }, // Ruta para la sección de lecciones
  { path: 'libros', component: LibrosComponent }, // Ruta para la sección de libros
  { path: 'aulas', component: AulasComponent }, // Ruta para la sección de aulas
      { path: 'periodo-academico', component: PeriodoAcademicoComponent }, // Ruta para la sección de periodos académicos
      { path: 'actividades', component: ActividadesComponent }, // Ruta para la sección de actividades
      { path: 'tipo-actividad', component: TipoActividadComponent }, // Ruta para la sección de tipo de actividad
      { path: 'cuestionarios', component: CuestionariosComponent }, // Ruta para la sección de cuestionarios
    ]
  },
// Ruta para el perfil de admin sec
  { path: 'perfil-admin-sec',
    component: PerfilAdminSecComponent,                     // Componente del perfil de admin sec
    children: [
      { path: '', component: PerfilAdminSecMuroComponent }    // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil de docente
  { path: 'perfil-docente',
    component: PerfilDocenteComponent,                        // Ruta para el perfil de docente
    children: [
      { path: '', component: PerfilDocenteMuroComponent }     // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil de estudiante
  { path: 'perfil-estudiante',
    component: PerfilEstudianteComponent,                     // Ruta para el perfil de estudiante
    children: [
      { path: '', component: PerfilEstudianteMuroComponent }  // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil de familia
  { path: 'perfil-familia',
    component: PerfilFamiliaComponent,                        // Ruta para el perfil de familia
    children: [
      { path: '', component: PerfilFamiliaMuroComponent }     // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil editor
{ path: 'perfil-editor',
    component: PerfilEditorComponent,                        // Ruta para el perfil Editor
    children: [
      { path: '', component: PerfilEditorMuroComponent }     // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

  // Ruta para el componente de prueba de endpoints
  { path: 'test-endpoints', component: TestEndpointsComponent },

// Redirección para rutas no válidas
  { path: '**', redirectTo: '' }                              // Redirige a la ruta inicial si no se encuentra la ruta solicitada
];
