import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStateService, PerfilUsuario } from '../../services/user-state.service';
interface MenuItem {
  label: string;      // Cambié 'label' a 'label'
  icon: string;       // Cambié 'icon' a 'icon'
  route: string;      // Cambié 'route' a 'route'
  disabled: boolean;  // Added the missing 'disabled' property
}

@Component({
  // standalone: true,
  selector: 'app-perfil-admin-pri',   // Asegúrate de que el selector sea correcto
  templateUrl: './perfil-admin-pri.component.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./perfil-admin-pri.component.css']   // Asegúrate de que la ruta sea correcta
})
export class PerfilAdminPriComponent implements OnInit, OnDestroy {

  // ✅ Inyección de dependencias con inject()
  private router = inject(Router);
  private userStateService = inject(UserStateService);
  private cdr = inject(ChangeDetectorRef);

  // ✅ Propiedades para el usuario
  perfilUsuario: PerfilUsuario | null = null;
  private userSubscription: Subscription = new Subscription();

  // ✅ Propiedades de la interfaz
  showUserMenu = false;
  showSidebar = true;

  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/perfil-admin-pri', disabled: false },
    { label: 'Usuarios', icon: 'user-friends', route: 'usuarios' , disabled: false },
    { label: 'Colegios', icon: 'school', route: 'colegios', disabled: false  },
    { label: 'Docentes', icon: 'chalkboard-teacher', route: 'docentes', disabled: false  },
    { label: 'Estudiantes', icon: 'user-graduate', route: 'estudiantes', disabled: false  },
    { label: 'Académico', icon: 'book', route: 'academico', disabled: false  },
    { label: 'Reportes', icon: 'chart-bar', route: 'reportes', disabled: false  },
    { label: 'Auditoría', icon: 'clipboard-check', route: 'auditoria', disabled: false  },
    { label: 'Perfil', icon: 'user-circle', route: 'perfil', disabled: false  },
    { label: 'Cerrar sesión', icon: 'sign-out-alt', route: '/opciones' , disabled: false },
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  ngOnInit(): void {
    console.log('🚀 PerfilAdminPriComponent iniciando...');

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
        console.log('✅ Perfil actualizado:', this.perfilUsuario);
      } else {
        this.perfilUsuario = null;
        console.log('❌ Usuario eliminado, perfil limpiado');
      }

      // Forzar detección de cambios
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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

  get iniciales(): string {
    return this.perfilUsuario?.iniciales || 'U';
  }

  get statusText(): string {
    return this.perfilUsuario ? 'Activo' : 'Sin sesión';
  }

  get statusColor(): string {
    return this.perfilUsuario ? 'text-green-500' : 'text-red-500';
  }

  // Métodos para controlar la interfaz
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

}
