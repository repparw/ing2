import { NgModule } from '@angular/core';
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
import { HttpClientModule} from '@angular/common/http';
import { VerMiPerfilComponent } from './ver-mi-perfil/ver-mi-perfil.component';
import { ModificarPerfilComponent } from './modificar-perfil/modificar-perfil.component';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
