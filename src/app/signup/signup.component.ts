import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router to navigate

import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false,
})


export class SignupComponent {
  // Define variables for signup form
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router,private authService: AuthService) {}

  onSignup() {
    if (this.password === this.confirmPassword) {
      this.authService.signup(this.username, this.password, this.confirmPassword).subscribe(
        response => {
          console.log('Signup successful', response);
          // Redirect to login page or home page
          alert('Signup successful! Redirecting to login page...');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error during signup', error);
          alert('Signup failed: ' + (error.error?.Message || 'An unexpected error occurred'));
        }
      );
    } else {
      alert('Passwords do not match');
    }
  }
}
