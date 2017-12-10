
import { Router, RouterModule } from '@angular/router';
 
import { HomeComponent } from './home/home.component';
import { DataComponent } from './data/data.component';
import { CollectionsComponent } from './collections/collections.component';

export const routing = RouterModule.forRoot([
  { path: '', component: HomeComponent },
  { path: 'data', component: DataComponent },
  { path: 'collections/:coll', component: CollectionsComponent }
])