import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,
  HttpTestingController } from '@angular/common/http/testing';
  import { APP_BASE_HREF } from '@angular/common';

import { AuthService, IProfile } from '../auth.service';
import { DataService } from '../data.service';
import { routing } from '../app.routing';

import { DataComponent } from './data.component';
import { HomeComponent } from '../home/home.component';
import { CollectionsComponent } from '../collections/collections.component';

describe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DataComponent,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`check text in title`, async(() => {
    expect(component.title).toContain('Data Component');
  }));
});

