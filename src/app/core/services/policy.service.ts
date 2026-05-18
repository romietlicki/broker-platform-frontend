import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PageResponse, PolicyFilter, PolicyResponse,
  DelinquencyResponse, CommissionResponse
} from '../models/policy.models';

@Injectable({ providedIn: 'root' })
export class PolicyService {

  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/policies`;

  listPolicies(filter: PolicyFilter): Observable<PageResponse<PolicyResponse>> {
    let params = new HttpParams()
      .set('page', filter.page ?? 0)
      .set('size', filter.size ?? 20)
      .set('sortBy', filter.sortBy ?? 'insuredName')
      .set('sortDir', filter.sortDir ?? 'asc');

    if (filter.status) params = params.set('status', filter.status);
    if (filter.insuredName) params = params.set('insuredName', filter.insuredName);

    return this.http.get<PageResponse<PolicyResponse>>(this.base, { params });
  }

  getPolicy(id: number): Observable<PolicyResponse> {
    return this.http.get<PolicyResponse>(`${this.base}/${id}`);
  }

  listDelinquencies(): Observable<DelinquencyResponse[]> {
    return this.http.get<DelinquencyResponse[]>(`${this.base}/delinquencies`);
  }

  syncAll(): Observable<{ synced: number; message: string }> {
    return this.http.post<{ synced: number; message: string }>(`${this.base}/sync`, {});
  }

  syncByInsurer(insurer: string): Observable<{ synced: number; insurer: string }> {
    return this.http.post<{ synced: number; insurer: string }>(`${this.base}/sync/${insurer}`, {});
  }
}
