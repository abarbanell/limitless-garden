import { TestBed, async, inject } from '@angular/core/testing';

import { AuthService, IProfile } from './auth.service';
import { HttpClientTestingModule, 
         HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('authenticated', inject([AuthService], (service: AuthService) => {
    expect(service.authenticated()).toBe(true);
  }));

  it('Profile/not logged in returns FORBIDDEN', async(() => {
    let authService: AuthService = TestBed.get(AuthService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)

    const req = httpMock.expectOne('/api/me');
    expect(req.request.method).toEqual('GET');

    req.flush({displayName: '', rc: 'Forbidden', httpStatus: 403});
    
    // process the values from flush below
    authService.initialized.subscribe(v => {
      expect(v).toBe(true);
      expect(authService.user.displayName).toBe("");
      expect(authService.user.rc).toBe("Forbidden");
      expect(authService.user.httpStatus).toBe(403);
    })

    

    httpMock.verify();
  }))

  it('Profile/ logged in returns OK', async(() => {
    let authService: AuthService = TestBed.get(AuthService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)

    const req = httpMock.expectOne('/api/me');
    expect(req.request.method).toEqual('GET');
    
    req.flush({displayName: 'John Doe', rc: 'OK', httpStatus: 200});
    
    // set up the processor for the flush below
    authService.initialized.subscribe(v => {
      expect(v).toBe(true);
      expect(authService.user.displayName).toBe("John Doe");
      expect(authService.user.rc).toBe("OK");
      expect(authService.user.httpStatus).toBe(200);
    })


    httpMock.verify();
  }))
});
