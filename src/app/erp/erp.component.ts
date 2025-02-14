import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrls: ['./erp.component.scss'],
  standalone: false
})
export class ERPComponent   {

  constructor(private router: Router){}
  onSubmit() {

    this.router.navigate(['/erp']);

  }

}
