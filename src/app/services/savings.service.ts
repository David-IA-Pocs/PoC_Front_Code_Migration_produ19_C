import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private readonly baseUrl = 'https://zwhf4xnv-5000.use2.devtunnels.ms';

  constructor(private http: HttpClient) {}

  getMyAccounts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/api/savings-account/my-accounts`
    );
  }

  createSavingsAccount(accountData: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/savings-account/create`,
      accountData
    );
  }
}
