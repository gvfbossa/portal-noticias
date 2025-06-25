import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}'/login`;
  private authHeader: string | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    const encodedPassword = btoa(credentials.password);
  
    return this.http.post<{ token: string }>(this.apiUrl, {
      username: credentials.username,
      password: encodedPassword,
    }).pipe(
      tap((response: { token: string; }) => {
        localStorage.setItem('authHeader', response.token);
        console.log(response.token)
      })
    );
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
