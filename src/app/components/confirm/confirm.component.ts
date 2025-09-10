import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmDialogComponent {
  message: string = 'Deseja realmente continuar?';
  visible: boolean = false;

  private resolve!: (value: boolean) => void;

  async confirm(message: string): Promise<boolean> {
    this.message = message;
    this.visible = true;
    await new Promise(resolve => setTimeout(resolve, 0));

    return new Promise<boolean>(res => {
      this.resolve = res;
    });
  }


  onConfirm() {
    this.visible = false; 
    this.resolve(true);
  }

  onCancel() {
    this.visible = false;
    this.resolve(false);
  }
}
