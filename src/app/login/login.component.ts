import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
    password: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, public authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  proceedLogin() {
    if(this.loginForm.valid){
      const details = JSON.stringify(this.loginForm.value);

      this.authService.login(details).subscribe((res: any) => {
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
