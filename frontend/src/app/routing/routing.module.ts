import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from '../authguard/authguard.guard';
import { 
    LoginComponent,
    SignupComponent,
    ConfirmComponent,
    HomeComponent,
    ProfileComponent
} from '../component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'confirm/:username',
        component: ConfirmComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthguardGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthguardGuard]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)],
    providers: [AuthguardGuard]
})
export class RoutingModule { }
