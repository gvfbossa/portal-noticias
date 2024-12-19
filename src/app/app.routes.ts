import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { MainComponent } from './main/main.component';
import { NoticiaComponent } from './components/noticia/noticia.component'; 
import { SobreComponent } from './components/sobre/sobre.component';
import { NoticiaCategoriaComponent } from './components/noticia-categoria/noticia-categoria.component';
import { GerenciarNoticiasComponent } from './components/gerenciar-noticias/gerenciar-noticias.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'noticia/:id', component: NoticiaComponent },
    { path: 'sobre', component: SobreComponent },
    { path: 'noticia-categoria/:type', component: NoticiaCategoriaComponent },
    { path: 'login', component: LoginComponent },
    { path: 'gerenciar-noticias', component: GerenciarNoticiasComponent, canActivate: [AuthGuard] },
];