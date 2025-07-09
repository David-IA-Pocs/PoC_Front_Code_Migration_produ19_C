import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private readonly baseUrl = 'https://zwhf4xnv-5000.use2.devtunnels.ms';

  constructor(private http: HttpClient) {}

  checkHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }

  testUserAccess(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/test/user`);
  }

  testAdminAccess(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/test/admin`);
  }
}
