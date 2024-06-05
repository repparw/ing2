import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CambiarContraComponent } from './components/cambiar-contra/cambiar-contra.component';
import { CambiarContraPerfilComponent } from './components/cambiar-contra-perfil/cambiar-contra-perfil.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { EditarPublicacionComponent } from './components/editar-publicacion/editar-publicacion.component';
import { HomeComponent } from './components/home/home.component';
import { ListarPublicacionesTasarComponent } from './components/listar-publicaciones-tasar/listar-publicaciones-tasar.component';
import { ListarSucursalesComponent } from './components/listar-sucursales/listar-sucursales.component';
import { ListarOfertasRecibidasComponent } from './components/listar-ofertas-recibidas/listar-ofertas-recibidas.component';
import { ModificarPerfilComponent } from './components/modificar-perfil/modificar-perfil.component';
import { ProponerTruequeComponent } from './components/proponer-trueque/proponer-trueque.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { RegistroComponent } from './components/Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './components/registro-empleado/registro-empleado.component';
import { TasarPublicacionComponent } from './components/tasar-publicacion/tasar-publicacion.component';
import { VerMiPerfilComponent } from './components/ver-mi-perfil/ver-mi-perfil.component';
import { VerPerfilComponent } from './components/ver-perfil/ver-perfil.component';
import { VerPublicacionComponent } from './components/ver-publicacion/ver-publicacion.component';
import { ResponderTruequeComponent } from './components/responder-trueque/responder-trueque.component';
import { AgregarFechaComponent } from './components/agregar-fecha/agregar-fecha.component';
import { ListarTruequesEmpleadoComponent } from './components/listar-trueques-empleado/listar-trueques-empleado.component';

import { AuthGuard } from './guards/auth.guard';
import { EmployeeGuard } from './guards/employee.guard';
import { AdminGuard } from './guards/admin.guard';

import { AdEmailComponent } from './components/ad-email/ad-email.component';
import { CrearSucursalComponent } from './components/crear-sucursal/crear-sucursal.component';
import { ReestablecerContraComponent } from './components/reestablecer-contra/reestablecer-contra.component';
import { EnviarDescuentoComponent } from './components/enviar-descuento/enviar-descuento.component';
import { VerificarCodigoComponent } from './components/verificar-codigo/verificar-codigo.component';
import { CargarVentaComponent } from './components/cargar-venta/cargar-venta.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: RegistroComponent },
  { path: 'registrar-empleado', component: RegistroEmpleadoComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'usuarios/:username', component: VerPerfilComponent },
  { path: 'ver-mi-perfil', component: VerMiPerfilComponent, canActivate: [AuthGuard] },
  { path: 'modificar-perfil', component: ModificarPerfilComponent, canActivate: [AuthGuard] },
  { path: 'crear-publicacion', component: CrearPublicacionComponent, canActivate: [AuthGuard] },
  { path: 'reestablecer-contra', component: ReestablecerContraComponent },
  { path: 'cambiar-contra', component: CambiarContraComponent },
  { path: 'cambiar-contra-perfil', component: CambiarContraPerfilComponent, canActivate: [AuthGuard] },
  { path: 'publicacion/:id', component: VerPublicacionComponent },
  { path: 'tasar-publicaciones', component: ListarPublicacionesTasarComponent, canActivate: [EmployeeGuard] },
  { path: 'publicacion/:id/proponer', component: ProponerTruequeComponent, canActivate: [AuthGuard] },
  { path: 'publicacion/:id/tasar', component: TasarPublicacionComponent, canActivate: [EmployeeGuard] },
  { path: 'ad-email', component: AdEmailComponent, canActivate: [EmployeeGuard]},
  { path: 'enviar-descuento', component: EnviarDescuentoComponent, canActivate: [EmployeeGuard]},
  { path: 'verificar-codigo', component: VerificarCodigoComponent, canActivate: [EmployeeGuard]},
  { path: 'publicacion/:id/editar', component: EditarPublicacionComponent, canActivate: [AuthGuard] },
  { path: 'sucursales', component: ListarSucursalesComponent },
  { path: 'trueques-recibidos', component: ListarOfertasRecibidasComponent},
  { path: 'trueque/:id', component: ResponderTruequeComponent},
  { path: 'agregar-fecha/:id', component: AgregarFechaComponent},
  { path: 'crear-sucursal', component: CrearSucursalComponent}, // canActivate: [AdminGuard] TODO
  { path: 'trueque/:id/cargar-venta', component: CargarVentaComponent},
  { path: 'trueques-empleado', component: ListarTruequesEmpleadoComponent},
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
