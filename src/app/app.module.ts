import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { ThumbnailDestaqueComponent } from './components/thumbnail-destaque/thumbnail-destaque.component';
import { ThumbnailNoticiaComponent } from './components/thumbnail-noticia/thumbnail-noticia.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { FooterComponent } from './footer/footer.component';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    
  ],
  imports: [
    AppComponent,    
    BrowserModule,
    RouterModule.forRoot(routes),
    HeaderComponent,
    MainComponent,
    ThumbnailDestaqueComponent,
    ThumbnailNoticiaComponent,
    SobreComponent,
    FooterComponent
  ],
  exports: [RouterModule],
  providers: [provideHttpClient()],
  bootstrap: []
})
export class AppModule { }
