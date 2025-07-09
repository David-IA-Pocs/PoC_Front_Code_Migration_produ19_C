import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from '../services/backend.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [CommonModule],
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private backendService = inject(BackendService);

  userInfo: any = null;
  welcomeMessage = 'Bienvenido, administrador';
  testMessage = '';
  isTestingAccess = false;
  healthStatus = '';

  ngOnInit(): void {
    // Obtener información del usuario
    const info = this.authService.getUserInfo();
    this.userInfo = info
      ? {
          username: info.username || info.name || info.sub || '',
          email:
            info.email ||
            info[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
            ] ||
            '',
        }
      : null;
    if (this.userInfo && this.userInfo.username) {
      this.welcomeMessage =
        'Bienvenido, administrador ' + this.userInfo.username;
    }
    this.checkBackendHealth();
  }

  testAdminAccess() {
    this.isTestingAccess = true;
    this.testMessage = '';
    this.backendService.testAdminAccess().subscribe({
      next: (response) => {
        this.isTestingAccess = false;
        this.testMessage =
          response.message || 'Acceso de administrador confirmado';
      },
      error: (error) => {
        this.isTestingAccess = false;
        this.testMessage =
          'Error al probar acceso: ' + (error?.message || 'Error de conexión');
      },
    });
  }

  checkBackendHealth() {
    this.backendService.checkHealth().subscribe({
      next: (response) => {
        this.healthStatus =
          response.status +
          ' - ' +
          new Date(response.timestamp).toLocaleString();
      },
      error: () => {
        this.healthStatus = 'Error de conexión con el backend';
      },
    });
  }
}
