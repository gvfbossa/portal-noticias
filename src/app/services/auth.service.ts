import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/login`;
  private authHeader: string | null = null;
  portfolio = true

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    const encodedPassword = btoa(credentials.password);

    if (this.portfolio) {
      if (credentials.username === 'admin' && encodedPassword === btoa('admin123')) {
        const mockResponse = { token: 'mock-jwt-token-123' };

        return of(mockResponse).pipe(
          delay(500),
          tap((response: { token: string }) => {
            localStorage.setItem('authHeader', response.token);
            console.log('Mock Token:', response.token);
          })
        );
      } else {
        return throwError(() => new Error('Credenciais inválidas'));
      }
    } else {
      return this.http.post<{ token: string }>(this.apiUrl, {
        username: credentials.username,
        password: encodedPassword,
      }).pipe(
        tap((response: { token: string }) => {
          localStorage.setItem('authHeader', response.token);
          console.log(response.token);
        })
      );
    }
  }

  logout(): void {
    localStorage.removeItem('authHeader');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authHeader');
  }

  getAuthHeader(): string | null {
    return localStorage.getItem('authHeader');
  }
}
