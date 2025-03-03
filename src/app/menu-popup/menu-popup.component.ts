import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MenuGroup } from 'src/services/menugroup.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-popup',
  templateUrl: './menu-popup.component.html',
  styleUrls: ['./menu-popup.component.scss'],
  standalone: false,
})
export class MenuPopupComponent  implements OnInit {

  menuForm!: FormGroup;  // Form group for binding form data
  displayedColumns: string[] = ['CID', 'MenuGroupID', 'SortID', 'MenuID', 'Description', 'Reserved', 'ApplicationType', 'WebIcon', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  selectedRow: any = {}; 

  constructor(
    private fb: FormBuilder,
    private MenuGroupService: MenuGroup,
    private router: Router
  ) {const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['data']) {
      this.selectedRow  = navigation.extras.state['data'];
    }
  }



  ngOnInit() {
    this.initForm();
    this.fetchMenuGrouping();
    this.fetchMenuData();
  }


  initForm() {
    this.menuForm = this.fb.group({
      CID: [''],
      MenuGroupID: [''],
      SortID: [''],
      MenuID: [''],
      Description: [''],
      Reserved: [''],
      ApplicationType: [''],
      WebIcon: []
    });
  }

  fetchMenuGrouping() {
     if (history.state && history.state.data) {
      this.selectedRow = history.state.data;

      const data = this.selectedRow;
  
      this.menuForm.patchValue({
        CID: data.companyId,
        MenuGroupID: data.id,
        SortID: data.sortId,
        Description: data.description,
        Reserved: data.reserved,
        ApplicationType: data.applicationType,
        WebIcon: data.webIcon
      });

    }
  }

  fetchMenuData() {
    this.MenuGroupService.getDDdata().subscribe(
      response => {
        this.dataSource.data =  response.Menumgt;
        console.log('API Response:', response.Menumgt);

      },
      error => {
        console.error('Error fetching menu data:', error);
      }
    );
  }

  onSubmit() {
    if (this.menuForm.valid) {
      const formData = this.menuForm.value; // Get form data
      
      this.MenuGroupService.Submit(formData).subscribe(
        (response) => {
          console.log('Data inserted successfully', response);
          this.menuForm.reset();
          this.fetchMenuData(); // Refresh table after insertion
        },
        (error) => {
          console.error('Error inserting data', error);
        }
      );
    } else {
      console.log("Form is invalid");
    }
  }
  
   onSelect(menu: any) {
    console.log('Selected Menu:', menu); 
  }

  resetForm() {
    this.menuForm.reset();
  }

}


