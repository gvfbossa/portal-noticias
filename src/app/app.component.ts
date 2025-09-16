import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { AddBannerComponent } from './components/add-banner/add-banner.component';
import { ToastComponent } from "./components/toast/toast.component";
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    AddBannerComponent,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'portal-noticias-frontend';

  @ViewChild('toastComp') toastComp!: ToastComponent;

  constructor(private toastService: ToastService) { }

  ngAfterViewInit() {
    this.toastService.register(this.toastComp);
  }
}
