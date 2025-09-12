import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStateService, UsuarioAutenticado } from '../../services/user-state.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  disabled: boolean;  // Added the missing 'disabled' property
}

@Component({
    selector: 'app-perfil-editor',
    templateUrl: './perfil-editor.component.html',
    styleUrls: ['./perfil-editor.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class PerfilEditorComponent implements OnInit, OnDestroy {

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
    { label: 'Inicio', icon: 'home', route: '//perfil-editor', disabled: false },                   // Habilitado
    { label: 'Material', icon: 'book-open', route: '/', disabled: true },                     // Deshabilitado
    { label: 'Productos', icon: 'cube', route: '/', disabled: true },                         // Deshabilitado
    { label: 'Recursos', icon: 'document-download', route: '/', disabled: true },             // Deshabilitado
    { label: 'Reportes', icon: 'chart-bar', route: '/', disabled: true },                     // Deshabilitado
    { label: 'Mensajería', icon: 'envelope', route: '/', disabled: true },                    // Deshabilitado
    { label: 'Cerrar sesión', icon: 'sign-out-alt', route: '/opciones' , disabled: false },   // Cerrar sesión
  ];

  ngOnInit(): void {
    console.log('🚀 PerfilEditorComponent iniciando...');

    // ✅ Suscripción al usuario actual
    this.userSubscription = this.userStateService.usuarioActual$.subscribe({
      next: (usuario) => {
        console.log('👤 Usuario recibido en PerfilEditor:', usuario);
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
    console.log('🔄 PerfilEditorComponent destruyendo...');
    this.userSubscription.unsubscribe();
  }

  // ✅ Getters para el template
  get nombreUsuario(): string {
    return this.usuarioActual?.nombre || 'Usuario';
  }

  get rolUsuario(): string {
    return this.userStateService.getRoleName(this.usuarioActual?.id_perfil || 0);
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

  // ✅ Método para cerrar sesión
  cerrarSesion(): void {
    console.log('🚪 Cerrando sesión desde PerfilEditor...');
    this.userStateService.limpiarUsuario();
    this.router.navigate(['/login']);
  }


}
