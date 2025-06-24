import { Component, OnInit, ViewChild } from '@angular/core'
import { Noticia } from '../../noticia.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgForm } from '@angular/forms'
import { PagedResponse } from '../../paged-response.model'
import { Router } from '@angular/router'
import { Anuncio } from '../../../models/anuncio.model'
import { AdPositionLabels, AnuncioService } from '../../services/anuncio.service'

@Component({
  selector: 'app-gerenciar-noticias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './gerenciar-noticias.component.html',
  styleUrl: './gerenciar-noticias.component.css'
})
export class GerenciarNoticiasComponent implements OnInit {
  @ViewChild('noticiaForm') noticiaForm!: NgForm
  apiBaseUrl: string = 'http://localhost:8080'
  noticia: Noticia = new Noticia()
  imageUrl: string = ''
  isSubmitting = false
  categorias: any = []
  types: any
  noticias: Noticia[] = []

  anuncios: any[] = [];

  anuncio: Anuncio = {
    url: '',
    imagem: '',
    position: 'MAIN_TOP',
    dataExpiracao: ''
  };

  adPositions: string[] = [];


  constructor(private http: HttpClient, private router: Router, private anuncioService: AnuncioService) {}

  ngOnInit(): void {
    const authHeader = localStorage.getItem('authHeader')
    if (!authHeader) {
      alert('Por favor, faça login primeiro.')
      this.router.navigate(['/login'])
      return
    }

  this.http.get(`${this.apiBaseUrl}/api/categorias`).subscribe(
    (response: any) => {
      this.categorias = response
    },
    (error: any) => {
      console.error('Erro ao carregar categorias:', error)
      alert('Não foi possível carregar as categorias.')
    }
  )

  this.http.get(`${this.apiBaseUrl}/api/tipos`).subscribe(
    (response: any) => {
      this.types = response
    },
    (error: any) => {
      console.error('Erro ao carregar tipos:', error)
      alert('Não foi possível carregar os tipos.')
    }
  )

  this.loadNoticias()
  this.loadAnuncios()

  const headers = new HttpHeaders({
    Authorization: authHeader
  });

  this.anuncioService.getAdPositions(headers).subscribe(
    (positions) => this.adPositions = positions,
    (error) => console.error('Erro ao carregar posições de anúncio', error)
  );
}

onDeleteAnuncio(id: number): void {
  if (confirm('Tem certeza que deseja apagar este anúncio?')) {
    const authHeader = localStorage.getItem('authHeader');
    const headers = new HttpHeaders({ Authorization: authHeader || '' });

    this.anuncioService.deletar(id, headers).subscribe(
      () => {
        alert('Anúncio deletado com sucesso!');
        this.loadAnuncios();
      },
      (error) => {
        console.error('Erro ao deletar anúncio:', error);
        alert('Erro ao apagar o anúncio.');
      }
    );
  }
}

loadAnuncios(): void {
  const authHeader = localStorage.getItem('authHeader');
  const headers = new HttpHeaders({ Authorization: authHeader || '' });

  this.anuncioService.getAll(headers).subscribe(
    (response) => this.anuncios = response,
    (error) => console.error('Erro ao carregar anúncios:', error)
  );

  if (this.anuncios.length === 0) {
    console.log("Não há anúncios cadastrados")
  }
}

getAdPositionLabel(position: string): string {
  return AdPositionLabels[position] || position;
}

onAnuncioImageChange(event: any): void {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    this.anuncio.imagem = file;
  } else {
    alert('Selecione uma imagem válida.');
    event.target.value = '';
  }
}

onSubmitAnuncio(): void {
  if (!this.anuncio.url || !this.anuncio.position || !this.anuncio.dataExpiracao || !this.anuncio.imagem) {
    alert('Preencha todos os campos do anúncio.');
    return;
  }

  this.isSubmitting = true;

  this.anuncioService.criar(this.anuncio).subscribe(
    (response) => {
      alert('Anúncio cadastrado com sucesso!');
      this.anuncio = { url: '', imagem: '', position: 'MAIN_TOP', dataExpiracao: '' };
      this.isSubmitting = false;
      this.loadAnuncios();
    },
    (error) => {
      console.error('Erro ao cadastrar anúncio:', error);
      alert('Erro ao cadastrar anúncio.');
      this.isSubmitting = false;
    }
  );
}

loadNoticias(page: number = 0, size: number = 10): void {
  this.http.get<PagedResponse<Noticia>>(`${this.apiBaseUrl}/api/noticias/todas?page=${page}&size=${size}`).subscribe(
    (response) => {
      this.noticias = response.content
    },
    (error) => {
      console.error('Erro ao carregar notícias:', error)
      alert('Não foi possível carregar as notícias.')
    }
  )
}

editNoticia(noticia: Noticia): void {
  console.log('Noticia selecionada:', noticia)
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

onDelete(): void {
  if (confirm('Tem certeza que deseja apagar esta notícia?')) {
    this.isSubmitting = true
    const authHeader = localStorage.getItem('authHeader')

    const headers = { Authorization: authHeader !== null ? authHeader : '' }

    this.http.delete(`${this.apiBaseUrl}/api/noticias/cadastro/${this.noticia.id}`, { headers }).subscribe(
      (response: any) => {
        alert('Notícia apagada com sucesso!')
        this.loadNoticias()
        this.noticia = new Noticia()
        this.isSubmitting = false
      },
      (error: any) => {
        console.error('Erro ao apagar notícia:', error)
        alert('Erro ao apagar a notícia.')
        this.isSubmitting = false
      }
    )
  }
}


onClear() {
  this.noticia = new Noticia()
}


  onImageChange(event: any): void {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      this.noticia.imagePath = file
    } else {
      alert('Por favor, selecione um arquivo de imagem válido.')
      event.target.value = ''
    }
  }

  onSubmit(): void {
    if (!this.noticiaForm.valid || this.isSubmitting) return
    const authHeader = localStorage.getItem('authHeader')
  
    const headers = { Authorization: authHeader !== null ? authHeader : '' }

    this.isSubmitting = true
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
        alert(this.noticia.id ? 'Notícia atualizada com sucesso!' : 'Notícia cadastrada com sucesso!')
        this.isSubmitting = false
        this.noticia = new Noticia()
        this.loadNoticias()
      },
      (error: any) => {
        console.error(error)
        alert('Erro ao salvar a notícia.')
        this.isSubmitting = false
      }
    )
  }
  

}
