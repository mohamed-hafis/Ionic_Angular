import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
  standalone : false,
})
export class AboutusComponent  {

  constructor(private router: Router){}

  onSubmit() {

  this.router.navigate(['/about']);

}

}
