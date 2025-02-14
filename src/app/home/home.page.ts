import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,

})
export class HomePage  implements AfterViewInit{
  selectedTab: string = 'home';
  showDropdown: boolean = false;

  //for sliderimg
  @ViewChild('swiper', { static: false }) swiperContainer!: ElementRef;

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) {}


  slideTexts = [
    { title: "Slide 1 Title", description: "Description for slide 1" },
    { title: "Slide 2 Title", description: "Description for slide 2" },
    { title: "Slide 3 Title", description: "Description for slide 3" },
    { title: "Slide 4 Title", description: "Description for slide 4" }
  ];

  currentSlideIndex = 0;
  currentSlideText = this.slideTexts[this.currentSlideIndex];


  ngAfterViewInit() {
    const swiperElement = this.swiperContainer.nativeElement;

    swiperElement.addEventListener('mouseenter', () => {
      swiperElement.swiper.autoplay.stop(); // Stop autoplay on hover
    });

    swiperElement.addEventListener('mouseleave', () => {
      swiperElement.swiper.autoplay.start(); // Resume autoplay when mouse leaves
    });
  }

  onSlideChange() {
    const swiperElement = this.swiperContainer.nativeElement;
    this.currentSlideIndex = swiperElement.swiper.realIndex;
    this.currentSlideText = this.slideTexts[this.currentSlideIndex];
  }

  //Auth for login
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Check login state
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
            this.router.navigate(['/home']); // Redirect to login
          },
        },
      ],
    });

    await alert.present();
  }

  isSelected(route: string): boolean {
    return this.router.url === route;
  }

}
