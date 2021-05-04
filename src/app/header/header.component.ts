import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isLogin = false;
  public links = [
    { title: 'Home', fragment: '' },
    { title: 'Login', fragment: 'login' },
    { title: 'Signup', fragment: 'signup' }
  ];

  constructor(public route: ActivatedRoute, private router: Router, private authService: AuthService) { }  

  ngOnInit(): void {
    this.authService._isLogin.subscribe(value => {
      this.isLogin = value;

      if(value) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
