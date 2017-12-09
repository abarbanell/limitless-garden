import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,
HttpTestingController } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { HomeComponent } from './home.component';
import { CollectionsComponent } from '../collections/collections.component';

import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { routing } from '../app.routing';

describe('HomeComponent', () => {
  let app: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HomeComponent,
        CollectionsComponent 
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/' },        
        AuthService,
        DataService
      ],
      imports: [
        HttpClientTestingModule,
        routing
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    app = fixture.componentInstance;
  }));


  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it(`check text in title`, async(() => {
    expect(app.title).toContain('Home Component');
  }));

  it('should render title in a h1 tag', async(() => {
    let authService: AuthService = TestBed.get(AuthService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)
    const req = httpMock.expectOne('/api/me');
    req.flush({user: { profile: { displayName: 'John Doe' }}, rc: 'OK'});
    authService.listen.subscribe(u => {
      expect(u).toBeDefined();
      expect(u.displayName).toBe("John Doe");
      expect(u.rc).toBe("OK");
      expect(u.httpStatus).toBe(200);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.panel-heading').textContent).toContain('Collection');
    })
  }));

  it('should have collectionCount', () => {
    expect(app.collectionCount).toBe(app.collections.length);
  })
});