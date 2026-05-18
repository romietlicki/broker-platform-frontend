import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { PolicyService } from '../../core/services/policy.service';
import { DelinquencyResponse } from '../../core/models/policy.models';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-delinquencies',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe,
    MatCardModule, MatTableModule, MatIconModule,
    MatProgressSpinnerModule, MatButtonModule, HeaderComponent
  ],
  templateUrl: './delinquencies.component.html',
  styleUrls: ['./delinquencies.component.scss']
})
export class DelinquenciesComponent implements OnInit {

  private readonly policyService = inject(PolicyService);

  delinquencies: DelinquencyResponse[] = [];
  loading = false;
  columns = ['insuredName', 'overdueDate', 'premiumTotal', 'insuredCapital', 'insurer', 'status'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.policyService.listDelinquencies().subscribe({
      next: (data) => { this.delinquencies = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get totalOverdue(): number {
    return this.delinquencies.reduce((sum, d) => sum + (d.premiumTotal ?? 0), 0);
  }
}
