import { Component, inject } from '@angular/core';
import { SavingsService } from '../services/savings.service';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-savings-accounts',
  standalone: true,
  templateUrl: './savings-accounts.component.html',
  styleUrls: ['./savings-accounts.component.scss'],
  imports: [CommonModule, DecimalPipe, DatePipe, RouterModule],
})
export class SavingsAccountsComponent {
  private savingsService = inject(SavingsService);

  accounts: any[] = [];
  isLoading = false;
  error: string = '';

  // Métodos adicionales migrados del controlador AngularJS
  getTotalBalance(): number {
    return this.accounts.reduce(
      (total, account) => total + (account.initialDeposit || 0),
      0
    );
  }

  getActiveAccountsCount(): number {
    return this.accounts.filter((account) => account.status === 'Active')
      .length;
  }

  constructor() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading = true;
    this.error = '';
    this.savingsService.getMyAccounts().subscribe({
      next: (response: any) => {
        // Compatibilidad con backend: puede venir como { accounts: [...] } o como array
        this.accounts = Array.isArray(response)
          ? response
          : response.accounts || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error =
          typeof err === 'string' ? err : 'No se pudieron cargar las cuentas.';
        this.isLoading = false;
      },
    });
  }

  viewAccountDetails(account: any) {
    // Aquí puedes implementar la navegación o mostrar un modal con detalles
    alert('Detalles de la cuenta: ' + JSON.stringify(account, null, 2));
  }
}
