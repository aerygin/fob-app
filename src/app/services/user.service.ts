import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {UserDto} from '../domain/user.dto';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private localStorageService: LocalStorageService,
              private router: Router) {
  }


  findUserByEmail(email: string): UserDto {
    const users = this.getAllUsers();
    if (users === null) {
      return;
    }
    return users.find(k => k.email === email);
  }

  checkIfUserExists(email: string): boolean {
    const user = this.findUserByEmail(email);
    return user === undefined;
  }

  getAllUsers(): UserDto[] {
    return this.localStorageService.retrieve('users');
  }

  logout(email: string) {
    const users = this.getAllUsers();
    const user = this.findUserByEmail(email);
    const index = users.indexOf(user);
    if (index !== -1) {
      users.splice(index, 1);
    }

    user.isAuthenticated = false;
    users.push(user);
    this.localStorageService.store('users', users);
    this.router.navigate(['home']);
  }


  login(email: string) {
    const users = this.getAllUsers();
    const user = this.findUserByEmail(email);
    const index = users.indexOf(user);
    if (index !== -1) {
      users.splice(index, 1);
    }
    user.isAuthenticated = true;
    users.push(user);
    this.localStorageService.store('users', users);
    this.router.navigate(['profile'], {queryParams: {email: email}});
  }

  logoutAllUsers() {
    const users = this.getAllUsers();
    if (users !== null) {
      users.forEach((k => k.isAuthenticated = false));
      this.localStorageService.store('users', users);
    }
  }

}
