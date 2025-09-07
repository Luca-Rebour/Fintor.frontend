import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SignInModel } from '../../shared/models/signin.model';
import { SignUpModel } from '../../shared/models/signun.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  


  constructor(private http: HttpClient) { }

  signIn(signinData: SignInModel): Observable<any> {    
    
    return this.http.post(`${this.apiUrl}/auth/sign-in`, signinData).pipe(
      tap((response) => {
        console.log('Sign-in successful', response);
        // Aquí podrías guardar el token, etc.
      })
    );
  }

  signUp(signupData: SignUpModel): Observable<any> {

    console.log('signupData', signupData);
    
    
    return this.http.post(`${this.apiUrl}/users/create-user`, signupData).pipe(
      tap((response) => {
        console.log('Sign-up successful', response);
        // Aquí podrías manejar la respuesta exitosa
      })
    );
  }


}
