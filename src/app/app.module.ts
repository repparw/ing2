import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './Iniciar-sesion/registro.component';
import { RegistroEmpleadoComponent } from './registro-empleado/registro-empleado.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { CrearPublicacionComponent } from './crear-publicacion/crear-publicacion.component';
import { VerPublicacionComponent } from './ver-publicacion/ver-publicacion.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { VerMiPerfilComponent } from './ver-mi-perfil/ver-mi-perfil.component';
import { ModificarPerfilComponent } from './modificar-perfil/modificar-perfil.component';
import { EditarPublicacionComponent } from './editar-publicacion/editar-publicacion.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CambiarContraPerfilComponent } from './cambiar-contra-perfil/cambiar-contra-perfil.component';
import { ListarPublicacionesComponent } from './listar-publicaciones/listar-publicaciones.component';
import { TasarPublicacionComponent } from './tasar-publicacion/tasar-publicacion.component';
import { ListarPublicacionesTasarComponent } from './listar-publicaciones-tasar/listar-publicaciones-tasar.component';


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
