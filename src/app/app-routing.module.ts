import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './registro-empleado/registro-empleado.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';
import { VerMiPerfilComponent } from './ver-mi-perfil/ver-mi-perfil.component';
import { ModificarPerfilComponent } from './modificar-perfil/modificar-perfil.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { CambiarContraPerfilComponent } from './cambiar-contra-perfil/cambiar-contra-perfil.component';
import { CrearPublicacionComponent } from './crear-publicacion/crear-publicacion.component';
import { EditarPublicacionComponent } from './editar-publicacion/editar-publicacion.component';
import { VerPublicacionComponent } from './ver-publicacion/ver-publicacion.component';
import { ListarPublicacionesTasarComponent } from './listar-publicaciones-tasar/listar-publicaciones-tasar.component';
import { TasarPublicacionComponent } from './tasar-publicacion/tasar-publicacion.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { EmployeeGuard } from './guards/employee.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: RegistroComponent },
  { path: 'registrar-empleado', component: RegistroEmpleadoComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'usuarios/:username', component: VerPerfilComponent },
  { path: 'ver-mi-perfil', component: VerMiPerfilComponent, canActivate: [AuthGuard] },
  { path: 'modificar-perfil', component: ModificarPerfilComponent, canActivate: [AuthGuard] },
  { path: 'crear-publicacion', component: CrearPublicacionComponent, canActivate: [AuthGuard] },
  { path: 'cambiar-contra', component: CambiarContraComponent },
  { path: 'cambiar-contra-perfil', component: CambiarContraPerfilComponent, canActivate: [AuthGuard] },
  { path: 'publicacion/:id', component: VerPublicacionComponent },
  { path: 'tasar-publicaciones', component: ListarPublicacionesTasarComponent, canActivate: [EmployeeGuard] },
  { path: 'publicacion/:id/tasar', component: TasarPublicacionComponent },//, canActivate: [EmployeeGuard] },
  { path: 'publicacion/:id/editar', component: EditarPublicacionComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
