import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColegiosService } from './services/colegios.service';

@Component({
  selector: 'app-test-endpoints',
  template: `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h2>🧪 Test de Endpoints - Backend Eureka</h2>

      <!-- Estado del Backend -->
      <div style="margin: 20px 0; padding: 15px; border-radius: 8px;"
           [style.background-color]="backendStatus.color">
        <h3><strong>📡 Estado del Backend</strong></h3>
        <p>{{ backendStatus.message }}</p>
      </div>

      <!-- Botones de Prueba -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
        <button
          (click)="testBackendBase()"
          style="padding: 12px; background: #3B82F6; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          {{ loading ? 'Probando...' : '🔍 Probar Backend Base' }}
        </button>

        <button
          (click)="testColegiosEndpoint()"
          style="padding: 12px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          🏫 Probar Endpoint Colegios
        </button>

        <button
          (click)="testAuthCheck()"
          style="padding: 12px; background: #10B981; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          🔐 Probar Verificación de Usuario
        </button>

        <button
          (click)="testUsersUnauth()"
          style="padding: 12px; background: #8B5CF6; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          👥 Probar Usuarios (sin auth)
        </button>

        <button
          (click)="testLoginFlow()"
          style="padding: 12px; background: #F59E0B; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          🔑 Probar Flujo de Login
        </button>

        <button
          (click)="testMultipleCredentials()"
          style="padding: 12px; background: #EC4899; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          🔐 Probar Múltiples Credenciales
        </button>

        <button
          (click)="diagnoseCredentials()"
          style="padding: 12px; background: #DC2626; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          🔍 Diagnóstico Detallado
        </button>

        <button
          (click)="testPasswordVariations()"
          style="padding: 12px; background: #7C3AED; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          🔑 Probar Variaciones Password
        </button>

        <button
          (click)="showPasswordHelp()"
          style="padding: 12px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer;">
          💡 Ayuda Password BD
        </button>

        <button
          (click)="deepDiagnose()"
          style="padding: 12px; background: #B91C1C; color: white; border: none; border-radius: 6px; cursor: pointer;"
          [disabled]="loading">
          🔬 Diagnóstico Profundo
        </button>

        <button
          (click)="clearResults()"
          style="padding: 12px; background: #6B7280; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🗑️ Limpiar Resultados
        </button>
      </div>

      <!-- Resultados -->
      <div style="margin-top: 20px;">
        <h3><strong>📋 Resultados:</strong></h3>
        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; max-height: 400px; overflow-y: auto;">
          <pre style="margin: 0; font-size: 14px; white-space: pre-wrap;">{{ results }}</pre>
        </div>
      </div>
    </div>
  `
})
export class TestEndpointsComponent implements OnInit {
  private http = inject(HttpClient);
  private colegiosService = inject(ColegiosService);

  loading = false;
  results = '';
  backendStatus = {
    message: 'Verificando conexión...',
    color: '#FEF3C7'
  };

  ngOnInit() {
    this.testBackendBase();
  }

  testBackendBase() {
    this.loading = true;
    this.addResult('🔍 Probando conexión al backend base...');

    this.http.get('http://localhost:3000').subscribe({
      next: (response) => {
        this.addResult('✅ Backend ACTIVO: ' + JSON.stringify(response, null, 2));
        this.backendStatus = {
          message: '✅ Backend conectado exitosamente en puerto 3000',
          color: '#D1FAE5'
        };
        this.loading = false;
      },
      error: (error) => {
        this.addResult('❌ Error de conexión: ' + error.message);
        this.backendStatus = {
          message: '❌ Backend no disponible en puerto 3000',
          color: '#FEE2E2'
        };
        this.loading = false;
      }
    });
  }

  testColegiosEndpoint() {
    this.loading = true;
    this.addResult('🏫 === INICIANDO TEST DE COLEGIOS ===');
    this.addResult('🔗 Endpoint: http://localhost:3000/api/colegios');

    this.colegiosService.getColegios().subscribe({
      next: (data) => {
        this.addResult(`✅ CONEXIÓN EXITOSA al endpoint de colegios`);
        this.addResult(`📊 Colegios encontrados: ${data.length}`);

        if (data.length > 0) {
          this.addResult(`📝 Ejemplo de colegio:`);
          this.addResult(`   - ID: ${data[0].id}`);
          this.addResult(`   - Nombre: ${data[0].nombre || 'Sin nombre'}`);
          this.addResult(`   - Estado: ${data[0].estado ? 'Activo' : 'Inactivo'}`);
        }

        this.loading = false;
        this.addResult('🏫 === TEST DE COLEGIOS COMPLETADO ===\\n');
      },
      error: (error) => {
        this.addResult(`❌ ERROR en endpoint de colegios:`);

        if (error.status === 0) {
          this.addResult('   - No se puede conectar al servidor');
          this.addResult('   - Verificar que el backend esté ejecutándose');
        } else if (error.status === 404) {
          this.addResult('   - Endpoint no encontrado (404)');
          this.addResult('   - Verificar ruta /api/colegios en el backend');
        } else if (error.status === 401) {
          this.addResult('   - Error de autenticación (401)');
          this.addResult('   - Token requerido o inválido');
        } else if (error.status === 500) {
          this.addResult('   - Error interno del servidor (500)');
          this.addResult('   - Problema en backend o base de datos');
        } else {
          this.addResult(`   - Error ${error.status}: ${error.message || 'Error desconocido'}`);
        }

        this.loading = false;
        this.addResult('🏫 === TEST DE COLEGIOS FALLIDO ===\\n');
      }
    });
  }

  testAuthCheck() {
    this.loading = true;
    this.addResult('\\n🔐 Probando endpoint de verificación de usuario...');

    const testUser = 'test_user_' + Date.now();
    const testEmail = `test${Date.now()}@test.com`;

    const body = { username: testUser, email: testEmail };

    this.http.post('http://localhost:3000/auth/check-user', body).subscribe({
      next: (response) => {
        this.addResult('✅ Endpoint /auth/check-user FUNCIONA: ' + JSON.stringify(response, null, 2));
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.addResult('❌ Endpoint /auth/check-user NO IMPLEMENTADO (404)');
        } else {
          this.addResult('⚠️ Error en /auth/check-user: ' + error.status + ' - ' + JSON.stringify(error.error));
        }
        this.loading = false;
      }
    });
  }

  testUsersUnauth() {
    this.loading = true;
    this.addResult('\\n👥 Probando endpoint de usuarios sin autenticación...');

    this.http.get('http://localhost:3000/users').subscribe({
      next: (response) => {
        this.addResult('⚠️ ALERTA: Endpoint /users NO requiere autenticación (debería dar 401)');
        this.addResult('Respuesta: ' + JSON.stringify(response, null, 2));
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          this.addResult('✅ Endpoint /users PROTEGIDO correctamente (401 sin auth)');
        } else if (error.status === 404) {
          this.addResult('❌ Endpoint /users NO IMPLEMENTADO (404)');
        } else {
          this.addResult('⚠️ Error inesperado en /users: ' + error.status + ' - ' + JSON.stringify(error.error));
        }
        this.loading = false;
      }
    });
  }

  testLoginFlow() {
    this.loading = true;
    this.addResult('\\n🔑 Probando flujo completo de autenticación...');

    // Datos de prueba para login - CAMBIA ESTAS CREDENCIALES:
    const loginData = {
      username: 'jorge.diaz.t@gmail.com', // 👈 CORRECTO: usar username (que contiene el correo)
      password: 'Admin1109@2025'          // 👈 PASSWORD ACTUALIZADO que cumple reglas
    };

    this.addResult('📝 Intentando login con: ' + JSON.stringify(loginData));

    this.http.post('http://localhost:3000/auth/login', loginData).subscribe({
      next: (response: object) => {
        const responseObj = response as { token?: string; access_token?: string; [key: string]: unknown };
        this.addResult('✅ LOGIN EXITOSO: ' + JSON.stringify(response, null, 2));

        // Si recibimos un token, probamos el endpoint protegido
        if (responseObj.token || responseObj.access_token) {
          const token = responseObj.token || responseObj.access_token;
          this.addResult('🔑 Token recibido, probando endpoint protegido...');

          // Probar endpoint protegido con token
          const headers = { 'Authorization': `Bearer ${token}` };
          this.http.get('http://localhost:3000/users', { headers }).subscribe({
            next: (usersResponse) => {
              this.addResult('✅ Acceso a /users con TOKEN EXITOSO: ' + JSON.stringify(usersResponse, null, 2));
              this.loading = false;
            },
            error: (usersError) => {
              this.addResult('❌ Error accediendo a /users con token: ' + usersError.status + ' - ' + JSON.stringify(usersError.error));
              this.loading = false;
            }
          });
        } else {
          this.addResult('⚠️ No se recibió token en la respuesta de login');
          this.loading = false;
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.addResult('❌ Endpoint /auth/login NO IMPLEMENTADO (404)');
        } else if (error.status === 401) {
          this.addResult('❌ Credenciales incorrectas (401) - Probar con: admin/admin o verificar usuarios válidos');
        } else {
          this.addResult('⚠️ Error en /auth/login: ' + error.status + ' - ' + JSON.stringify(error.error));
        }
        this.loading = false;
      }
    });
  }

  clearResults() {
    this.results = '';
    this.addResult('🗑️ Resultados limpiados. Listo para nuevas pruebas.');
  }

  testMultipleCredentials() {
    this.loading = true;
    this.addResult('\\n🔐 Probando múltiples combinaciones de credenciales...');

    const credentials = [
      { username: 'jorge.diaz.t@gmail.com', password: 'Admin1109@2025' }, // 👈 TUS CREDENCIALES REALES ACTUALIZADAS
      { username: 'admin@admin.com', password: 'admin123' },
      { username: 'admin@sanremo.com', password: 'admin' },
      { username: 'test@test.com', password: 'test123' },
      { username: 'usuario@colegio.com', password: 'password' },
      { username: 'demo@demo.com', password: 'demo123' }
    ];

    let currentIndex = 0;

    const tryNext = () => {
      if (currentIndex >= credentials.length) {
        this.addResult('❌ Ninguna combinación de credenciales funcionó. Verificar usuarios en base de datos.');
        this.loading = false;
        return;
      }

      const cred = credentials[currentIndex];
      this.addResult(`\\n📝 Probando ${currentIndex + 1}/${credentials.length}: ${cred.username} / ${cred.password}`);

      this.http.post('http://localhost:3000/auth/login', cred).subscribe({
        next: (response: object) => {
          const responseObj = response as { token?: string; access_token?: string; [key: string]: unknown };
          this.addResult('✅ ¡LOGIN EXITOSO! Credenciales válidas encontradas:');
          this.addResult('👤 Usuario: ' + cred.username);
          this.addResult('🔑 Respuesta: ' + JSON.stringify(response, null, 2));

          if (responseObj.token || responseObj.access_token) {
            const token = responseObj.token || responseObj.access_token;
            this.addResult('🎯 Probando acceso a endpoint protegido...');

            const headers = { 'Authorization': `Bearer ${token}` };
            this.http.get('http://localhost:3000/users', { headers }).subscribe({
              next: (usersResponse) => {
                this.addResult('✅ ¡ACCESO COMPLETO! Endpoint /users funciona con token:');
                this.addResult(JSON.stringify(usersResponse, null, 2));
                this.loading = false;
              },
              error: (usersError) => {
                this.addResult('⚠️ Token válido pero error en /users: ' + usersError.status);
                this.loading = false;
              }
            });
          } else {
            this.addResult('⚠️ Login exitoso pero sin token en respuesta');
            this.loading = false;
          }
        },
        error: (error) => {
          this.addResult(`❌ ${cred.username}: ${error.status === 401 ? 'Credenciales incorrectas' : 'Error ' + error.status}`);
          currentIndex++;
          setTimeout(() => tryNext(), 500); // Pequeña pausa entre intentos
        }
      });
    };

    tryNext();
  }

  diagnoseCredentials() {
    this.loading = true;
    this.addResult('\\n🔍 DIAGNÓSTICO DETALLADO DE CREDENCIALES...');

    // Credenciales exactas del usuario
    const userCredentials = {
      username: 'jorge.diaz.t@gmail.com', // ✅ CORRECTO: usar username
      password: 'Admin1109@2025'          // ✅ PASSWORD ACTUALIZADO
    };

    this.addResult('� Username a probar: ' + userCredentials.username);
    this.addResult('🔐 Password a probar: ' + userCredentials.password);
    this.addResult('📏 Longitud del password: ' + userCredentials.password.length + ' caracteres');

    // Verificar formato del email
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const isValidEmail = emailRegex.test(userCredentials.username);
    this.addResult('📧 Formato de email válido: ' + (isValidEmail ? '✅ SÍ' : '❌ NO'));

    // Intentar el login con logging detallado
    this.addResult('\\n🚀 Enviando request a: http://localhost:3000/auth/signin');
    this.addResult('📤 Body del request: ' + JSON.stringify(userCredentials, null, 2));

    this.http.post('http://localhost:3000/auth/login', userCredentials).subscribe({
      next: (response: object) => {
        this.addResult('\\n✅ ¡LOGIN EXITOSO!');
        this.addResult('📥 Respuesta completa del servidor: ' + JSON.stringify(response, null, 2));
        this.loading = false;
      },
      error: (error) => {
        this.addResult('\\n❌ ERROR EN LOGIN:');
        this.addResult('📊 Status Code: ' + error.status);
        this.addResult('📄 Error Message: ' + (error.error?.message || 'Sin mensaje'));
        this.addResult('🔍 Error completo: ' + JSON.stringify(error.error, null, 2));

        if (error.status === 401) {
          this.addResult('\\n🔍 ANÁLISIS DEL ERROR 401:');
          this.addResult('• El servidor rechaza las credenciales');
          this.addResult('• Posibles causas:');
          this.addResult('  1. Email no existe en la base de datos');
          this.addResult('  2. Password incorrecto');
          this.addResult('  3. Usuario deshabilitado/inactivo');
          this.addResult('  4. Campo de email en BD usa nombre diferente');

          // Probar variaciones del email
          this.addResult('\\n🔄 Probando variaciones del email...');
          this.testEmailVariations();
        }
        this.loading = false;
      }
    });
  }

  testEmailVariations() {
    const password = '1109@2025';

    const variations = [
      { field: 'username', value: 'jorge.diaz.t@gmail.com', password: password },
      { field: 'user', value: 'jorge.diaz.t@gmail.com', password: password },
      { field: 'correo', value: 'jorge.diaz.t@gmail.com', password: password },
      { field: 'email', value: 'jorge.diaz.t', password: password }, // Sin @gmail.com
      { field: 'email', value: 'jorge.diaz.t@gmail.com', password: password }
    ];

    let index = 0;
    const testNext = () => {
      if (index >= variations.length) {
        this.addResult('\\n❌ Ninguna variación funcionó');
        return;
      }

      const variation = variations[index];
      const body = { [variation.field]: variation.value, password: variation.password };

      this.addResult(`\\n🔄 Probando: ${variation.field} = "${variation.value}"`);

      this.http.post('http://localhost:3000/auth/login', body).subscribe({
        next: (response) => {
          this.addResult(`✅ ¡FUNCIONA! Campo correcto: "${variation.field}"`);
          this.addResult('📥 Respuesta: ' + JSON.stringify(response, null, 2));
        },
        error: (error) => {
          this.addResult(`❌ ${variation.field}: ${error.status} - ${error.error?.message || 'Error'}`);
          index++;
          setTimeout(() => testNext(), 300);
        }
      });
    };

    testNext();
  }
  testPasswordVariations() {
    this.loading = true;
    this.addResult('\\n🔑 PROBANDO VARIACIONES DEL PASSWORD...');

    const username = 'jorge.diaz.t@gmail.com';
    const passwordVariations = [
      'Admin1109@2025',      // ✅ PASSWORD ACTUAL VÁLIDO
      '1109@2025',           // Password anterior
      ' Admin1109@2025',     // Con espacio al inicio
      '1109@2025 ',          // Con espacio al final
      ' 1109@2025 ',         // Con espacios en ambos lados
      '11092025',            // Sin símbolo @
      '1109-2025',           // Con guión en lugar de @
      '1109_2025',           // Con guión bajo
      'jdiaz1109',           // Variación personalizada
      'jorge1109',           // Con nombre
      'Jorge1109',           // Con mayúscula
      'JORGE1109',           // Todo mayúsculas
      'password',            // Password genérico
      'admin',               // Admin común
      '123456',              // Password débil
      'jorge123',            // Nombre + números
      'diaz123'              // Apellido + números
    ];

    this.addResult(`👤 Username fijo: ${username}`);
    this.addResult(`🔑 Probando ${passwordVariations.length} variaciones de password...`);

    let index = 0;
    const testNext = () => {
      if (index >= passwordVariations.length) {
        this.addResult('\\n❌ Ninguna variación de password funcionó');
        this.addResult('💡 Sugerencias:');
        this.addResult('  1. Verificar el password exacto en la base de datos');
        this.addResult('  2. El password podría estar hasheado (bcrypt, etc.)');
        this.addResult('  3. Consultar con el administrador del sistema');
        this.loading = false;
        return;
      }

      const currentPassword = passwordVariations[index];
      this.addResult(`\\n🔍 [${index + 1}/${passwordVariations.length}] Probando: "${currentPassword}"`);

      const loginData = { username, password: currentPassword };

      this.http.post('http://localhost:3000/auth/login', loginData).subscribe({
        next: (response: object) => {
          this.addResult(`\\n🎉 ¡ÉXITO! Password correcto encontrado: "${currentPassword}"`);
          this.addResult('✅ Respuesta del servidor: ' + JSON.stringify(response, null, 2));
          this.loading = false;
        },
        error: (error) => {
          if (error.status === 401) {
            this.addResult(`❌ "${currentPassword}": Incorrecto`);
          } else {
            this.addResult(`⚠️ "${currentPassword}": Error ${error.status}`);
          }
          index++;
          setTimeout(() => testNext(), 300); // Pausa pequeña entre intentos
        }
      });
    };

    testNext();
  }

  showPasswordHelp() {
    this.addResult('\\n💡 CÓMO VERIFICAR PASSWORD EN BASE DE DATOS:\\n');
    this.addResult('📋 Para verificar el password exacto, ejecuta en tu BD:');
    this.addResult('');
    this.addResult('SQL Query:');
    this.addResult('SELECT username, password, LENGTH(password) as longitud_password');
    this.addResult('FROM public.usuario');
    this.addResult("WHERE username = 'jorge.diaz.t@gmail.com';");
    this.addResult('');
    this.addResult('🔍 Esto te mostrará:');
    this.addResult('  • Username exacto');
    this.addResult('  • Password exacto (en texto plano)');
    this.addResult('  • Longitud del password');
    this.addResult('');
    this.addResult('⚠️ PUNTOS A VERIFICAR:');
    this.addResult('  1. ¿El password tiene espacios al inicio/final?');
    this.addResult('  2. ¿Todos los caracteres son exactamente iguales?');
    this.addResult('  3. ¿El usuario está activo (estado = true)?');
    this.addResult('  4. ¿La longitud coincide con lo esperado?');
    this.addResult('');
    this.addResult('🎯 Una vez tengas el password exacto, actualiza las credenciales');
    this.addResult('   en el componente y prueba nuevamente.');
  }

  deepDiagnose() {
    this.loading = true;
    this.addResult('\\n🔬 DIAGNÓSTICO PROFUNDO DEL BACKEND...\\n');

    // Datos exactos de la BD
    const exactCredentials = {
      username: 'jorge.diaz.t@gmail.com',
      password: 'Admin1109@2025'  // ✅ PASSWORD ACTUALIZADO
    };

    this.addResult('📊 DATOS CONFIRMADOS DE LA BASE DE DATOS:');
    this.addResult('👤 Username: jorge.diaz.t@gmail.com');
    this.addResult('🔑 Password: Admin1109@2025');
    this.addResult('📏 Longitud: 13 caracteres');
    this.addResult('✅ Estado: activo (true)');
    this.addResult('✅ Cumple reglas: Mayúscula, números, símbolos');
    this.addResult('');

    // Probar diferentes enfoques
    this.addResult('🔍 PROBANDO DIFERENTES ENFOQUES...\\n');

    // 1. Confirmar que /auth/login funciona
    this.addResult('1️⃣ Confirmando que /auth/login funciona...');
    this.http.post('http://localhost:3000/auth/login', exactCredentials).subscribe({
      next: (response: object) => {
        this.addResult('✅ ¡ÉXITO con /auth/login!');
        this.addResult('📥 Respuesta: ' + JSON.stringify(response, null, 2));
        this.loading = false;
      },
      error: (error) => {
        this.addResult(`❌ /auth/login falló: ${error.status} - ${error.error?.message || 'Error'}`);

        // 2. Probar con diferentes estructuras de datos
        this.addResult('\\n2️⃣ Probando diferentes estructuras de datos...');
        this.testDifferentStructures();
      }
    });
  }

  testDifferentStructures() {
    const structures = [
      { name: 'email + password', data: { email: 'jorge.diaz.t@gmail.com', password: '1109@2025' } },
      { name: 'correo + password', data: { correo: 'jorge.diaz.t@gmail.com', password: '1109@2025' } },
      { name: 'usuario + password', data: { usuario: 'jorge.diaz.t@gmail.com', password: '1109@2025' } },
      { name: 'user + pass', data: { user: 'jorge.diaz.t@gmail.com', pass: '1109@2025' } },
      { name: 'username + pass', data: { username: 'jorge.diaz.t@gmail.com', pass: '1109@2025' } },
      { name: 'login + password', data: { login: 'jorge.diaz.t@gmail.com', password: '1109@2025' } }
    ];

    let index = 0;
    const testNext = () => {
      if (index >= structures.length) {
        this.addResult('\\n❌ Ninguna estructura funcionó con /auth/signin');
        this.addResult('\\n🔍 POSIBLES CAUSAS:');
        this.addResult('• El backend tiene un bug en la lógica de autenticación');
        this.addResult('• Está comparando con un campo diferente en la BD');
        this.addResult('• Está hasheando el password antes de comparar');
        this.addResult('• Hay middleware que está interfiriendo');
        this.addResult('\\n💡 RECOMENDACIONES:');
        this.addResult('• Verificar logs del backend');
        this.addResult('• Probar con otro usuario de la BD');
        this.addResult('• Contactar al desarrollador del backend');
        this.loading = false;
        return;
      }

      const structure = structures[index];
      this.addResult(`\\n🧪 Probando: ${structure.name}`);
      this.addResult(`📤 Data: ${JSON.stringify(structure.data)}`);

      this.http.post('http://localhost:3000/auth/login', structure.data).subscribe({
        next: (response: object) => {
          this.addResult(`\\n🎉 ¡ÉXITO! Estructura correcta: ${structure.name}`);
          this.addResult('📥 Respuesta: ' + JSON.stringify(response, null, 2));
          this.loading = false;
        },
        error: (error) => {
          const message = error.error?.message || 'Error';
          this.addResult(`❌ ${structure.name}: ${error.status} - ${message}`);

          index++;
          setTimeout(() => testNext(), 300);
        }
      });
    };

    testNext();
  }

  private addResult(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.results += `[${timestamp}] ${message}\\n`;
  }
}
