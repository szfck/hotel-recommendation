import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './routing/routing.module';

import { AppComponent } from './app.component';
import { 
    LoginComponent,
    NavbarComponent
} from './component';
import { 
    UserService,
    CognitoService
} from './service';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarComponent
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
