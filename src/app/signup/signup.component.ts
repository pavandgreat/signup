import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm = this.fb.group({
    name: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Z]+$/i)])],
    phone: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{10}$/i)])],
    email: ['', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
    password: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, public authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register() {
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.controls[key].markAsDirty();
     });

    if(this.signupForm.valid){
      const details = JSON.stringify(this.signupForm.value);
      
      this.authService.signup(details).subscribe((res: any) => {
        if(res.status == 'success') {
          this.authService.storeCurrentUser(res.user);
          this.authService._isLogin.next(true);
          this.toastr.success('successfull login');
        } else {
          this.authService._isLogin.next(false);
          this.toastr.error(res.message);
        }
      });
    }
  }
}
