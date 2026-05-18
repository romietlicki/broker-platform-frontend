import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommissionService } from '../../core/services/commission.service';
import { CommissionResponse } from '../../core/models/policy.models';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CurrencyPipe, DatePipe,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, HeaderComponent
  ],
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']
})
export class CommissionsComponent implements OnInit {

  private readonly commissionService = inject(CommissionService);

  commissions: CommissionResponse[] = [];
  loading = false;
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  columns = ['insuredName', 'insurer', 'productName', 'commissionAmount', 'commissionPercentage', 'status', 'paymentDate'];

  readonly months = [
    { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Março' },
    { v: 4, l: 'Abril' }, { v: 5, l: 'Maio' }, { v: 6, l: 'Junho' },
    { v: 7, l: 'Julho' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Setembro' },
    { v: 10, l: 'Outubro' }, { v: 11, l: 'Novembro' }, { v: 12, l: 'Dezembro' }
  ];

  readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  get totalCommissions(): number {
    return this.commissions.reduce((sum, c) => sum + (c.commissionAmount ?? 0), 0);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.commissionService.getCommissions(this.selectedMonth, this.selectedYear).subscribe({
      next: (data) => { this.commissions = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
