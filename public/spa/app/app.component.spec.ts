import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, 
  HttpTestingController } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

import { AuthService } from './auth.service';
import { routing } from './app.routing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/' },
        AuthService
      ],
      imports: [
        HttpClientTestingModule,
        routing
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    let authService: AuthService = TestBed.get(AuthService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)
    const req = httpMock.expectOne('/api/me');
    req.flush({displayName: 'John Doe', rc: 'OK', httpStatus: 200});
    // set up the processor for the flush below
    authService.initialized.subscribe(v => {
      expect(v).toBe(true);
      expect(authService.user.displayName).toBe("John Doe");
      expect(authService.user.rc).toBe("OK");
      expect(authService.user.httpStatus).toBe(200);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
    })
  }));
});
