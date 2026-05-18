import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommissionResponse } from '../models/policy.models';

@Injectable({ providedIn: 'root' })
export class CommissionService {

  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/commissions`;

  getCommissions(month?: number, year?: number): Observable<CommissionResponse[]> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    if (year) params = params.set('year', year);
    return this.http.get<CommissionResponse[]>(this.base, { params });
  }

  getByInsurer(insurer: string, month: number, year: number): Observable<CommissionResponse[]> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<CommissionResponse[]>(`${this.base}/${insurer}`, { params });
  }
}
