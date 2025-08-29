import { Component,Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Noticia } from '../../../models/noticia.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thumbnail-destaque',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './thumbnail-destaque.component.html',
  styleUrl: './thumbnail-destaque.component.css'
})
export class ThumbnailDestaqueComponent {
  @Input() noticia!: Noticia;
}
