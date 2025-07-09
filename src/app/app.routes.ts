import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'savings-accounts',
    loadComponent: () =>
      import('./features/savings-accounts.component').then(
        (m) => m.SavingsAccountsComponent
      ),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./features/user.component').then((m) => m.UserComponent),
  },
  {
    path: 'create-savings',
    loadComponent: () =>
      import('./features/create-savings.component').then(
        (m) => m.CreateSavingsComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin.component').then((m) => m.AdminComponent),
  },
  // Rutas para otras vistas migradas (admin, create-savings, etc.)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
