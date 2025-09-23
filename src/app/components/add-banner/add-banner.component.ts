import { Component, OnInit } from '@angular/core'
import { AnuncioService } from '../../services/anuncio.service'
import { Anuncio } from '../../../models/anuncio.model'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-add-banner',
  standalone: true,
  imports: [
    CommonModule],
  templateUrl: './add-banner.component.html',
  styleUrl: './add-banner.component.css'
})
export class AddBannerComponent implements OnInit {
  
  temAnuncioMainTop: boolean = false
  anuncios: Anuncio[] = []

  constructor(private anuncioService: AnuncioService) {}

  ngOnInit(): void {
      this.anuncioService.getAll().subscribe({
      next: (response) => {
        this.anuncios = response

        this.anuncios
          .filter((anuncio) => anuncio.position === 'MAIN_TOP').length > 0 ? this.temAnuncioMainTop = false : this.temAnuncioMainTop = true

      },
      error: (err) => {
        console.error('Erro ao buscar anúncios:', err)
      },
    })
  }

}
