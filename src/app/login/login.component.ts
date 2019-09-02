import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDto} from '../domain/user.dto';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private user: UserDto;
  private email: string;
  private password: string;
  private userDoesntExist: boolean;
  private passwordsEqual = true;


  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService) {

  }

  ngOnInit() {
    this.userService.logoutAllUsers();
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    for (const inner in this.loginForm.controls) {
      this.loginForm.get(inner).markAsDirty();
      this.loginForm.get(inner).markAsTouched();
    }
    if (this.loginForm.invalid) {
      return;
    }
    this.email = this.loginForm.controls[`email`].value;
    this.password = this.loginForm.controls[`password`].value;
    this.user = this.userService.findUserByEmail(this.email);
    if (this.user === null || this.userService.checkIfUserExists(this.email)) {
      this.userDoesntExist = true;
      return;
    } else {
      this.userDoesntExist = false;
    }
    this.passwordsEqual = this.checkPasswords(this.password, this.user);
    if (!this.passwordsEqual) {
      return;
    }

    this.userService.login(this.email);
  }

  checkPasswords(password: string, user: UserDto): boolean {
    return password === user.password;
  }

  back() {
    this.router.navigate(['home']);
  }
}

