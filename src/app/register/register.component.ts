import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDto} from '../domain/user.dto';
import {LocalStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private signUpForm: FormGroup;
  private userDto: UserDto;
  private passwordMismatch: boolean;
  private userAlreadyExists: boolean;
  private users: UserDto[];
  private email: string;


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.userService.logoutAllUsers();
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.max(25), Validators.min(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.max(25), Validators.min(3)]],
      repeatPassword: ['', [Validators.required, Validators.max(25), Validators.min(3)]]
    });
  }


  signUp() {
    this.users = this.userService.getAllUsers();
    if (this.users == null) {
      this.users = [];
    }
    this.email = this.signUpForm.controls[`email`].value;

    for (const inner in this.signUpForm.controls) {
      this.signUpForm.get(inner).markAsDirty();
      this.signUpForm.get(inner).markAsTouched();
    }
    if (this.signUpForm.invalid || this.checkPasswords() || this.checkIfUserExists(this.users)) {
      return;
    }

    this.saveUser(this.users);
  }


  checkPasswords(): boolean {
    const pass1 = this.signUpForm.controls[`password`].value;
    const pass2 = this.signUpForm.controls[`repeatPassword`].value;
    pass1 !== pass2 ? this.passwordMismatch = true : this.passwordMismatch = false;
    return this.passwordMismatch;
  }

  checkIfUserExists(usersArray): boolean {
    const email = this.signUpForm.controls[`email`].value;
    const user = usersArray.find(k => k.email === email);
    user === undefined ? this.userAlreadyExists = false : this.userAlreadyExists = true;
    return this.userAlreadyExists;
  }


  saveUser(usersArray) {
    this.userDto = {
      name: this.signUpForm.controls[`name`].value,
      email: this.signUpForm.controls[`email`].value,
      password: this.signUpForm.controls[`password`].value,
      isAuthenticated: true
    };
    usersArray.push(this.userDto);
    this.localStorageService.store('users', usersArray);
    this.router.navigate(['profile'], {queryParams: {email: this.email}});
  }

}
