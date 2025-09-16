import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AuthService } from '../../services/auth.service'
import { SpinnerComponent } from '../spinner/spinner.component'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SpinnerComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  isProd: boolean = true
  username: string = ''
  password: string = ''
  isSubmitting = false
  errorMessage: string = ''
  portfolio = true
  isLoading: boolean = false

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.isSubmitting = true
    this.errorMessage = ''

    const body = {
      username: this.username,
      password: this.password
    }

    this.isLoading = true
    if (this.isProd) {
      
      this.authService.login(body).subscribe(
        () => {
          this.isLoading = false
          this.router.navigate(['/gerenciar-noticias'])
        },
        (error) => {
          this.isLoading = false
          this.errorMessage = (error.status === 403 || error.status === 401) ? 'Usuário ou senha inválidos.' : 'Erro desconhecido.'
          this.isSubmitting = false
        }
      )
    }
    else {
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
      this.router.navigate(['/gerenciar-noticias'])
    }
  }
}