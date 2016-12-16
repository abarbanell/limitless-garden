import { Router, RouterModule} from '@angular/router';

// import my components....
import { NotFoundComponent } from './not-found.component';
import { ContactComponent } from './contact.component';

export const routing = RouterModule.forRoot([
    { path: '', component: NotFoundComponent }, 
    { path: 'contact', component: ContactComponent }, 
    { path: '**', component: NotFoundComponent } 
]);