import { TestBed, async, inject } from '@angular/core/testing';

import { AuthService, IProfile, Profile } from './auth.service';
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

  it('new Profile()', () => {
    let p = new Profile();
    expect(p.displayName).toBe("I. N. Itializing");
    expect(p.httpStatus).toBe(503);
    expect(p.rc).toBe("INITIALIZING");
  });

  it('Profile returns INITIALIZING then Forbidden', async(() => {
    let authService: AuthService = TestBed.get(AuthService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)
    let counter = 0

    const req = httpMock.expectOne('/api/me');
    expect(req.request.method).toEqual('GET');

    authService.listen.subscribe(u => {
      if (counter == 0) {
        // process the values from BEFORE flush below
        expect(u).toBeDefined();
        expect(u.displayName).toBe("I. N. Itializing");
        expect(u.rc).toBe("INITIALIZING");
        expect(u.httpStatus).toBe(503);
        // now we send our message 
        counter++ 
        req.flush({user: { profile: { displayName: "" }}, rc: 'Forbidden'});
      } else {
        expect(counter).toBe(1);
        expect(u).toBeDefined();
        expect(u.displayName).toBe("");
        expect(u.rc).toBe("Forbidden");
        expect(u.httpStatus).toBe(403);
      }
    }, e=> { 
      expect("this").toBe("should not be reached");
    })

    httpMock.verify();
  }))


  it('Profile returns INITIALIZING then OK', async(() => {
    let authService: AuthService = TestBed.get(AuthService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)
    let counter = 0
    let response =
    { 
      "rc": "OK", 
      "user": { 
        "profile": { 
          "provider": "google", 
          "id": "108868518694572490019", 
          "displayName": "Tobias Abarbanell", 
          "name": { 
            "familyName": "Abarbanell", 
            "givenName": "Tobias" }, 
            "photos": [{ 
              "value": "https://lh3.googleusercontent.com/-4ehModKBaic/AAAAAAAAAAI/AAAAAAAAEwg/BKwS86_O2nE/photo.jpg?sz=50" 
            }], 
            "gender": "other", 
            "_raw": "{\n \"kind\": \"plus#person\",\n \"etag\": \"\\\"ucaTEV-ZanNH5M3SCxYRM0QRw2Y/KdX5BhkMHnR2_mAhnY7YLmkz8Rc\\\"\",\n \"gender\": \"other\",\n \"objectType\": \"person\",\n \"id\": \"108868518694572490019\",\n \"displayName\": \"Tobias Abarbanell\",\n \"name\": {\n  \"familyName\": \"Abarbanell\",\n  \"givenName\": \"Tobias\"\n },\n \"url\": \"https://plus.google.com/108868518694572490019\",\n \"image\": {\n  \"url\": \"https://lh3.googleusercontent.com/-4ehModKBaic/AAAAAAAAAAI/AAAAAAAAEwg/BKwS86_O2nE/photo.jpg?sz=50\",\n  \"isDefault\": false\n },\n \"isPlusUser\": true,\n \"language\": \"en\",\n \"ageRange\": {\n  \"min\": 21\n },\n \"circledByCount\": 57,\n \"verified\": false\n}\n", 
            "_json": { 
              "kind": "plus#person", 
              "etag": "\"ucaTEV-ZanNH5M3SCxYRM0QRw2Y/KdX5BhkMHnR2_mAhnY7YLmkz8Rc\"", 
              "gender": "other", 
              "objectType": "person", 
              "id": "108868518694572490019", 
              "displayName": "Tobias Abarbanell", 
              "name": { 
                "familyName": "Abarbanell", 
                "givenName": "Tobias" 
              }, 
              "url": "https://plus.google.com/108868518694572490019", 
              "image": { 
                "url": "https://lh3.googleusercontent.com/-4ehModKBaic/AAAAAAAAAAI/AAAAAAAAEwg/BKwS86_O2nE/photo.jpg?sz=50", 
                "isDefault": false 
              }, 
              "isPlusUser": true, 
              "language": "en", 
              "ageRange": { 
                "min": 21 
              }, 
              "circledByCount": 57, 
              "verified": false 
            } 
          }, 
          "_id": "5a27a4492613d8000837d05b", 
          "admin": true 
        } 
      }

    const req = httpMock.expectOne('/api/me');
    expect(req.request.method).toEqual('GET');

    authService.listen.subscribe(u => {
      if (counter == 0) {
        // process the values from BEFORE flush below
        expect(u).toBeDefined();
        expect(u.displayName).toBe("I. N. Itializing");
        expect(u.rc).toBe("INITIALIZING");
        expect(u.httpStatus).toBe(503);
        // now we send our message 
        counter++ 
        req.flush(response);
      } else {
        expect(counter).toBe(1);
        expect(u).toBeDefined();
        expect(u.displayName).toBe("Tobias Abarbanell");
        expect(u.rc).toBe("OK");
        expect(u.httpStatus).toBe(200);
      }
    }, e=> { 
      expect("this").toBe("should not be reached");
    })

    httpMock.verify();
  }))
});
