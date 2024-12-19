import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { NoticiaService } from '../services/noticia.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private noticiaService: NoticiaService) {}

  isMenuOpen = false

  currentDateTime: string = ''

  searchQuery: string = ''
  filteredNoticias: any[] = []
  noticias: any[] = []

  categories: { 
    name: string; 
    route: string; 
    subcategories?: { name: string; route: string }[] 
  }[] = [
    { 
      name: 'NOTÍCIAS', 
      route: '', 
      subcategories: [
        { name: 'Geral', route: 'noticia-categoria/geral' },
        { name: 'Política', route: 'noticia-categoria/politica' },
        { name: 'Policial', route: 'noticia-categoria/policial' },
        { name: 'Esportes', route: 'noticia-categoria/esportes' },
        { name: 'Cultura', route: 'noticia-categoria/cultura' },
      ]
    },
    { name: 'AGENDA', route: 'noticia-categoria/agenda'},
    { name: 'EMPREGO', route: 'noticia-categoria/emprego'},
    { name: 'ACHADOS E PERDIDOS', route: 'noticia-categoria/achadosperdidos'},
    { name: 'PRODUTOS E SERVIÇOS', route: 'noticia-categoria/anuncios'},
    { name: 'RECLAMAÇÕES', route: 'noticia-categoria/reclamacoes'},
  ]
  
  
  ngOnInit(): void {
    this.updateDateTime()
    
    this.noticiaService.getNoticias().subscribe(noticias => {

      this.noticias = noticias.content
    })
  }

  navigateTo(route: any, toggle: boolean) {
    this.router.navigate([route])
    if (toggle)
      this.toggleMenu()
  }

  navigateToNoticia(noticia: any) {
    this.filteredNoticias = []
    this.searchQuery = ''
    if (noticia) {
      this.router.navigate(['/noticia', noticia.id], { state: { noticia } })
    }
  }

  filterNoticias() {
    const searchTerm = this.searchQuery.trim().toLowerCase()
    if (searchTerm.length > 2) {
      this.filteredNoticias = this.noticias.filter((noticia) =>
        noticia.headline.toLowerCase().includes(searchTerm)
      )
    } else {
      this.filteredNoticias = []
    }
  }

  focusOnSearch() {
    document.getElementById('search-box')?.focus()
  }    

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  updateDateTime() {
    const now = new Date()
    this.currentDateTime = this.capitalizeWords(
      now.toLocaleString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }
  
  capitalizeWords(input: string): string {
    return input
      .split(' ')
      .map(word => word != 'de' ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0) + word.slice(1))
      .join(' ')
  }

}
