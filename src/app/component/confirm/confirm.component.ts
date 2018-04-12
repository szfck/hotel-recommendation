import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../service';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
    code: string;
    username: string;
    constructor(
        private userSerivice: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.username = this.route.snapshot.paramMap.get('username');
    }

    confirm() {
        console.log(`code: ${this.code}`);
        this.userSerivice.confirm(this.code, this.username, this.router);
    }

    resend() {
        this.userSerivice.resend(this.username);
    }

}
