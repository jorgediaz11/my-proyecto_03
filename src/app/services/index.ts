// 🔧 Archivo de barril para servicios
// Exporta todos los servicios del sistema educativo

// ✅ Servicios de autenticación y usuarios
export * from './auth.service';
export * from './users.service';
export * from './usuario.service';
export * from './user-state.service';

// 🏫 Servicios institucionales
export * from './colegios.service';
export * from './perfiles.service';

// 👥 Servicios de personas
export * from './docentes.service';
export * from './estudiantes.service';
export * from './editores.service';

// 📚 Servicios académicos básicos
export * from './niveles.service';
export * from './grados.service';
export * from './secciones.service';
export * from './cursos.service';
export * from './turnos.service';
export * from './periodos-academicos.service';

// 🔧 Servicios de utilidad
export * from './loading.service';

// 📝 Resumen de servicios disponibles:
/*
SERVICIOS DE REGISTROS BÁSICOS IMPLEMENTADOS:

1. 📋 PERFILES (perfiles.service.ts)
   - Gestión de roles y permisos del sistema
   - CRUD completo con validaciones
   - Tipos: administrador, docente, estudiante, editor, familia

2. 📚 NIVELES (niveles.service.ts)
   - Gestión de niveles educativos (Inicial, Primaria, Secundaria)
   - Ordenamiento por secuencia
   - Filtros por colegio y estado

3. 🎯 GRADOS (grados.service.ts)
   - Gestión de grados por nivel (1°, 2°, 3°, etc.)
   - Relación con niveles educativos
   - Edad recomendada por grado

4. 📝 SECCIONES (secciones.service.ts)
   - Gestión de secciones por grado (A, B, C, etc.)
   - Control de capacidad y disponibilidad
   - Estadísticas de ocupación

5. ⏰ TURNOS (turnos.service.ts)
   - Gestión de horarios (Mañana, Tarde, Noche)
   - Validación de conflictos de horario
   - Control por colegio

6. 📖 CURSOS (cursos.service.ts)
   - Gestión de materias/asignaturas
   - Organización por nivel, grado y área
   - Cursos obligatorios y electivos

7. 📅 PERIODOS ACADÉMICOS (periodos-academicos.service.ts)
   - Gestión de años académicos
   - Control de periodo actual
   - Gestión de vacaciones

CARACTERÍSTICAS COMUNES:
✅ Autenticación JWT en todas las operaciones
✅ Interfaces TypeScript completas
✅ CRUD completo (Create, Read, Update, Delete)
✅ Filtros por estado activo/inactivo
✅ Filtros por colegio
✅ Validaciones de negocio
✅ Manejo de errores tipado
✅ Endpoints RESTful estándar

ENDPOINTS BASE:
- /perfiles
- /niveles
- /grados
- /secciones
- /turnos
- /cursos
- /periodos-academicos

PRÓXIMOS PASOS SUGERIDOS:
1. Implementar componentes Angular para cada módulo
2. Crear formularios reactivos para CRUD
3. Implementar validaciones en frontend
4. Crear dashboards con estadísticas
5. Implementar relaciones entre entidades
6. Agregar importación/exportación de datos
*/
