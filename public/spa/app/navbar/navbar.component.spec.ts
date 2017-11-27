import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { NavbarComponent } from './navbar.component';
import { HomeComponent } from '../home/home.component';

import { AuthService } from '../auth.service';
import { routing } from '../app.routing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        NavbarComponent,
        HomeComponent
      ],
      providers: [ 
        {provide: APP_BASE_HREF, useValue: '/' },
        AuthService
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        routing
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});