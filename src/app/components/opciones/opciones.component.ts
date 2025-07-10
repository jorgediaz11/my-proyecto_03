import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStateService, PerfilUsuario } from '../../services/user-state.service';

// Importar el módulo de enrutamiento
@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css']
})
export class OpcionesComponent implements OnInit, OnDestroy {

  // ✅ Inyección de dependencias con inject() - tipado explícito
  private router: Router = inject(Router);
  private userStateService: UserStateService = inject(UserStateService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // ✅ Propiedades para el usuario
  perfilUsuario: PerfilUsuario | null = null;
  private userSubscription: Subscription = new Subscription();

  // ✅ Propiedades de la interfaz
  showUserMenu = false;
  showSidebar = true;

  ngOnInit(): void {
    console.log('🚀 OpcionesComponent iniciando...');

    // ✅ Debug inicial antes de suscripción
    console.log('🔍 Estado inicial en localStorage:');
    console.log('user_data:', localStorage.getItem('user_data'));
    console.log('access_token:', localStorage.getItem('access_token') ? 'EXISTS' : 'NOT_FOUND');

    // ✅ Debug del usuario actual
    const usuarioActual = this.userStateService.getUsuarioActual();
    console.log('👤 Usuario actual del servicio:', usuarioActual);

    // ✅ IMPORTANTE: Procesar usuario actual ANTES de suscripción
    if (usuarioActual) {
      this.perfilUsuario = this.userStateService.getPerfilUsuario();
      console.log('✅ Perfil inicial cargado:', this.perfilUsuario);
    }

    // ✅ Suscribirse a cambios en el usuario
    this.userSubscription = this.userStateService.usuarioActual$.subscribe(usuario => {
      console.log('📡 Observable usuarioActual$ emitió:', usuario);

      if (usuario) {
        this.perfilUsuario = this.userStateService.getPerfilUsuario();
        console.log('✅ Perfil de usuario cargado en opciones:', this.perfilUsuario);
      } else {
        this.perfilUsuario = null;
        console.log('⚠️ No hay usuario autenticado - observable emitió null');
      }

      // Forzar detección de cambios
      this.cdr.detectChanges();
    });

    // ✅ Debug info completo
    const debugInfo = this.userStateService.getDebugInfo();
    console.log('🔍 Debug info completo:', debugInfo);
  }

  ngOnDestroy(): void {
    // ✅ Limpiar suscripciones
    this.userSubscription.unsubscribe();
  }

  // ✅ Métodos de navegación
  irAlLogin() {
    this.router.navigate(['/login']);
  }

  irAInicio() {
    this.router.navigate(['/']);
  }

  // ✅ Métodos de la interfaz
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  // ✅ Método para cerrar sesión mejorado con confirmación
  cerrarSesion(): void {
    console.log('🚪 Solicitando cerrar sesión...');

    // Mostrar confirmación
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');

    if (!confirmar) {
      console.log('❌ Cierre de sesión cancelado por el usuario');
      return;
    }

    console.log('✅ Cerrando sesión confirmado, procediendo...');

    try {
      // 1. Limpiar datos del usuario del servicio y localStorage
      this.userStateService.limpiarUsuario();

      // 2. Limpiar variables locales
      this.perfilUsuario = null;

      // 3. Forzar actualización de la vista
      this.cdr.detectChanges();

      console.log('✅ Datos de sesión limpiados correctamente');
      console.log('🔄 Redirigiendo a login...');

      // 4. Navegar al login
      this.router.navigate(['/login'], {
        replaceUrl: true // Esto reemplaza la entrada actual en el historial
      });

      // 5. Opcional: mostrar mensaje de despedida
      setTimeout(() => {
        console.log('👋 Sesión cerrada exitosamente');
      }, 500);

    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);

      // Fallback: navegar al login aunque haya un error
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  // ✅ Método para cerrar sesión sin confirmación (para uso interno)
  cerrarSesionSilencioso(): void {
    console.log('🔇 Cerrando sesión silenciosamente...');

    try {
      // 1. Limpiar datos del usuario del servicio y localStorage
      this.userStateService.limpiarUsuario();

      // 2. Limpiar variables locales
      this.perfilUsuario = null;

      // 3. Forzar actualización de la vista
      this.cdr.detectChanges();

      console.log('✅ Sesión cerrada silenciosamente');

      // 4. Navegar al login
      this.router.navigate(['/login'], {
        replaceUrl: true,
        queryParams: { mensaje: 'sesion_expirada' } // Opcional: pasar info del motivo
      });

    } catch (error) {
      console.error('❌ Error al cerrar sesión silenciosamente:', error);
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  // ✅ Getter para facilitar el uso en el template
  get nombreUsuario(): string {
    const nombre = this.perfilUsuario?.nombreCompleto || 'Usuario';
    console.log('👤 Getter nombreUsuario llamado:', nombre);
    return nombre;
  }

  get rolUsuario(): string {
    const rol = this.perfilUsuario?.rolCorto || 'Sin rol';
    console.log('🏷️ Getter rolUsuario llamado:', rol);
    return rol;
  }

  get avatarUsuario(): string {
    return this.perfilUsuario?.avatar || 'assets/images/user_admin.png';
  }

  // ✅ Información adicional para el sidebar
  get iniciales(): string {
    const iniciales = this.perfilUsuario?.iniciales || 'U';
    console.log('🔤 Getter iniciales llamado:', iniciales);
    return iniciales;
  }

  get isAuthenticated(): boolean {
    const authenticated = this.userStateService.isAuthenticated();
    console.log('🔐 Getter isAuthenticated llamado:', authenticated);
    return authenticated;
  }

  get statusColor(): string {
    const color = this.isAuthenticated ? 'text-green-500' : 'text-red-500';
    console.log('🎨 Getter statusColor llamado:', color);
    return color;
  }

  get statusText(): string {
    const text = this.isAuthenticated ? 'Conectado' : 'Desconectado';
    console.log('📶 Getter statusText llamado:', text);
    return text;
  }

  // ✅ MÉTODO TEMPORAL PARA DEBUG
  simularDatosUsuario(): void {
    console.log('🧪 Simulando datos de usuario...');

    // Limpiar primero
    localStorage.clear();

    // Simular login exitoso
    this.userStateService.simularUsuarioEnLocalStorage();

    // Forzar actualización del componente
    setTimeout(() => {
      const debugInfo = this.userStateService.getDebugInfo();
      console.log('🔍 Estado después de simulación:', debugInfo);

      this.perfilUsuario = this.userStateService.getPerfilUsuario();
      console.log('👤 Perfil actualizado:', this.perfilUsuario);

      // Forzar detección de cambios
      this.cdr.detectChanges();
    }, 100);
  }

  // Método adicional para limpiar datos
  limpiarDatos(): void {
    console.log('🧹 Limpiando datos...');

    // Mostrar estado antes de limpiar
    const tokenAntes = localStorage.getItem('access_token');
    const userDataAntes = localStorage.getItem('user_data');

    this.userStateService.limpiarUsuario();
    this.perfilUsuario = null;

    // Mostrar estado después de limpiar
    const tokenDespues = localStorage.getItem('access_token');
    const userDataDespues = localStorage.getItem('user_data');

    let mensaje = '🧹 DATOS LIMPIADOS:\n\n';
    mensaje += `ANTES:\n`;
    mensaje += `- Token: ${!!tokenAntes}\n`;
    mensaje += `- User data: ${!!userDataAntes}\n\n`;
    mensaje += `DESPUÉS:\n`;
    mensaje += `- Token: ${!!tokenDespues}\n`;
    mensaje += `- User data: ${!!userDataDespues}\n\n`;
    mensaje += 'Los datos han sido eliminados del localStorage';

    alert(mensaje);
  }

  // Método para forzar recarga
  recargarDatos(): void {
    console.log('🔄 Forzando recarga desde localStorage...');
    this.userStateService.recargarDesdeLocalStorage();
  }

  // Método adicional para verificar localStorage
  verificarLocalStorage(): void {
    console.log('🔍 === VERIFICACIÓN DE LOCALSTORAGE ===');
    console.log('access_token:', localStorage.getItem('access_token'));
    console.log('user_data:', localStorage.getItem('user_data'));
    console.log('Todas las keys:', Object.keys(localStorage));

    // También verificar el estado del servicio
    const debugInfo = this.userStateService.getDebugInfo();
    console.log('🔍 Estado del UserStateService:', debugInfo);

    // USAR ALERT PARA MOSTRAR LA INFORMACIÓN
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    const keys = Object.keys(localStorage);

    let mensaje = '🔍 LOCALSTORAGE:\n\n';
    mensaje += `Keys: ${keys.join(', ')}\n\n`;
    mensaje += `Token existe: ${!!token}\n`;
    mensaje += `User data existe: ${!!userData}\n\n`;

    if (token) {
      mensaje += `Token (50 chars): ${token.substring(0, 50)}...\n\n`;
    }

    if (userData) {
      mensaje += `User data: ${userData}\n`;
    } else {
      mensaje += 'User data: NO EXISTE\n';
    }

    alert(mensaje);
  }

  // MÉTODO TEMPORAL PARA PROBAR LOGIN DIRECTO
  async probarLoginDirecto(): Promise<void> {
    console.log('🧪 === PRUEBA DE LOGIN DIRECTO ===');

    try {
      // Intentar login directo con fetch
      const loginData = {
        username: 'tu_username_aqui', // 👈 CAMBIAR POR TU USERNAME REAL
        password: 'tu_password_aqui'  // 👈 CAMBIAR POR TU PASSWORD REAL
      };

      console.log('📤 Enviando request a:', 'http://localhost:3000/auth/login');
      console.log('📦 Payload:', { username: loginData.username, password: '***' });

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      console.log('📡 Status:', response.status);
      console.log('📊 Status text:', response.statusText);

      if (!response.ok) {
        console.error('❌ Response no OK:', response.statusText);
        const errorText = await response.text();
        console.error('📄 Error body:', errorText);
        return;
      }

      const data = await response.json();
      console.log('✅ Response completa:', data);
      console.log('🔑 Token existe:', !!data.access_token);
      console.log('👤 User existe:', !!data.user);

      if (data.user) {
        console.log('👤 Estructura del usuario:', Object.keys(data.user));
        console.log('📋 Datos del usuario:', data.user);
      }

    } catch (error) {
      console.error('❌ Error en prueba directa:', error);
    }
  }

  // MÉTODO PARA DECODIFICAR JWT Y VER SU CONTENIDO
  decodificarToken(): void {
    console.log('🔐 === DECODIFICACIÓN DE TOKEN JWT ===');

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ No hay token en localStorage');
      alert('❌ No hay token en localStorage');
      return;
    }

    try {
      // Decodificar JWT (solo la parte del payload)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Token JWT inválido - no tiene 3 partes');
        alert('❌ Token JWT inválido - no tiene 3 partes');
        return;
      }

      // Decodificar el payload (segunda parte)
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));

      console.log('🔍 Token completo:', token);
      console.log('📦 Payload decodificado:', decoded);
      console.log('👤 Usuario ID:', decoded.sub);
      console.log('📧 Username:', decoded.username);
      console.log('⏰ Issued at:', new Date(decoded.iat * 1000));
      console.log('⏱️ Expires at:', new Date(decoded.exp * 1000));

      // MOSTRAR CON ALERT
      let mensaje = '🔐 TOKEN DECODIFICADO:\n\n';
      mensaje += `Usuario ID: ${decoded.sub}\n`;
      mensaje += `Username: ${decoded.username}\n`;
      mensaje += `Creado: ${new Date(decoded.iat * 1000).toLocaleString()}\n`;
      mensaje += `Expira: ${new Date(decoded.exp * 1000).toLocaleString()}\n\n`;
      mensaje += `Payload completo:\n${JSON.stringify(decoded, null, 2)}`;

      alert(mensaje);

    } catch (error) {
      console.error('❌ Error al decodificar token:', error);
      alert('❌ Error al decodificar token: ' + error);
    }
  }

  // MÉTODO SIMPLE PARA PROBAR FUNCIONALIDAD
  testSimple(): void {
    alert('✅ Los métodos SÍ funcionan!');
    console.log('✅ testSimple() ejecutado correctamente');

    // Mostrar información básica
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');

    console.log('🔍 ESTADO ACTUAL:');
    console.log('Token existe:', !!token);
    console.log('User data existe:', !!userData);
    console.log('Token (primeros 50 chars):', token ? token.substring(0, 50) + '...' : 'NO EXISTE');
    console.log('User data:', userData || 'NO EXISTE');
  }

  // 🎯 MÉTODO PARA VERIFICAR ESTADO POST-LOGIN
  verificarEstadoPostLogin(): void {
    console.log('\n🎯 === VERIFICACIÓN COMPLETA POST-LOGIN ===\n');

    // 1. Verificar LocalStorage
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');

    console.log('📊 LOCALSTORAGE:');
    console.log('✅ Token existe:', !!token);
    console.log('✅ User data existe:', !!userData);

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log('👤 Datos de usuario parseados:', parsedUserData);
      } catch (error) {
        console.error('❌ Error al parsear user data:', error);
      }
    }

    // 2. Verificar UserStateService
    const usuario = this.userStateService.getUsuarioActual();
    console.log('\n🔧 USERSTATE SERVICE:');
    console.log('✅ Usuario en servicio:', !!usuario);

    if (usuario) {
      console.log('👤 Usuario completo:', usuario);
      console.log('📧 Correo:', usuario.correo);
      console.log('👤 Nombre completo:', `${usuario.nombre} ${usuario.apellido}`);
      console.log('🎭 Rol ID:', usuario.idrol);
      console.log('🏫 Colegio ID:', usuario.idcolegio);
      console.log('✅ Estado:', usuario.estado);
    }

    // 3. Verificar estado de la UI
    console.log('\n🖥️ ESTADO DE LA UI:');
    console.log('👤 Perfil usuario (variable):', this.perfilUsuario);
    console.log('👤 Nombre mostrado:', this.nombreUsuario);
    console.log('🎭 Rol mostrado:', this.rolUsuario);

    // 4. Resumen para el usuario
    let resumen = '🎯 VERIFICACIÓN POST-LOGIN:\n\n';
    resumen += `✅ Token en LocalStorage: ${!!token}\n`;
    resumen += `✅ User data en LocalStorage: ${!!userData}\n`;
    resumen += `✅ Usuario en UserStateService: ${!!usuario}\n`;
    resumen += `✅ UI actualizada: ${!!this.perfilUsuario}\n\n`;

    if (usuario) {
      resumen += `DATOS DEL USUARIO:\n`;
      resumen += `• Nombre: ${usuario.nombre} ${usuario.apellido}\n`;
      resumen += `• Email: ${usuario.correo}\n`;
      resumen += `• Rol ID: ${usuario.idrol}\n`;
      resumen += `• Estado: ${usuario.estado}\n`;
    }

    resumen += '\nRevisa la consola para más detalles.';
    alert(resumen);

    console.log('\n🎯 === FIN DE VERIFICACIÓN ===\n');
  }
}
