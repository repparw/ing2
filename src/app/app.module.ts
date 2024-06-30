import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './components/registro-empleado/registro-empleado.component';
import { VerPerfilComponent } from './components/ver-perfil/ver-perfil.component';
import { CambiarContraComponent } from './components/cambiar-contra/cambiar-contra.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { VerPublicacionComponent } from './components/ver-publicacion/ver-publicacion.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { VerMiPerfilComponent } from './components/ver-mi-perfil/ver-mi-perfil.component';
import { ModificarPerfilComponent } from './components/modificar-perfil/modificar-perfil.component';
import { EditarPublicacionComponent } from './components/editar-publicacion/editar-publicacion.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CambiarContraPerfilComponent } from './components/cambiar-contra-perfil/cambiar-contra-perfil.component';
import { ListarPublicacionesComponent } from './components/listar-publicaciones/listar-publicaciones.component';
import { TasarPublicacionComponent } from './components/tasar-publicacion/tasar-publicacion.component';
import { ListarPublicacionesTasarComponent } from './components/listar-publicaciones-tasar/listar-publicaciones-tasar.component';
import { ListarSucursalesComponent } from './components/listar-sucursales/listar-sucursales.component';
import { ProponerTruequeComponent } from './components/proponer-trueque/proponer-trueque.component';
import { AdEmailComponent } from './components/ad-email/ad-email.component';

import { from } from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';
import { CrearSucursalComponent } from './components/crear-sucursal/crear-sucursal.component';
import { ReestablecerContraComponent } from './components/reestablecer-contra/reestablecer-contra.component';
import { EnviarDescuentoComponent } from './components/enviar-descuento/enviar-descuento.component';
import { ListarOfertasRecibidasComponent } from './components/listar-ofertas-recibidas/listar-ofertas-recibidas.component';
import { ListarTruequesComponent } from './components/listar-trueques/listar-trueques.component';
import { ResponderTruequeComponent } from './components/responder-trueque/responder-trueque.component';
import { VerificarCodigoComponent } from './components/verificar-codigo/verificar-codigo.component';
import { CargarVentaComponent } from './components/cargar-venta/cargar-venta.component';
import { AgregarFechaComponent } from './components/agregar-fecha/agregar-fecha.component';
import { ListarTruequesEmpleadoComponent } from './components/listar-trueques-empleado/listar-trueques-empleado.component';
import { ConcretarTruequeComponent } from './components/concretar-trueque/concretar-trueque.component';
import { EstadisticasGlobalesComponent } from './components/estadisticas-globales/estadisticas-globales.component';
import { VerSucursalComponent } from './components/ver-sucursal/ver-sucursal.component';
import { ModificarBannersComponent } from './components/modificar-banners/modificar-banners.component';
import { CrearComentarioComponent } from './components/crear-comentario/CrearComentarioComponent';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistroComponent,
    VerPerfilComponent,
    CambiarContraComponent,
    RegistroEmpleadoComponent,
    CrearPublicacionComponent,
    VerPublicacionComponent,
    VerMiPerfilComponent,
    ModificarPerfilComponent,
    EditarPublicacionComponent,
    RegistrarUsuarioComponent,
    CambiarContraPerfilComponent,
    ListarPublicacionesComponent,
    TasarPublicacionComponent,
    ListarPublicacionesTasarComponent,
    ListarSucursalesComponent,
    ProponerTruequeComponent,
    AdEmailComponent,
    CrearSucursalComponent,
    ReestablecerContraComponent,
    EnviarDescuentoComponent,
    ListarOfertasRecibidasComponent,
    ListarTruequesComponent,
    ResponderTruequeComponent,
    VerificarCodigoComponent,
    CargarVentaComponent,
    AgregarFechaComponent,
    ListarTruequesEmpleadoComponent,
    ConcretarTruequeComponent,
    EstadisticasGlobalesComponent,
    VerSucursalComponent,
    ModificarBannersComponent,
    CrearComentarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileUploadModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    GoogleMapsModule,
    FormsModule
  ],
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      HttpClientXsrfModule.withOptions({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken',
      }),
    )
  ],
  bootstrap: [AppComponent],
})


export class AppModule { }
