import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { AnuncioService } from '../../services/anuncio.service';
import { Anuncio } from '../../../models/anuncio.model';

@Component({
  selector: 'app-adds',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './adds.component.html',
  styleUrl: './adds.component.css'
})
export class AddsComponent implements OnInit {

  @Input() adPosition: string = '';

  adImage: string = '';
  adLink: string = '';

  constructor(private anuncioService: AnuncioService) {}

  ngOnInit(): void {
    this.anuncioService.getAll().subscribe(
      (anuncios: Anuncio[]) => {
        const anuncio = anuncios.find(ad => ad.position === this.adPosition.toUpperCase());
        if (anuncio) {
          this.adImage = anuncio.imagem;
          this.adLink = anuncio.url;
        }
      },
      (error) => {
        console.error('Erro ao carregar anúncio:', error);
      }
    );
  }
}
