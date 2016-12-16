import { Router, RouterModule} from '@angular/router';

// import my components....
import { NotFoundComponent } from './not-found.component';

export const routing = RouterModule.forRoot([
    { path: '', component: NotFoundComponent }, 
    { path: 'contact', component: NotFoundComponent }, 
    { path: '**', component: NotFoundComponent } 
]);