import { Component, Input } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { Noticia } from '../../noticia.model'

@Component({
  selector: 'app-thumbnail-noticia',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './thumbnail-noticia.component.html',
  styleUrl: './thumbnail-noticia.component.css'
})
export class ThumbnailNoticiaComponent {
  @Input() noticia!: Noticia
}
