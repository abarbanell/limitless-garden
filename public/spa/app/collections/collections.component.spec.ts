import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,
  HttpTestingController } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { HomeComponent } from '../home/home.component';
import { CollectionsComponent } from './collections.component';

import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { routing } from '../app.routing';
import { DataComponent } from '../data/data.component';

describe('CollectionsComponent', () => {
  let component: CollectionsComponent;
  let fixture: ComponentFixture<CollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HomeComponent,
        CollectionsComponent,
        DataComponent 
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial data', () => {
    expect(component.data).toBeDefined();
    expect(component.data.count).toBeGreaterThanOrEqual(component.data.rows.length);
  });

  it('onDelete returns ok', () => {
    expect(component.data).toBeDefined();
    let id = "12345678901234567891234";
    component.colName = "test";

    let service = TestBed.get(DataService);
    let httpMock: HttpTestingController = TestBed.get(HttpTestingController)
 
    component.onDelete(id);

    const req = httpMock.expectOne('/api/collections/test/' + id);
    expect(req.request.method).toEqual('DELETE');
    req.flush({
      ok: 1,
      n: 1
    })

    // we still have open requests here...
    // httpMock.verify();
    expect(component.infoMsg).toContain(id);
  })
});
