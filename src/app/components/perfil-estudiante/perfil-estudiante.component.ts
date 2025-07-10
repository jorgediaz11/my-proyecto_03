import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStateService, UsuarioAutenticado } from '../../services/user-state.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  disabled: boolean;  // Propiedad para indicar si el elemento está deshabilitado
}

@Component({
  // standalone: true,
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.css']
})
export class PerfilEstudianteComponent implements OnInit, OnDestroy {

  // ✅ Inyección de dependencias con inject()
  private router = inject(Router);
  private userStateService = inject(UserStateService);
  private cdr = inject(ChangeDetectorRef);

  // ✅ Propiedades para el usuario
  usuarioActual: UsuarioAutenticado | null = null;
  private userSubscription: Subscription = new Subscription();

  // ✅ Propiedades de la interfaz
  showUserMenu = false;
  showSidebar = true;

  // Lógica específica del componente
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/perfil-estudiante', disabled: false },                   // Ejemplo de ruta
    { label: 'Cursos', icon: 'book-open', route: '/productos', disabled: true },              // Deshabilitado
    { label: 'Evaluaciones', icon: 'file-alt', route: '/clientes', disabled: true },          // Deshabilitado
    { label: 'Progreso', icon: 'chart-line', route: '/configuracion', disabled: true },       // Deshabilitado
    { label: 'Mensajería', icon: 'envelope', route: '/reportes', disabled: true },            // Deshabilitado
    { label: 'Cerrar sesión', icon: 'sign-out-alt', route: '/opciones' , disabled: false },   // Cerrar sesión
  ];

  isMenuOpen = true; // Para controlar el estado del menú (abierto/cerrado)

  ngOnInit(): void {
    console.log('🚀 PerfilEstudianteComponent iniciando...');

    // ✅ Suscripción al usuario actual
    this.userSubscription = this.userStateService.usuarioActual$.subscribe({
      next: (usuario) => {
        console.log('👤 Usuario recibido en PerfilEstudiante:', usuario);
        this.usuarioActual = usuario;
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (error) => {
        console.error('❌ Error en suscripción de usuario:', error);
      }
    });

    // ✅ Cargar usuario inicial si existe
    const usuarioInicial = this.userStateService.getUsuarioActual();
    if (usuarioInicial) {
      console.log('👤 Usuario inicial encontrado:', usuarioInicial);
      this.usuarioActual = usuarioInicial;
    } else {
      console.log('⚠️ No se encontró usuario inicial');
    }
  }

  ngOnDestroy(): void {
    console.log('🔄 PerfilEstudianteComponent destruyendo...');
    this.userSubscription.unsubscribe();
  }

  // ✅ Getters para el template
  get nombreUsuario(): string {
    return this.usuarioActual?.nombre || 'Usuario';
  }

  get rolUsuario(): string {
    return this.userStateService.getRoleName(this.usuarioActual?.idrol || 0);
  }

  get iniciales(): string {
    if (!this.usuarioActual?.nombre) return 'U';

    const nombres = this.usuarioActual.nombre.split(' ');
    if (nombres.length >= 2) {
      return (nombres[0].charAt(0) + nombres[1].charAt(0)).toUpperCase();
    }
    return nombres[0].charAt(0).toUpperCase();
  }

  get statusText(): string {
    return this.usuarioActual?.estado === 'activo' ? 'ACTIVO' : 'INACTIVO';
  }

  get statusColor(): string {
    return this.usuarioActual?.estado === 'activo' ? 'text-green-500' : 'text-red-500';
  }

  readonly avatarUrl = 'assets/images/default-avatar.png';

  // ✅ Métodos de la interfaz
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  // ✅ Método para cerrar sesión
  cerrarSesion(): void {
    console.log('🚪 Cerrando sesión desde PerfilEstudiante...');
    this.userStateService.limpiarUsuario();
    this.router.navigate(['/login']);
  }
}
