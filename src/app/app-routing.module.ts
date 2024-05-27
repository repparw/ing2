import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CambiarContraComponent } from './components/cambiar-contra/cambiar-contra.component';
import { CambiarContraPerfilComponent } from './components/cambiar-contra-perfil/cambiar-contra-perfil.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { EditarPublicacionComponent } from './components/editar-publicacion/editar-publicacion.component';
import { HomeComponent } from './components/home/home.component';
import { ListarPublicacionesTasarComponent } from './components/listar-publicaciones-tasar/listar-publicaciones-tasar.component';
import { ListarSucursalesComponent } from './components/listar-sucursales/listar-sucursales.component';
import { ModificarPerfilComponent } from './components/modificar-perfil/modificar-perfil.component';
import { ProponerTruequeComponent } from './components/proponer-trueque/proponer-trueque.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { RegistroComponent } from './components/Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './components/registro-empleado/registro-empleado.component';
import { TasarPublicacionComponent } from './components/tasar-publicacion/tasar-publicacion.component';
import { VerMiPerfilComponent } from './components/ver-mi-perfil/ver-mi-perfil.component';
import { VerPerfilComponent } from './components/ver-perfil/ver-perfil.component';
import { VerPublicacionComponent } from './components/ver-publicacion/ver-publicacion.component';

import { AuthGuard } from './guards/auth.guard';
import { EmployeeGuard } from './guards/employee.guard';
import { AdEmailComponent } from './components/ad-email/ad-email.component';

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
  { path: 'publicacion/:id/proponer', component: ProponerTruequeComponent, canActivate: [AuthGuard] },
  { path: 'publicacion/:id/tasar', component: TasarPublicacionComponent, canActivate: [EmployeeGuard] },
  { path: 'ad-email', component: AdEmailComponent, canActivate: [EmployeeGuard]},
  { path: 'publicacion/:id/editar', component: EditarPublicacionComponent, canActivate: [AuthGuard] },
  { path: 'sucursales', component: ListarSucursalesComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
