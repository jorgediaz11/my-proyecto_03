import { Component } from '@angular/core';

interface TrazaPaso {
  titulo: string;
  descripcion: string;
  fecha: string;
  color: string;
}

interface UsuarioAuditoria {
  usuario: string;
  nombres: string;
  apellidos: string;
  perfil: string;
  fechaCreacion: string;
  accion: string;
  inicio: string;
  termino: string;
  estado: string;
  traza: TrazaPaso[];
}

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent {
  usuarios: UsuarioAuditoria[] = [
    {
      usuario: 'jperez',
      nombres: 'Juan',
      apellidos: 'Pérez',
      perfil: 'Administrador',
      fechaCreacion: '2025-05-10',
      accion: 'Creación de usuario',
      inicio: '2025-05-18 09:00',
      termino: '2025-05-18 09:15',
      estado: 'Completado',
      traza: [
        { titulo: 'Creación de usuario', descripcion: 'El usuario fue registrado en la plataforma.', fecha: '2025-05-18 09:00', color: 'bg-blue-600' },
        { titulo: 'Validación de correo', descripcion: 'El usuario validó su correo electrónico.', fecha: '2025-05-18 09:05', color: 'bg-yellow-500' },
        { titulo: 'Primer ingreso', descripcion: 'El usuario ingresó por primera vez a la plataforma.', fecha: '2025-05-18 09:10', color: 'bg-green-500' },
        { titulo: 'Actualización de perfil', descripcion: 'El usuario completó y actualizó su información de perfil.', fecha: '2025-05-18 09:12', color: 'bg-indigo-500' },
        { titulo: 'Uso de recursos', descripcion: 'El usuario ya está ingresando y usando los recursos de la plataforma.', fecha: '2025-05-18 09:15', color: 'bg-gray-800' }
      ]
    },
    {
      usuario: 'alopez',
      nombres: 'Ana',
      apellidos: 'López',
      perfil: 'Docente',
      fechaCreacion: '2025-05-11',
      accion: 'Creación de usuario',
      inicio: '2025-05-17 10:00',
      termino: '2025-05-17 10:20',
      estado: 'Completado',
      traza: [
        { titulo: 'Creación de usuario', descripcion: 'El usuario fue registrado en la plataforma.', fecha: '2025-05-17 10:00', color: 'bg-blue-600' },
        { titulo: 'Validación de correo', descripcion: 'El usuario validó su correo electrónico.', fecha: '2025-05-17 10:05', color: 'bg-yellow-500' },
        { titulo: 'Primer ingreso', descripcion: 'El usuario ingresó por primera vez a la plataforma.', fecha: '2025-05-17 10:10', color: 'bg-green-500' },
        { titulo: 'Actualización de perfil', descripcion: 'El usuario completó y actualizó su información de perfil.', fecha: '2025-05-17 10:15', color: 'bg-indigo-500' },
        { titulo: 'Uso de recursos', descripcion: 'El usuario ya está ingresando y usando los recursos de la plataforma.', fecha: '2025-05-17 10:20', color: 'bg-gray-800' }
      ]
    },
    {
      usuario: 'cruiz',
      nombres: 'Carlos',
      apellidos: 'Ruiz',
      perfil: 'Estudiante',
      fechaCreacion: '2025-05-12',
      accion: 'Creación de usuario',
      inicio: '2025-05-16 08:30',
      termino: '2025-05-16 08:50',
      estado: 'Completado',
      traza: [
        { titulo: 'Creación de usuario', descripcion: 'El usuario fue registrado en la plataforma.', fecha: '2025-05-16 08:30', color: 'bg-blue-600' },
        { titulo: 'Validación de correo', descripcion: 'El usuario validó su correo electrónico.', fecha: '2025-05-16 08:35', color: 'bg-yellow-500' },
        { titulo: 'Primer ingreso', descripcion: 'El usuario ingresó por primera vez a la plataforma.', fecha: '2025-05-16 08:40', color: 'bg-green-500' },
        { titulo: 'Actualización de perfil', descripcion: 'El usuario completó y actualizó su información de perfil.', fecha: '2025-05-16 08:45', color: 'bg-indigo-500' },
        { titulo: 'Uso de recursos', descripcion: 'El usuario ya está ingresando y usando los recursos de la plataforma.', fecha: '2025-05-16 08:50', color: 'bg-gray-800' }
      ]
    },
    {
      usuario: 'ltorres',
      nombres: 'Lucía',
      apellidos: 'Torres',
      perfil: 'Docente',
      fechaCreacion: '2025-05-13',
      accion: 'Creación de usuario',
      inicio: '2025-05-15 11:00',
      termino: '2025-05-15 11:25',
      estado: 'Completado',
      traza: [
        { titulo: 'Creación de usuario', descripcion: 'El usuario fue registrado en la plataforma.', fecha: '2025-05-15 11:00', color: 'bg-blue-600' },
        { titulo: 'Validación de correo', descripcion: 'El usuario validó su correo electrónico.', fecha: '2025-05-15 11:05', color: 'bg-yellow-500' },
        { titulo: 'Primer ingreso', descripcion: 'El usuario ingresó por primera vez a la plataforma.', fecha: '2025-05-15 11:10', color: 'bg-green-500' },
        { titulo: 'Actualización de perfil', descripcion: 'El usuario completó y actualizó su información de perfil.', fecha: '2025-05-15 11:20', color: 'bg-indigo-500' },
        { titulo: 'Uso de recursos', descripcion: 'El usuario ya está ingresando y usando los recursos de la plataforma.', fecha: '2025-05-15 11:25', color: 'bg-gray-800' }
      ]
    },
    {
      usuario: 'pgomez',
      nombres: 'Pedro',
      apellidos: 'Gómez',
      perfil: 'Estudiante',
      fechaCreacion: '2025-05-14',
      accion: 'Creación de usuario',
      inicio: '2025-05-14 07:45',
      termino: '2025-05-14 08:05',
      estado: 'Completado',
      traza: [
        { titulo: 'Creación de usuario', descripcion: 'El usuario fue registrado en la plataforma.', fecha: '2025-05-14 07:45', color: 'bg-blue-600' },
        { titulo: 'Validación de correo', descripcion: 'El usuario validó su correo electrónico.', fecha: '2025-05-14 07:50', color: 'bg-yellow-500' },
        { titulo: 'Primer ingreso', descripcion: 'El usuario ingresó por primera vez a la plataforma.', fecha: '2025-05-14 07:55', color: 'bg-green-500' },
        { titulo: 'Actualización de perfil', descripcion: 'El usuario completó y actualizó su información de perfil.', fecha: '2025-05-14 08:00', color: 'bg-indigo-500' },
        { titulo: 'Uso de recursos', descripcion: 'El usuario ya está ingresando y usando los recursos de la plataforma.', fecha: '2025-05-14 08:05', color: 'bg-gray-800' }
      ]
    }
  ];

  usuarioSeleccionado: UsuarioAuditoria = this.usuarios[0];

  seleccionarUsuario(usuario: UsuarioAuditoria) {
    this.usuarioSeleccionado = usuario;
  }
}
