import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'registrar', component: RegistroComponent},
  {path: 'ver perfil', component: VerPerfilComponent},
  {path: '**', redirectTo: '/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
