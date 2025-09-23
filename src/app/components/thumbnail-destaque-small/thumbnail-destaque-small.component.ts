import { Component, Input } from '@angular/core'
import { Noticia } from '../../../models/noticia.model'
import { CommonModule, DatePipe } from '@angular/common'

@Component({
  selector: 'app-thumbnail-destaque-small',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './thumbnail-destaque-small.component.html',
  styleUrl: './thumbnail-destaque-small.component.css'
})
export class ThumbnailDestaqueSmallComponent {
  @Input() noticia!: Noticia
}
