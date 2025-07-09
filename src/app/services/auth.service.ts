import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://zwhf4xnv-5000.use2.devtunnels.ms/api/auth';
  private readonly tokenKey = 'jwt_token';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials).pipe(
      map((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          return response;
        } else {
          throw new Error('Token no recibido');
        }
      }),
      catchError((error) =>
        throwError(() => error?.error || 'Error de autenticación')
      )
    );
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = this.parseJWT(token);
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        this.removeToken();
        return false;
      }
      return true;
    } catch {
      this.removeToken();
      return false;
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = this.parseJWT(token);
      return (
        payload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || null
      );
    } catch {
      return null;
    }
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return this.parseJWT(token);
    } catch {
      return null;
    }
  }

  // Métodos privados
  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private parseJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
