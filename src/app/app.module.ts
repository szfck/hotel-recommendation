import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './routing/routing.module';
import { AuthguardGuard } from './authguard/authguard.guard';
import { AppComponent } from './app.component';

import { 
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    SignupComponent,
    ConfirmComponent
} from './component';
import { 
    UserService,
    CognitoService
} from './service';
import { GoogleMapComponent } from './component/google-map/google-map.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarComponent,
        HomeComponent,
        SignupComponent,
        ConfirmComponent,
        GoogleMapComponent
    ],
    imports: [
        BrowserModule,
        RoutingModule,
        FormsModule
    ],
    providers: [
        UserService,
        CognitoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
