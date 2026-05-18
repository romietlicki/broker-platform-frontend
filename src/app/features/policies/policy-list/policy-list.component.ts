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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PolicyService } from '../../../core/services/policy.service';
import { PolicyResponse, PolicyFilter } from '../../../core/models/policy.models';
import { PolicyDetailDialogComponent } from '../policy-detail/policy-detail-dialog.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CurrencyPipe, DatePipe,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatPaginatorModule, MatDialogModule, MatProgressSpinnerModule,
    MatTooltipModule, MatSnackBarModule, HeaderComponent
  ],
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {

  private readonly policyService = inject(PolicyService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  policies: PolicyResponse[] = [];
  loading = false;
  syncing = false;
  total = 0;
  pageSize = 20;
  currentPage = 0;
  searchName = '';
  filterStatus = '';

  columns = ['insuredName', 'status', 'insurer', 'startDate', 'endDate', 'premiumTotal', 'insuredCapital', 'actions'];

  readonly statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'VIGENTE', label: 'Vigente' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'CANCELADA', label: 'Cancelada' }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    const filter: PolicyFilter = {
      page: this.currentPage,
      size: this.pageSize,
      insuredName: this.searchName || undefined,
      status: this.filterStatus || undefined
    };
    this.policyService.listPolicies(filter).subscribe({
      next: (page) => {
        this.policies = page.content;
        this.total = page.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPage(ev: PageEvent): void {
    this.currentPage = ev.pageIndex;
    this.pageSize = ev.pageSize;
    this.load();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.load();
  }

  openDetail(p: PolicyResponse): void {
    this.dialog.open(PolicyDetailDialogComponent, {
      data: p, width: '640px', maxWidth: '95vw', maxHeight: '90vh'
    });
  }

  syncAll(): void {
    this.syncing = true;
    this.policyService.syncAll().subscribe({
      next: (res) => {
        this.syncing = false;
        this.snackBar.open(res.message, 'OK', { duration: 3000, panelClass: ['snack-success'] });
        this.load();
      },
      error: () => {
        this.syncing = false;
        this.snackBar.open('Erro ao sincronizar.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }

  getStatusClass(status: string): string {
    return { VIGENTE: 'status-vigente', PENDENTE: 'status-pendente', CANCELADA: 'status-cancelada' }[status] ?? '';
  }
}
