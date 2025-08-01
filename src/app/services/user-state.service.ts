import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// ✅ Interface interna normalizada
export interface UsuarioAutenticado {
  id_usuario: number;
  username: string;
  nombre: string;
  apellido: string;
  correo: string;       // ← Normalizado a 'correo'
  id_perfil: number;    // ← Normalizado a 'id_perfil'
  id_colegio: number;   // ← Normalizado a 'id_colegio'
  estado: string;       // ← Normalizado a string
}

export interface PerfilUsuario {
  nombreCompleto: string;
  rolNombre: string;
  rolCorto: string;
  iniciales: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  // ✅ Observable para el usuario actual
  private usuarioActualSubject = new BehaviorSubject<UsuarioAutenticado | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

  // ✅ Configuración de roles (centralizada)
  private readonly perfiles = [
    { value: 1, label: 'Administrador Principal', shortLabel: 'Admin Pri' },
    { value: 2, label: 'Administrador Colegio', shortLabel: 'Admin Col' },
    { value: 3, label: 'Docente', shortLabel: 'Docente' },
    { value: 4, label: 'Estudiante', shortLabel: 'Estudiante' },
    { value: 5, label: 'Familia', shortLabel: 'Familia' },
    { value: 6, label: 'Editor', shortLabel: 'Editor' }
  ];

  constructor() {
    console.log('🚀 UserStateService: Inicializando servicio...');

    // ✅ Cargar usuario desde localStorage al inicializar
    this.cargarUsuarioDesdeStorage();

    console.log('🔍 UserStateService: Estado inicial después de construcción:', this.usuarioActualSubject.value);
  }

  // ✅ MÉTODOS PRINCIPALES

  /**
   * Cargar usuario desde localStorage
   */
  private cargarUsuarioDesdeStorage(): void {
    console.log('🔄 UserStateService: Intentando cargar usuario desde localStorage...');

    try {
      const userData = localStorage.getItem('user_data');
      console.log('📁 Raw user_data desde localStorage:', userData);

      if (userData) {
        const usuario = JSON.parse(userData) as UsuarioAutenticado;
        console.log('🔍 Usuario parseado:', usuario);

        this.usuarioActualSubject.next(usuario);
        console.log('✅ Usuario cargado y emitido desde localStorage:', usuario);
      } else {
        console.log('⚠️ No hay user_data en localStorage');
        this.usuarioActualSubject.next(null);
      }
    } catch (error) {
      console.error('❌ Error al cargar usuario desde localStorage:', error);
      this.limpiarUsuario();
    }
  }

  /**
   * Establecer usuario actual (después del login)
   */
  setUsuarioActual(usuario: UsuarioAutenticado): void {
    console.log('📝 UserStateService: Estableciendo usuario actual...');
    console.log('👤 Usuario a establecer:', usuario);

    try {
      const userDataString = JSON.stringify(usuario);
      console.log('💾 Guardando en localStorage:', userDataString);

      localStorage.setItem('user_data', userDataString);

      // Verificar que se guardó correctamente
      const verificacion = localStorage.getItem('user_data');
      console.log('✅ Verificación - dato guardado:', verificacion);

      this.usuarioActualSubject.next(usuario);
      console.log('📡 Usuario emitido por BehaviorSubject:', usuario);

      // Debug adicional
      console.log('🔍 Estado actual del observable:', this.usuarioActualSubject.value);

    } catch (error) {
      console.error('❌ Error al guardar usuario:', error);
    }
  }

  /**
   * Obtener usuario actual (sincrónico)
   */
  getUsuarioActual(): UsuarioAutenticado | null {
    const usuario = this.usuarioActualSubject.value;
    console.log('👤 getUsuarioActual llamado, valor actual:', usuario);
    return usuario;
  }

  /**
   * Obtener perfil formateado del usuario
   */
  getPerfilUsuario(): PerfilUsuario | null {
    const usuario = this.getUsuarioActual();
    console.log('🔍 getPerfilUsuario - usuario obtenido:', usuario);

    if (!usuario) {
      console.log('⚠️ getPerfilUsuario - no hay usuario, retornando null');
      return null;
    }

    const perfil = {
      nombreCompleto: `${usuario.nombre} ${usuario.apellido}`.trim(),
      rolNombre: this.getRoleName(usuario.id_perfil),
      rolCorto: this.getRoleName(usuario.id_perfil, true),
      iniciales: this.getIniciales(usuario.nombre, usuario.apellido),
      avatar: this.getAvatarUrl(usuario.id_perfil)
    };

    console.log('✅ getPerfilUsuario - perfil generado:', perfil);
    return perfil;
  }

  /**
   * Obtener nombre del rol por ID
   */
  getRoleName(id_perfil: number, isShort = false): string {
    const perfil = this.perfiles.find(p => p.value === id_perfil);
    if (perfil) {
      return isShort ? perfil.shortLabel : perfil.label;
    }
    return 'Sin definir';
  }

  /**
   * Obtener iniciales del usuario
   */
  private getIniciales(nombre: string, apellido: string): string {
    const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : '';
    const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicial1 + inicial2;
  }

  /**
   * Obtener URL del avatar según el rol
   */
  private getAvatarUrl(id_perfil: number): string {
    const avatarMap = {
      1: 'assets/images/user_admin.png',      // Admin Principal
      2: 'assets/images/user_admin.png',      // Admin Colegio
      3: 'assets/images/user_docente.png',    // Docente
      4: 'assets/images/user_estudiante.png', // Estudiante
      5: 'assets/images/user_admin.png',      // Familia
      6: 'assets/images/user_admin.png'       // Editor
    } as const;

    return (avatarMap as Record<number, string>)[id_perfil] || 'assets/images/user_admin.png';
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const usuario = this.getUsuarioActual();
    const token = localStorage.getItem('access_token');
    return !!(usuario && token);
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(id_perfil: number): boolean {
    const usuario = this.getUsuarioActual();
    return usuario ? usuario.id_perfil === id_perfil : false;
  }

  /**
   * Verificar si es administrador (principal o colegio)
   */
  isAdmin(): boolean {
    return this.hasRole(1) || this.hasRole(2);
  }

  /**
   * Limpiar datos del usuario (logout)
   */
  limpiarUsuario(): void {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      this.usuarioActualSubject.next(null);
      console.log('✅ Datos de usuario limpiados');
    } catch (error) {
      console.error('Error al limpiar datos de usuario:', error);
    }
  }

  /**
   * Obtener todos los perfiles disponibles
   */
  getPerfiles() {
    return [...this.perfiles];
  }

  /**
   * Obtener información básica para debugging
   */
  getDebugInfo() {
    const usuario = this.getUsuarioActual();
    const perfil = this.getPerfilUsuario();
    return {
      usuario,
      perfil,
      isAuthenticated: this.isAuthenticated(),
      token: localStorage.getItem('access_token') ? 'EXISTS' : 'NOT_FOUND'
    };
  }

  /**
   * MÉTODO TEMPORAL PARA DEBUG - Simular usuario en localStorage
   */
  simularUsuarioEnLocalStorage(): void {
    const usuarioSimulado: UsuarioAutenticado = {
      id_usuario: 1,
      username: 'admin_test',
      nombre: 'Juan Carlos',
      apellido: 'Pérez González',
      correo: 'admin@test.com',
      id_perfil: 1,
      id_colegio: 1,
      estado: 'activo'
    };

    localStorage.setItem('access_token', 'token_simulado_123');
    this.setUsuarioActual(usuarioSimulado);
    console.log('🧪 Usuario simulado establecido para debugging');
  }

  /**
   * MÉTODO PÚBLICO PARA FORZAR RECARGA DESDE LOCALSTORAGE
   */
  recargarDesdeLocalStorage(): void {
    console.log('🔄 Forzando recarga desde localStorage...');
    this.cargarUsuarioDesdeStorage();
  }

  /**
   * Establecer usuario desde respuesta del servidor
   */
  setUsuarioActualDesdeServidor(usuarioServidor: {
    id_usuario: number;
    username: string;
    nombre: string;
    apellido: string;
    correo: string;
    id_perfil: number;
    id_colegio: number;
    estado: boolean;
  }): void {
    console.log('📝 UserStateService: Recibiendo usuario del servidor...');
    console.log('🔄 Usuario del servidor:', usuarioServidor);

    // Convertir al formato interno, aceptando ambos nombres de campo
    const usuarioNormalizado: UsuarioAutenticado = {
      id_usuario: usuarioServidor.id_usuario,
      username: usuarioServidor.username,
      nombre: (usuarioServidor.nombre || (usuarioServidor as any).nombres || ''),
      apellido: (usuarioServidor.apellido || (usuarioServidor as any).apellidos || ''),
      correo: usuarioServidor.correo,         // email → correo
      id_perfil: usuarioServidor.id_perfil,   // id_perfil → id_perfil
      id_colegio: usuarioServidor.id_colegio, // id_colegio → id_colegio
      estado: usuarioServidor.estado ? 'activo' : 'inactivo' // boolean → string
    };

    console.log('✅ Usuario normalizado:', usuarioNormalizado);

    // Usar el método estándar para guardarlo
    this.setUsuarioActual(usuarioNormalizado);
  }
}
