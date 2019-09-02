import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {UserDto} from '../domain/user.dto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private email: string;
  private user: UserDto;

  constructor(private activeRoute: ActivatedRoute,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.email = this.activeRoute.snapshot.queryParamMap.get('email');
    this.user = this.userService.findUserByEmail(this.email);
    if (this.email == null
      || this.user === undefined
      || this.user.isAuthenticated !== true) {
      this.router.navigate(['login']);
    }
  }

  logout() {
    this.userService.logout(this.email);
  }
}
