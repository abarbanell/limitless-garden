import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,
HttpTestingController } from '@angular/common/http/testing';

import { HomeComponent } from './home.component';

import { AuthService } from '../auth.service';

describe('HomeComponent', () => {
  // let component: HomeComponent;
  // let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HomeComponent 
      ],
      providers: [
        AuthService
      ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));


  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`check text in title`, async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toContain('Spa app for Angular 5');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
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
      expect(compiled.querySelector('h1').textContent).toContain('Spa app for Angular 5');
    })
  }));
});