import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SavingsService } from '../services/savings.service';

@Component({
  selector: 'app-create-savings',
  standalone: true,
  templateUrl: './create-savings.component.html',
  styleUrls: ['./create-savings.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateSavingsComponent implements OnInit {
  ngOnInit() {
    // Reinicia el wizard cada vez que se navega a esta ruta
    this.router.events.subscribe((event: any) => {
      if (
        event?.constructor?.name === 'NavigationEnd' &&
        this.router.url === '/create-savings'
      ) {
        this.createAnotherAccount();
      }
    });
    // También inicializa al cargar por primera vez
    this.createAnotherAccount();
  }
  private fb = inject(FormBuilder);
  private savingsService = inject(SavingsService);
  private router = inject(Router);

  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  error: string | null = null;
  success: boolean = false;
  createdAccount: any = null;

  identificationTypes = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'ruc', label: 'RUC' },
  ];

  form: FormGroup = this.fb.group({
    titularName: ['', Validators.required],
    identificationType: ['', Validators.required],
    identificationNumber: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
    initialDeposit: [null, [Validators.required, Validators.min(0.01)]],
  });

  getStepTitle(step: number): string {
    switch (step) {
      case 1:
        return 'Información Personal';
      case 2:
        return 'Datos de Contacto';
      case 3:
        return 'Depósito Inicial';
      default:
        return 'Cuenta Creada';
    }
  }

  getStepDescription(step: number): string {
    switch (step) {
      case 1:
        return 'Ingrese su nombre completo y documento de identidad';
      case 2:
        return 'Proporcione sus datos de contacto';
      case 3:
        return 'Establezca el monto del depósito inicial';
      default:
        return 'Su cuenta de ahorros ha sido creada exitosamente';
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return Boolean(
          this.form.get('titularName')?.valid &&
            this.form.get('identificationType')?.valid &&
            this.form.get('identificationNumber')?.valid
        );
      case 2:
        return Boolean(
          this.form.get('phoneNumber')?.valid && this.form.get('address')?.valid
        );
      case 3:
        return Boolean(
          this.form.get('initialDeposit')?.valid &&
            Number(this.form.get('initialDeposit')?.value) > 0
        );
      default:
        return false;
    }
  }

  nextStep() {
    if (
      this.currentStep < this.totalSteps &&
      this.isStepValid(this.currentStep)
    ) {
      this.currentStep++;
      this.error = null;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.error = null;
    }
  }

  submitForm() {
    if (!this.isStepValid(this.currentStep)) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }
    this.isLoading = true;
    this.error = null;
    const accountData = {
      titularName: this.form.value.titularName,
      identificationNumber: this.form.value.identificationNumber,
      identificationType: this.form.value.identificationType,
      phoneNumber: this.form.value.phoneNumber,
      address: this.form.value.address,
      initialDeposit: parseFloat(this.form.value.initialDeposit),
    };
    this.savingsService.createSavingsAccount(accountData).subscribe({
      next: (response) => {
        this.success = true;
        this.createdAccount = response.accountInfo || response;
        this.currentStep = this.totalSteps + 1;
        this.isLoading = false;
      },
      error: (error) => {
        this.error =
          error?.error?.message || 'Error al crear la cuenta de ahorros';
        this.isLoading = false;
      },
    });
  }

  goToUserDashboard() {
    this.router.navigate(['/user']);
  }

  createAnotherAccount() {
    this.currentStep = 1;
    this.form.reset();
    this.error = null;
    this.success = false;
    this.createdAccount = null;
  }
}
