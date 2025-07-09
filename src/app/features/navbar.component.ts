import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo">
          <img
            src="assets/image.png"
            alt="logo de Produbanco"
            class="logo-img"
          />
        </div>
        <div class="nav-links" *ngIf="isAuthenticated">
          <span class="user-info">Bienvenido, {{ userRoleDisplay }}</span>
          <button class="btn btn-logout" (click)="logout()">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['../../styles.scss'],
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  get isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  get userRoleDisplay() {
    const role = this.auth.getUserRole();
    switch (role) {
      case 'User':
        return 'Usuario';
      case 'Admin':
        return 'Administrador';
      default:
        return '';
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
