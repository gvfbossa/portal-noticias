import { Component, OnInit, ViewChild } from '@angular/core'
import { Noticia } from '../../../models/noticia.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgForm } from '@angular/forms'
import { PagedResponse } from '../../../models/paged-response.model'
import { Router } from '@angular/router'
import { Anuncio } from '../../../models/anuncio.model'
import { AdPositionLabels, AnuncioService } from '../../services/anuncio.service'
import { environment } from '../../../environments/environment'
import { delay, of } from 'rxjs'
import { NoticiaService } from '../../services/noticia.service'
import { SpinnerComponent } from "../spinner/spinner.component"
import { ToastService } from '../../services/toast.service'
import { ConfirmService } from '../../services/confirm.service'

@Component({
  selector: 'app-gerenciar-noticias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SpinnerComponent
  ],
  templateUrl: './gerenciar-noticias.component.html',
  styleUrl: './gerenciar-noticias.component.css'
})
export class GerenciarNoticiasComponent implements OnInit {
  @ViewChild('noticiaForm') noticiaForm!: NgForm
  apiBaseUrl: string = environment.apiBaseUrl
  noticia: Noticia = new Noticia()
  imageUrl: string = ''
  isSubmitting = false
  categorias: any = []
  types: any
  noticias: Noticia[] = []

  isLoading: boolean = false

  anuncios: any[] = []

  anuncio: Anuncio = {
    url: '',
    imagem: '',
    position: 'MAIN_TOP',
    dataExpiracao: ''
  }

  adPositions: string[] = []

  portfolio = true

  constructor(private http: HttpClient, private router: Router, private anuncioService: AnuncioService, private noticiaService: NoticiaService, private toastService: ToastService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    const authHeader = localStorage.getItem('authHeader')
    if (!authHeader) {
      this.toastService.show('Por favor, faça login primeiro.', 'warning')
      this.router.navigate(['/login'])
      return
    }
    this.http.get(`${this.apiBaseUrl}/api/categorias`).subscribe(
      (response: any) => {
        this.categorias = response
      },
      (error: any) => {
        this.toastService.show('Não foi possível carregar as categorias.', 'error')
      }
    )

    this.http.get(`${this.apiBaseUrl}/api/tipos`).subscribe(
      (response: any) => {
        this.types = response
      },
      (error: any) => {
        this.toastService.show('Não foi possível carregar os tipos.', 'error')
      }
    )

    this.loadNoticias()
    this.loadAnuncios()

    const headers = new HttpHeaders({
      Authorization: authHeader
    })

    this.anuncioService.getAdPositions(headers).subscribe(
      (positions) => this.adPositions = positions,
      (error) => console.error('Erro ao carregar posições de anúncio', error)
    )
  }

  async onDeleteAnuncio(id: number) {
    const confirmed = await this.confirmService.confirm('Tem certeza que deseja apagar este anúncio?')

    if (!confirmed) return

    if (this.portfolio) {
      this.toastService.show('Você irá apagar o anúncio! (Esta é uma simulação)', 'warning')
      return
    }

    const authHeader = localStorage.getItem('authHeader')
    const headers = new HttpHeaders({ Authorization: authHeader || '' })

    this.anuncioService.deletar(id, headers).subscribe(
      () => {
        this.toastService.show('Anúncio deletado com sucesso!', 'success')
        this.loadAnuncios()
      },
      (error) => {
        this.toastService.show('Erro ao apagar o anúncio.', 'error')
      }
    )
  }

  loadAnuncios(): void {
    const authHeader = localStorage.getItem('authHeader')
    const headers = new HttpHeaders({ Authorization: authHeader || '' })

    this.anuncioService.getAll(headers).subscribe(
      (response) => this.anuncios = response,
      (error) => console.error('Erro ao carregar anúncios:', error)
    )

    if (this.anuncios.length === 0) {
      console.log("Não há anúncios cadastrados")
    }
  }

  getAdPositionLabel(position: string): string {
    return AdPositionLabels[position] || position
  }

  onAnuncioImageChange(event: any): void {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      this.anuncio.imagem = file
    } else {
      this.toastService.show('Selecione uma imagem válida.', 'warning')
      event.target.value = ''
    }
  }

  onSubmitAnuncio(): void {
    if (!this.anuncio.url || !this.anuncio.position || !this.anuncio.dataExpiracao || !this.anuncio.imagem) {
      this.toastService.show('Preencha todos os campos do anúncio.', 'warning')
      return
    }

    if (this.portfolio) {
      this.toastService.show('Você irá cadastrar um anúncio! (Esta é uma simulação).', 'info')
      this.anuncio = { url: '', imagem: '', position: 'MAIN_TOP', dataExpiracao: '' }
      this.isSubmitting = false
      this.loadAnuncios()
      return
    }

    this.isSubmitting = true

    this.anuncioService.criar(this.anuncio).subscribe(
      (response) => {
        this.toastService.show('Anúncio cadastrado com sucesso!', 'success')
        this.anuncio = { url: '', imagem: '', position: 'MAIN_TOP', dataExpiracao: '' }
        this.isSubmitting = false
        this.loadAnuncios()
      },
      (error) => {
        console.error('Erro ao cadastrar anúncio:', error)
        this.toastService.show('Erro ao cadastrar anúncio', 'error')
        this.isSubmitting = false
      }
    )
  }

  loadNoticias(page: number = 0, size: number = 10): void {
    if (this.portfolio) {
      this.noticiaService.getNoticias().pipe(delay(300)).subscribe(res => {
        this.noticias = res.content
      })
      return
    }
    this.isLoading = true
    this.http.get<PagedResponse<Noticia>>(`${this.apiBaseUrl}/api/noticias/todas?page=${page}&size=${size}`).subscribe(
      (response) => {
        this.isLoading = false
        this.noticias = response.content
      },
      (error) => {
        this.isLoading = false
        console.error('Erro ao carregar notícias:', error)
        this.toastService.show('Não foi possível carregar as notícias.', 'error')
      }
    )
  }

  editNoticia(noticia: Noticia): void {
    this.noticia = { ...noticia }
    if (this.noticiaForm) {
      this.noticiaForm.form.patchValue({
        type: this.noticia.type,
        category: this.noticia.category,
        headline: this.noticia.headline,
        subtitle: this.noticia.subtitle,
        summary: this.noticia.summary,
        fullText: this.noticia.fullText
      })
    }
  }

  async onDelete() {
    const confirmed = await this.confirmService.confirm('Tem certeza que deseja apagar esta notícia?')

    if (!confirmed) return

    if (this.portfolio) {
      this.toastService.show('Você irá apagar a notícia! (Esta é uma simulação).', 'info')
      return
    }
    this.isSubmitting = true
    this.isLoading = true
    const authHeader = localStorage.getItem('authHeader')

    const headers = { Authorization: authHeader !== null ? authHeader : '' }

    this.http.delete(`${this.apiBaseUrl}/api/noticias/cadastro/${this.noticia.id}`, { headers }).subscribe(
      (response: any) => {
        this.isLoading = false
        this.toastService.show('Notícia apagada com sucesso!', 'success')
        this.loadNoticias()
        this.noticia = new Noticia()
        this.isSubmitting = false
      },
      (error: any) => {
        this.isLoading = false
        this.toastService.show('Erro ao apagar a notícia.', 'error')
        this.isSubmitting = false
      }
    )
  }


  onClear() {
    this.noticia = new Noticia()
  }


  onImageChange(event: any): void {
    if (this.portfolio) {
      this.toastService.show('Você irá substituir a imagem da notícia! (Esta é uma simulação).', 'info')
      return
    }
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      this.noticia.imagePath = file
    } else {
      this.toastService.show('Por favor, selecione um arquivo de imagem válido', 'warning')
      event.target.value = ''
    }
  }

  onSubmit(): void {
    if (this.portfolio) {
      this.toastService.show('Você irá publicar a notícia! (Esta é uma simulação)', 'info')
      return
    }
    if (!this.noticiaForm.valid || this.isSubmitting) return
    const authHeader = localStorage.getItem('authHeader')

    const headers = { Authorization: authHeader !== null ? authHeader : '' }

    this.isSubmitting = true
    this.isLoading = true
    const formData = new FormData()
    formData.append('type', this.noticia.type)
    formData.append('category', this.noticia.category)
    formData.append('headline', this.noticia.headline)
    formData.append('subtitle', this.noticia.subtitle)
    formData.append('summary', this.noticia.summary)
    formData.append('fullText', this.noticia.fullText)
    if (this.noticia.imagePath) {
      formData.append('image', this.noticia.imagePath)
    }

    const requestUrl = this.noticia.id
      ? `${this.apiBaseUrl}/api/noticias/cadastro/${this.noticia.id}`
      : `${this.apiBaseUrl}/api/noticias/cadastro`

    const requestMethod = this.noticia.id ? 'put' : 'post'

    this.http[requestMethod](requestUrl, formData, { headers }
    ).subscribe(
      (response: any) => {
        this.toastService.show(this.noticia.id ? 'Notícia atualizada com sucesso!' : 'Notícia cadastrada com sucesso!', 'success')
        this.isSubmitting = false
        this.isLoading = false
        this.noticia = new Noticia()
        this.loadNoticias()
      },
      (error: any) => {
        console.error(error)
        this.isLoading = false
        this.toastService.show('Erro ao salvar a notícia.', 'error')
        this.isSubmitting = false
      }
    )
  }


}