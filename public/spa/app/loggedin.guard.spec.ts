import { TestBed, async, inject } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HomeComponent } from './home/home.component';
import { DataComponent } from './data/data.component';
import { CollectionsComponent } from './collections/collections.component';
import { AuthService } from './auth.service';
import { LoggedinGuard } from './loggedin.guard';
import { routing } from './app.routing';
import { DataServiceResponse } from './data.service';

describe('LoggedinGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        DataComponent,
        CollectionsComponent
      ],
      providers: [
        LoggedinGuard,
        AuthService,
        {provide: APP_BASE_HREF, useValue: '/' }
      ],
      imports: [
        HttpClientTestingModule,
        routing
      ]
    });
  });

  it('should ...', inject([LoggedinGuard], (guard: LoggedinGuard) => {
    expect(guard).toBeTruthy();
  }));
});
