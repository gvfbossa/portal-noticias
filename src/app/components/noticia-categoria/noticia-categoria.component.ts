import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NoticiaService } from '../../services/noticia.service'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { ThumbnailDestaqueComponent } from "../thumbnail-destaque/thumbnail-destaque.component"
import { ThumbnailNoticiaComponent } from "../thumbnail-noticia/thumbnail-noticia.component"
import { AddsComponent } from "../adds/adds.component"
import { Noticia } from '../../noticia.model'

@Component({
  selector: 'app-noticia-categoria',
  standalone: true,
  imports: [
    CommonModule,
    ThumbnailDestaqueComponent,
    ThumbnailNoticiaComponent,
    AddsComponent
],
  templateUrl: './noticia-categoria.component.html',
  styleUrls: ['./noticia-categoria.component.css']
})
export class NoticiaCategoriaComponent implements OnInit {

  categoria: string = ''
  noticiasFiltradas: Noticia[] = []
  categoriaFormatada: { [key: string]: string } = {
    geral: 'Geral',
    cultura: 'Cultura',
    politica: 'Política',
    policial: 'Policial',
    esportes: 'Esportes',
    agenda: 'Agenda',
    emprego: 'Emprego',
    achadosperdidos: 'Achados e Perdidos',
    anuncios: 'Anúncios',
    reclamacoes: 'Reclamações',
  }

  highlights: Noticia[] = []
  currentSlide = 0;
  interval: any;

  constructor(
    private route: ActivatedRoute,
    private noticiaService: NoticiaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoria = params['type']
      this.filtrarNoticias()
    })

    this.startAutoSlide();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.highlights.length;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.highlights.length) % this.highlights.length;
    this.updateCarousel();
  }

  updateCarousel() {
    const container = document.querySelector('.noticia-categoria__carousel-container') as HTMLElement;
    const items = container.children;
    const currentItem = items[this.currentSlide] as HTMLElement;

    const itemWidth = currentItem.getBoundingClientRect().width;

    const offset = -(this.currentSlide * itemWidth);
    container.style.transform = `translateX(${offset}px)`;
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  filtrarNoticias(): void {
    this.noticiaService.getNoticias().subscribe(todasNoticias => {
      this.noticiasFiltradas = todasNoticias.content.filter((noticia: { category: string }) => {
        return noticia.category === this.categoria.toUpperCase()
      })
    })

    this.highlights = this.noticiasFiltradas.filter((noticia: { type: string }) => {
      return noticia.type === 'HIGHLIGHT'
    })
  }
  
  goToNoticia(id: number): void {
    let noticia = this.noticiasFiltradas.find((news: Noticia) => news.id === id)
    if (noticia) {
      this.router.navigate(['/noticia', id], { state: { noticia } })
    }
  }

  getNomeCategoria(): string {
    return this.categoriaFormatada[this.categoria] || this.categoria
  }
}
