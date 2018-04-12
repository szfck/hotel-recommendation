import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    logout() {
        this.userService.logout();
        console.log(`user login : ${this.userService.getUserLoggedIn()}`);

        if (!this.userService.getUserLoggedIn()) {
            window.alert("Logout Success!");
            this.router.navigate(['/login']);
        } else {
            window.alert("Logout Fail, Try Again!");
        }
    }

    isLoggedIn(): boolean {
        return this.userService.getUserLoggedIn();
    }

}
