import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { PolicyService } from '../../core/services/policy.service';
import { AuthService } from '../../core/services/auth.service';
import { PolicyResponse, DelinquencyResponse, PolicyFilter } from '../../core/models/policy.models';
import { PolicyDetailDialogComponent } from '../policies/policy-detail/policy-detail-dialog.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PolicyCountPipe } from '../../shared/pipes/policy-count.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe,
    MatTabsModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatPaginatorModule, MatChipsModule, MatDialogModule,
    MatTooltipModule, MatSnackBarModule, MatBadgeModule,
    HeaderComponent, PolicyCountPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private readonly policyService = inject(PolicyService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly user = this.authService.getUser();

  policies: PolicyResponse[] = [];
  delinquencies: DelinquencyResponse[] = [];

  policyColumns = ['insuredName', 'status', 'insurer', 'startDate', 'premiumTotal', 'actions'];
  delinquencyColumns = ['insuredName', 'overdueDate', 'premiumTotal', 'insuredCapital', 'insurer'];

  totalPolicies = 0;
  pageSize = 10;
  currentPage = 0;
  loadingPolicies = false;
  loadingDelinquencies = false;
  syncingAll = false;

  searchName = '';
  filterStatus = '';

  readonly statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'VIGENTE', label: 'Vigente' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'CANCELADA', label: 'Cancelada' }
  ];

  ngOnInit(): void {
    this.loadPolicies();
    this.loadDelinquencies();
  }

  loadPolicies(): void {
    this.loadingPolicies = true;
    const filter: PolicyFilter = {
      page: this.currentPage,
      size: this.pageSize,
      insuredName: this.searchName || undefined,
      status: this.filterStatus || undefined
    };

    this.policyService.listPolicies(filter).subscribe({
      next: (page) => {
        this.policies = page.content;
        this.totalPolicies = page.totalElements;
        this.loadingPolicies = false;
      },
      error: () => { this.loadingPolicies = false; }
    });
  }

  loadDelinquencies(): void {
    this.loadingDelinquencies = true;
    this.policyService.listDelinquencies().subscribe({
      next: (data) => {
        this.delinquencies = data;
        this.loadingDelinquencies = false;
      },
      error: () => { this.loadingDelinquencies = false; }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPolicies();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadPolicies();
  }

  openPolicyDetail(policy: PolicyResponse): void {
    this.dialog.open(PolicyDetailDialogComponent, {
      data: policy,
      width: '640px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  syncAll(): void {
    this.syncingAll = true;
    this.policyService.syncAll().subscribe({
      next: (res) => {
        this.syncingAll = false;
        this.snackBar.open(`${res.message} — ${res.synced} apólice(s) sincronizada(s)`, 'OK', {
          duration: 4000, panelClass: ['snack-success']
        });
        this.loadPolicies();
        this.loadDelinquencies();
      },
      error: () => {
        this.syncingAll = false;
        this.snackBar.open('Erro ao sincronizar apólices.', 'Fechar', {
          duration: 4000, panelClass: ['snack-error']
        });
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      VIGENTE: 'status-vigente',
      PENDENTE: 'status-pendente',
      CANCELADA: 'status-cancelada'
    };
    return map[status] ?? '';
  }
}
