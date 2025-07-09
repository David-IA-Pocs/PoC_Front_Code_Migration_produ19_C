import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BackendService } from '../services/backend.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [CommonModule, RouterLink],
})
export class UserComponent {
  private auth = inject(AuthService);
  private backend = inject(BackendService);

  userInfo: any = null;
  welcomeMessage = 'Bienvenido, usuario';
  testMessage = '';
  isTestingAccess = false;

  ngOnInit() {
    const rawInfo = this.auth.getUserInfo();
    if (rawInfo) {
      // Normaliza los campos para que el template siempre tenga username y email
      this.userInfo = {
        username: rawInfo.username || rawInfo.name || rawInfo.sub || '',
        email:
          rawInfo.email ||
          rawInfo[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
          ] ||
          '',
        role:
          rawInfo[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] ||
          rawInfo.role ||
          '',
      };
      this.welcomeMessage =
        'Bienvenido, ' + (this.userInfo.username || 'usuario');
    } else {
      this.userInfo = null;
      this.welcomeMessage = 'Bienvenido, usuario';
    }
  }

  testUserAccess() {
    this.isTestingAccess = true;
    this.testMessage = '';
    this.backend.testUserAccess().subscribe({
      next: (response) => {
        this.isTestingAccess = false;
        this.testMessage = response?.message || 'Acceso de usuario confirmado';
      },
      error: (error) => {
        this.isTestingAccess = false;
        this.testMessage =
          'Error al probar acceso: ' +
          (error?.error?.message || 'Error de conexión');
      },
    });
  }
}
