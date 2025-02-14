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
          const toast = await this.toastController.create({
            message: 'Login Successfull',
            duration: 2000, // Duration in milliseconds
            color: 'success', // Color of the toast
            position: 'bottom', // Position of the toast
          });
          await toast.present();
          this.router.navigate(['/home']);
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
