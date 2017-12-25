import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, 
  HttpTestingController } from '@angular/common/http/testing';

import { DataService } from './data.service';
import { HttpHeaders } from '@angular/common/http';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        DataService
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it("should return collection list", async(() => {
    let service = TestBed.get(DataService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)
 
    service.getCollections().subscribe(data => {
      // reched only after the request is flushed (below)
      expect(data.length).toBe(3);      
    },
    err => {
      expect("this").toBe("should not be reached");
    })

    const req = httpMock.expectOne('/api/collections');
    expect(req.request.method).toEqual('GET');
    req.flush(["table1", "table2", "table3"])

    httpMock.verify();
  }));

  it("should return collection data", async(() => {
    let service = TestBed.get(DataService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)
 
    service.getCollectionData("test").subscribe(data => {
      // reched only after the request is flushed (below)
      // expect(data).toBe(JSON.stringify(data));
      expect(data.rows.length).toBe(3);
      expect(data.count).toBe(17)      
    },
    err => {
      expect("this").toBe("should not be reached");
    })

    const req = httpMock.expectOne('/api/collections/test?filldate=1');
    expect(req.request.method).toEqual('GET');
    
    req.flush([ {
      _id: "5a339c27328a1b2cb3442f6e",
      date: "2017-10-17",
      json: '{"_id":"5a339c27328a1b2cb3442f6e","field":"content"}'
    }, {
      _id: "5a339c27328a1b2cb3442f6f",
      date: "2017-10-17",
      json: '{"_id":"5a339c27328a1b2cb3442f6f","field":"content"}'
    }, {
      _id: "5a339c27328a1b2cb3442f6g",
      date: "2017-10-17",
      json: '{"_id":"5a339c27328a1b2cb3442f6g","field":"content"}'
    }], {
      headers: new HttpHeaders({"X-Total-Count":  "17"})
    });

    httpMock.verify();
  }));

});
