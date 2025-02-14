import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone : false,
})
export class ContactComponent implements OnInit  {



  ngOnInit() {
  }




 constructor(private router: Router){}

   onSubmit() {

   this.router.navigate(['/contact']);

}
}

