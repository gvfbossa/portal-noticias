import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ThumbnailDestaqueComponent } from '../components/thumbnail-destaque/thumbnail-destaque.component'
import { ThumbnailNoticiaComponent } from '../components/thumbnail-noticia/thumbnail-noticia.component'
import { NoticiaService } from '../services/noticia.service'
import { Router } from '@angular/router'
import { AddsComponent } from "../components/adds/adds.component"
import { Noticia } from '../../models/noticia.model'
import { SpinnerComponent } from "../components/spinner/spinner.component"
import { ThumbnailDestaqueSmallComponent } from "../components/thumbnail-destaque-small/thumbnail-destaque-small.component"

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ThumbnailDestaqueComponent,
    ThumbnailNoticiaComponent,
    AddsComponent,
    SpinnerComponent,
    ThumbnailDestaqueSmallComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent implements OnInit {

  highlights: Noticia[] = []
  commonNews: Noticia[] = []
  latestCommonNews: Noticia[] = []

  currentSlide = 0
  interval: any

  isLoading: boolean = false

  @ViewChild('highlightScroll', { static: true }) highlightScroll!: ElementRef
  indicatorPosition = 0

  constructor(private router: Router, private noticiaService: NoticiaService) { }

  ngOnInit(): void {
    this.isLoading = true
    this.noticiaService.getNoticiasMock().subscribe({
      next: (response) => {
        const noticias = response.content

        if (Array.isArray(noticias)) {
          this.highlights = noticias
            .filter((news) => news.type === 'HIGHLIGHT')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          this.commonNews = noticias
            .filter((news) => news.type === 'COMMON')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          this.latestCommonNews = this.commonNews.slice(0, 6)
          this.commonNews = this.commonNews.slice(6, this.commonNews.length - 1)
        }
      },
      error: (err) => {
        console.error('Erro ao buscar notícias:', err)
      },
    })
    setTimeout(() => {
      this.isLoading = false
    }, 500)

    this.startAutoSlide()
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.highlights.length
    this.updateCarousel()
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.highlights.length) % this.highlights.length
    this.updateCarousel()
  }

  updateCarousel() {
    const container = document.querySelector('.main__carousel-container') as HTMLElement
    const items = container.children
    const currentItem = items[this.currentSlide] as HTMLElement

    const itemWidth = currentItem.getBoundingClientRect().width

    const offset = -(this.currentSlide * itemWidth)
    container.style.transform = `translateX(${offset}px)`
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide()
    }, 5000)
  }

  goToNoticia(id: number): void {
    let noticia = this.highlights
      .concat(this.commonNews)
      .concat(this.latestCommonNews)
      .find((news: Noticia) => news.id === id)

    if (noticia) {
      this.router.navigate(['/noticia', id], { state: { noticia } })
    }
    window.scrollTo(0,0)
  }

}
