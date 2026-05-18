import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatStepperModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  loading = false;
  hidePassword = true;

  personalForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    cpf: ['', [Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    susepCode: [''],
    phone: ['', [Validators.pattern(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/)]]
  });

  accountForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  addressForm = this.fb.group({
    addressStreet: [''],
    addressCity: [''],
    addressState: ['', [Validators.maxLength(2)]],
    addressZip: ['', [Validators.pattern(/^\d{5}-\d{3}$/)]]
  });

  submit(): void {
    if (this.personalForm.invalid || this.accountForm.invalid) return;
    this.loading = true;

    const payload = {
      ...this.personalForm.getRawValue(),
      ...this.accountForm.getRawValue(),
      ...this.addressForm.getRawValue()
    };

    this.authService.register(payload as any).subscribe({
      next: () => {
        this.snackBar.open('Cadastro realizado! Faça seu login.', 'OK', {
          duration: 4000,
          panelClass: ['snack-success']
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.detail ?? 'Erro ao cadastrar. Verifique os dados.';
        this.snackBar.open(msg, 'Fechar', {
          duration: 5000,
          panelClass: ['snack-error']
        });
      }
    });
  }
}
