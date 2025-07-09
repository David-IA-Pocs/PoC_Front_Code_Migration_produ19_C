import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });
  errorMessage = '';
  isLoading = false;

  // Lógica de pasos
  currentStep: 'username' | 'password' = 'username';

  // Limpiar error al enfocar
  clearError() {
    this.errorMessage = '';
  }

  // Paso 1: Continuar a contraseña
  continueToPassword() {
    const usernameCtrl = this.loginForm.get('username');
    if (usernameCtrl?.invalid) {
      usernameCtrl.markAsTouched();
      return;
    }
    this.currentStep = 'password';
    // Opcional: resetear password y errores
    this.loginForm.get('password')?.reset('');
    this.errorMessage = '';
  }

  // Paso 2: Volver a usuario
  goBack() {
    this.currentStep = 'username';
    this.loginForm.get('password')?.reset('');
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.currentStep === 'username') {
      this.continueToPassword();
      return;
    }
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña válidos';
      return;
    }
    this.isLoading = true;
    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirigir según rol
        const role = this.auth.getUserRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          typeof err === 'string' ? err : 'Error de autenticación';
      },
    });
  }
}
