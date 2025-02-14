import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
  standalone: false,
})
export class CRMComponent  {

  constructor(private router: Router){}
   onSubmit() {

     this.router.navigate(['/crm']);
   }

}
