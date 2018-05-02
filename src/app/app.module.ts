import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './routing/routing.module';
import { AuthguardGuard } from './authguard/authguard.guard';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import {
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    SignupComponent,
    ConfirmComponent
} from './component';
import {
    UserService,
    CognitoService,
    InMemoryDataService
} from './service';
import { GoogleMapComponent } from './component/google-map/google-map.component';
import { ProfileComponent } from './component/profile/profile.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarComponent,
        HomeComponent,
        SignupComponent,
        ConfirmComponent,
        GoogleMapComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        RoutingModule,
        FormsModule,
        HttpClientModule,
        NgbModule.forRoot()
        // HttpClientInMemoryWebApiModule.forRoot(
        //     InMemoryDataService, { dataEncapsulation: false }
        // )
    ],
    providers: [
        UserService,
        CognitoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
