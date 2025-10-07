import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { Noticia } from '../../models/noticia.model'
import { PagedResponse } from '../../models/paged-response.model'

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  private baseUrl = `${environment.apiBaseUrl}/api/noticias`

  constructor(private http: HttpClient) { }

  getNoticias(page: number = 0, size: number = 15): Observable<PagedResponse<Noticia>> {
    return this.http.get<PagedResponse<Noticia>>(`${this.baseUrl}/todas?page=${page}&size=${size}`)
  }

  cadastrarNoticia(data: {
    type: string
    category: string
    headline: string
    subtitle: string
    summary: string
    fullText: string
    image?: File
  }): Observable<Noticia> {
    const formData = new FormData()
    formData.append('type', data.type)
    formData.append('category', data.category)
    formData.append('headline', data.headline)
    formData.append('subtitle', data.subtitle)
    formData.append('summary', data.summary)
    formData.append('fullText', data.fullText)

    if (data.image) {
      formData.append('image', data.image)
    }

    const authHeader = localStorage.getItem('authHeader')
    const headers = new HttpHeaders({
      Authorization: authHeader ?? ''
    })

    return this.http.post<Noticia>(`${this.baseUrl}/cadastro`, formData, { headers })
  }

  atualizarNoticia(id: number, data: {
    type?: string
    category?: string
    headline?: string
    subtitle?: string
    summary?: string
    fullText?: string
    image?: File
  }): Observable<Noticia> {
    const formData = new FormData()
    if (data.type) formData.append('type', data.type)
    if (data.category) formData.append('category', data.category)
    if (data.headline) formData.append('headline', data.headline)
    if (data.subtitle) formData.append('subtitle', data.subtitle)
    if (data.summary) formData.append('summary', data.summary)
    if (data.fullText) formData.append('fullText', data.fullText)
    if (data.image) formData.append('image', data.image)

    const authHeader = localStorage.getItem('authHeader')
    const headers = new HttpHeaders({
      Authorization: authHeader ?? ''
    })

    return this.http.put<Noticia>(`${this.baseUrl}/cadastro/${id}`, formData, { headers })
  }

  deletarNoticia(id: number): Observable<void> {
    const authHeader = localStorage.getItem('authHeader')
    const headers = new HttpHeaders({
      Authorization: authHeader ?? ''
    })
    return this.http.delete<void>(`${this.baseUrl}/cadastro/${id}`, { headers })
  }
}
