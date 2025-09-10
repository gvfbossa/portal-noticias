import { Injectable } from '@angular/core';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastComp?: ToastComponent;

  register(toastComp: ToastComponent) {
    this.toastComp = toastComp;
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    this.toastComp?.show(message, type);
  }
}
