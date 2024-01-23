import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false
  private authStatusSub!: Subscription;
constructor(private authService: AuthService){}

ngOnInit(): void {
  this.authStatusSub = this.authService.getAuthStatusLIstener().subscribe(
     authStatus => {
       this.isLoading = authStatus
     }
  )
}

  onLogin(form: NgForm){
    this.isLoading = true
    console.log(form.value)
    if(form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
