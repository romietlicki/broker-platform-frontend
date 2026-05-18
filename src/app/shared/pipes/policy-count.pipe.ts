import { Pipe, PipeTransform } from '@angular/core';
import { PolicyResponse } from '../../core/models/policy.models';

@Pipe({ name: 'policyCount', standalone: true })
export class PolicyCountPipe implements PipeTransform {
  transform(policies: PolicyResponse[], status: string): number {
    return policies.filter(p => p.status === status).length;
  }
}
