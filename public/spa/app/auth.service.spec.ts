import { TestBed, async, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        AuthService
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should be authenticated', inject([AuthService], (service: AuthService) => {
    expect(service.authenticated()).toBe(true);
  }));

  xit('should get Profile', async(() => {
    let authService = TestBed.get(AuthService);
    authService.getProfile().subscribe(user => {
      expect(user).toBeNull();      
    })
  }))
});
