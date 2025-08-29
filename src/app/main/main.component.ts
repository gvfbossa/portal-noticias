import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ThumbnailDestaqueComponent } from '../components/thumbnail-destaque/thumbnail-destaque.component'
import { ThumbnailNoticiaComponent } from '../components/thumbnail-noticia/thumbnail-noticia.component'
import { NoticiaService } from '../services/noticia.service'
import { Router } from '@angular/router'
import { AddsComponent } from "../components/adds/adds.component"
import { Noticia } from '../../models/noticia.model'
import { AnuncioComponent } from "../components/anuncio/anunucio.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ThumbnailDestaqueComponent,
    ThumbnailNoticiaComponent,
    AddsComponent,
    AnuncioComponent,
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent implements OnInit {

  highlights: Noticia[] = []
  commonNews: Noticia[] = []
  currentSlide = 0;
  interval: any;

  @ViewChild('highlightScroll', { static: true }) highlightScroll!: ElementRef
  indicatorPosition = 0

  constructor(private router: Router, private noticiaService: NoticiaService) {}

  ngOnInit(): void {
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
        }
      },
      error: (err) => {
        console.error('Erro ao buscar notícias:', err)
      },
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
    const container = document.querySelector('.main__carousel-container') as HTMLElement;
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

  goToNoticia(id: number): void {
    let noticia = this.highlights.concat(this.commonNews).find((news: Noticia) => news.id === id)
    if (noticia) {
      this.router.navigate(['/noticia', id], { state: { noticia } })
    }
  }

}
