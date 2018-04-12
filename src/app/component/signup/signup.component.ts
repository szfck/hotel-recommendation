import { Component, OnInit } from '@angular/core';
import { User } from '../../constant';
import { UserService } from '../../service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    user: User = {
        username: 'zjck1995',
        password: 'Aa123456',
        email: 'kchen9530@gmail.com'
    };
    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    signup() {
        console.log(this.user);

        this.userService.signup(this.user, this.router);
    }

}
