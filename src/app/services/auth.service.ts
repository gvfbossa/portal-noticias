import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/login`

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    const encodedPassword = btoa(credentials.password);

    return this.http.post(this.apiUrl, {
      username: credentials.username,
      password: encodedPassword,
      type: 'Usuario'
    }, { observe: 'response' })
      .pipe(
        tap(resp => {
          const token = resp.headers.get('Authorization')
          console.log(resp.headers)
          if (token) {
            localStorage.setItem('authHeader', token);
            console.log('JWT Token:', token);
          } else {
            throw new Error('Token não retornado');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authHeader')
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authHeader')
  }

  getAuthHeader(): string | null {
    return localStorage.getItem('authHeader')
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.getAuthHeader()
    return { headers: new HttpHeaders({ Authorization: token ?? '' }) }
  }
}
