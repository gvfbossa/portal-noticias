import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'
import { DatePipe } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { AddsComponent } from "../adds/adds.component"
import { Noticia } from '../../../models/noticia.model'
import { SpinnerComponent } from "../spinner/spinner.component"

@Component({
  selector: 'app-noticia',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterModule,
    AddsComponent,
    SpinnerComponent
],
  templateUrl: './noticia.component.html',
  styleUrl: './noticia.component.css'
})

export class NoticiaComponent implements OnInit {

  noticia!: Noticia
  fullTextProcessed!: SafeHtml
  highlights: any[] = []
  commonNews: any[] = []

  isLoading: boolean = false

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.isLoading = true
    this.noticia = history.state?.noticia

    if (!this.noticia) {      
      const id = this.route.snapshot.paramMap.get('id')
      if (id) {
        this.noticia = this.findNoticiaById(id)
      }
    }

    if (this.noticia?.fullText) {
      this.fullTextProcessed = this.sanitizeFullText(this.noticia.fullText)
    }
    this.isLoading = false
  }

  findNoticiaById(id: string | null): any {
    if (id) {
      console.log('Buscando notícia pelo ID:', id)
      return [...this.highlights, ...this.commonNews]
        .find(noticia => noticia.id.toString() === id)
    }
    return null
  }

  sanitizeFullText(text: string): SafeHtml {
    const processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return this.sanitizer.bypassSecurityTrustHtml(processedText)
  }  

}
