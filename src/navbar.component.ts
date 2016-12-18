import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.component.html', 
    providers: [ AuthService ]
    
})
export class NavbarComponent implements OnInit {
    userName;

    constructor(private _authService : AuthService){
    }

    ngOnInit() {
        if (this._authService.isLoggedin) {
                this.userName = this._authService.userName;
        } else { 
            this.userName = "<None>";
        }
    }

}