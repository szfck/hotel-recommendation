import { Component, OnInit } from '@angular/core';
import { User } from '../../constant';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    user: User = {
        username: 'zjck1995',
        password: 'Aa123456',
        email: 'kchen9530@gmail.com'
    };
    
    constructor() { }

    ngOnInit() {
    }
    
    login() {

    }
}
