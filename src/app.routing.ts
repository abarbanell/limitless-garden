import { Router, RouterModule} from '@angular/router';

// import my components....
import { NotFoundComponent } from './not-found.component';
import { ContactComponent } from './contact.component';
import { HomeComponent } from './home.component';

export const routing = RouterModule.forRoot([
    { path: 'app', component: HomeComponent }, 
    { path: 'app/contact', component: ContactComponent }, 
    { path: '**', component: NotFoundComponent } 
]);