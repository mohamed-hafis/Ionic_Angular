import { Component, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  standalone: false,

  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent   {

  selectedTab: string = 'home';
  showDropdown: boolean = false;
  showNavButtons = false;
  isMobile: boolean = true;
  isProductsDropdownVisible: boolean = false;

  toggleProductsDropdown(event: Event) {
    event.stopPropagation();
    this.isProductsDropdownVisible = !this.isProductsDropdownVisible;
  }

  constructor(
    private authService: AuthService,
     private router: Router,
     private alertController: AlertController,
     private menuController: MenuController)
     {
    this.isMobile = window.innerWidth <= 768;
  }

    // Listen to window resize events to adjust for device type
    @HostListener('window:resize', ['$event'])
    onResize(event: UIEvent): void {
      this.isMobile = (event.target as Window).innerWidth <= 768;
    }




  async logout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Logout Confirmation',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Logout cancelled');
          },
        },
        {
          text: 'Logout',
          handler: () => {
            this.authService.logout(); // Set logout state
            console.log("Logout Successfull");
            this.showLogoutSuccessMessage();
            this.router.navigate(['/home']); // Redirect to login
          },
        },
      ],
    });

    await alert.present();
  }


  toggleMenu(): void {
    this.menuController.toggle('mobileMenu');
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isSelected(route: string): boolean {
    return this.router.url === route;
  }

  // Logout message
  async showLogoutSuccessMessage(): Promise<void> {
    const successAlert = await this.alertController.create({
      header: 'Logout Successful',
      message: 'You have successfully logged out.',
      buttons: ['OK'],
    });

    await successAlert.present();
  }


}
