import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Anuncio, AdPosition } from '../../models/anuncio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  private baseApi = "http://localhost:8080"
  private apiUrl = '/api/anuncios';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Anuncio> {
    return this.http.get<Anuncio>(`${this.apiUrl}/${id}`);
  }

  getAdPositions(headers?: HttpHeaders): Observable<AdPosition[]> {
  return this.http.get<AdPosition[]>(`${this.baseApi}${this.apiUrl}/add-positions`, {
    headers: headers
  });
}

  criar(anuncio: {
  url: string;
  imagem: File | string;
  position: string;
  dataExpiracao: string;
}): Observable<any> {
  const formData = new FormData();
  formData.append('url', anuncio.url);
  formData.append('position', anuncio.position);
  formData.append('dataExpiracao', anuncio.dataExpiracao);

  if (anuncio.imagem instanceof File) {
    formData.append('imagem', anuncio.imagem);
  }

  const authHeader = localStorage.getItem('authHeader');
  const headers = new HttpHeaders({
    Authorization: authHeader ?? ''
  });

  return this.http.post(`${this.baseApi}${this.apiUrl}/cadastro`, formData, { headers });
}

  getAll(headers?: HttpHeaders): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.baseApi}${this.apiUrl}`, { headers });
  }

  deletar(id: number, headers?: HttpHeaders): Observable<void> {
    return this.http.delete<void>(`${this.baseApi}${this.apiUrl}/remove/${id}`, { headers });
  }
  
}

export const AdPositionLabels: Record<string, string> = {
  MAIN_TOP: 'Topo da Página',
  MAIN_MIDDLE: 'Meio da Página',
  NEWS_RIGHT: 'Lateral Notícias',
};
