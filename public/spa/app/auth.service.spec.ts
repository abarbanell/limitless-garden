import { TestBed, async, inject } from '@angular/core/testing';

import { AuthService, IProfile } from './auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

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
    authService.getProfile().subscribe(user => {
      // check the response...
      expect(user.httpStatus).toBe(403);
      expect(user.rc).toBe("Forbidden");
      expect(user.displayName).toBe(""); // temporary, while we have no "real" authentication      
    }, err => {
      expect(err).toBe("error"); // should not get here, so it will fail if it is executed
    })
  }))
});
