import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { PolicyResponse } from '../../../core/models/policy.models';

@Component({
  selector: 'app-policy-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatDividerModule
  ],
  templateUrl: './policy-detail-dialog.component.html',
  styleUrls: ['./policy-detail-dialog.component.scss']
})
export class PolicyDetailDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PolicyDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public policy: PolicyResponse
  ) {}

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      VIGENTE: 'status-vigente',
      PENDENTE: 'status-pendente',
      CANCELADA: 'status-cancelada'
    };
    return map[status] ?? '';
  }

  get nextDueDates(): string[] {
    if (!this.policy.dueDates?.length) return [];
    const today = new Date().toISOString().slice(0, 10);
    return this.policy.dueDates
      .filter(d => d >= today)
      .slice(0, 6);
  }

  get overdueDates(): string[] {
    if (!this.policy.dueDates?.length) return [];
    const today = new Date().toISOString().slice(0, 10);
    return this.policy.dueDates.filter(d => d < today);
  }
}
