import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) {}

  async onSubmit() {
    if (this.username && this.password) {
      console.log('Username:', this.username);
      console.log('Password:', this.password);

      // Call the login method from AuthService
      this.authService.login(this.username, this.password, ).subscribe(
        async response => {
          this.authService.handleLogin(response); // Handle successful login
          console.log("Login Successfull");
          const Token = response?.Token; // Assume API returns a token
          const userRole = response?.role; // Default to 'User' if role is missing

          if (Token) {
            // Store token & role in localStorage
            localStorage.setItem('authToken', Token);
            localStorage.setItem('userRole', userRole);

            await this.presentToast('Login Successful');

            // Navigate based on role
            if (userRole === 'Admin') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.loginError = 'Invalid token received';
            await this.presentToast(this.loginError);
          }
        },
        async error => {
          console.error('Login failed', error);
          this.loginError = 'Invalid username or password'; // Set error message
          await this.presentToast(this.loginError); // Show toast notification
        }
      );
    } else {
      console.log('Please fill in both fields.');
      this.loginError = 'Please fill in both fields.'; // Set error message
      await this.presentToast(this.loginError); // Show toast notification
    }
  }

  // Function to show toast notifications
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }

  isSelected(route: string): boolean {
    return this.router.url === route;
  }
}
