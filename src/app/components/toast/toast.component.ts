import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toasts: Toast[] = []

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const toast: Toast = { message, type }
    this.toasts.push(toast)

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t !== toast)
    }, duration)
  }
}
