import { Injectable } from '@angular/core'; 

@Injectable()
export class AuthService {
  isLoggedin = false;
  userName: string;
}