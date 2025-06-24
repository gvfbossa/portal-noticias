import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  isProd: boolean = true;
  username: string = ''
  password: string = ''
  isSubmitting = false
  errorMessage: string = ''

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.isSubmitting = true
    this.errorMessage = ''

    const body = {
      username: this.username,
      password: this.password
    }

    if (this.isProd) {
      // Chama o método de login do AuthService para gerenciar a autenticação
      this.authService.login(body).subscribe(
        () => {
          // Redireciona para a página de gerenciamento de notícias
          this.router.navigate(['/gerenciar-noticias'])
        },
        (error) => {
          this.errorMessage = (error.status === 403 || error.status === 401) ? 'Usuário ou senha inválidos.' : 'Erro desconhecido.'
          this.isSubmitting = false
        }
      )
    }
    else {
      this.router.navigate(['/gerenciar-noticias'])
    }
  }
}