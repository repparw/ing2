import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './registro-empleado/registro-empleado.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';
import { VerMiPerfilComponent } from './ver-mi-perfil/ver-mi-perfil.component';
import { ModificarPerfilComponent } from './modificar-perfil/modificar-perfil.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { CrearPublicacionComponent } from './crear-publicacion/crear-publicacion.component';
import { EditarPublicacionComponent } from './editar-publicacion/editar-publicacion.component';
import { VerPublicacionComponent } from './ver-publicacion/ver-publicacion.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'inicio sesion', component: RegistroComponent},
  {path: 'registrar empleado', component: RegistroEmpleadoComponent},
  {path: 'registrar usuario', component: RegistrarUsuarioComponent},
  {path: 'ver perfil', component: VerPerfilComponent},
  {path: 'ver mi perfil', component: VerMiPerfilComponent},
  {path: 'modificar perfil', component: ModificarPerfilComponent},
  {path: 'crear publi', component: CrearPublicacionComponent},
  {path: 'cambiar contra', component: CambiarContraComponent},
  {path: 'publicacion/:id', component: VerPublicacionComponent},
  {path: 'editar publi', component: EditarPublicacionComponent},
  {path: '**', redirectTo: '/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
