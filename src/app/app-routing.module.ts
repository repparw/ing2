import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './registro-empleado/registro-empleado.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'registrar', component: RegistroComponent},
  {path: 'registrar empleado', component: RegistroEmpleadoComponent},
  {path: 'ver perfil', component: VerPerfilComponent},
  {path: 'cambiar contra', component: CambiarContraComponent},
  {path: '**', redirectTo: '/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
