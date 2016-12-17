import { Component, OnInit } from '@angular/core';
import { ContactService } from './contact.service';

@Component({
    template: `
        <div class="alert alert-info" *ngIf="!isLoading">
            Home Component loaded.
        </div>
        <div *ngIf="isLoading">
            <i class="fa fa-spinner fa-spin fa-3x"></i>
        </div>
        <div  *ngIf="!isLoading">
            <h2> {{ contact.title }} </h2>
            <p> {{ contact.text }} </p>
            <p> 
                <a href="{{ contact.repoUrl }}"> 
                    {{ contact.repoUrl }} 
                </a>
            </p>

    `,
    providers: [ ContactService ]
})
export class HomeComponent implements OnInit {
    isLoading = true; 
    contact;

    constructor(private _contactService: ContactService) {

    }
    ngOnInit() {
        this._contactService.getContact()
            .subscribe( c => {
                this.contact = c;
                this.isLoading = false;
            });
    }
}