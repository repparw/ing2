import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './components/registro-empleado/registro-empleado.component';
import { VerPerfilComponent } from './components/ver-perfil/ver-perfil.component';
import { CambiarContraComponent } from './components/cambiar-contra/cambiar-contra.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { VerPublicacionComponent } from './components/ver-publicacion/ver-publicacion.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
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
    })
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
