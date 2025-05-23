import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';
import { MenuGroup } from 'src/services/menugroup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPopupSaveComponent } from '../menu-popup-save/menu-popup-save.component';
import { MenuPopupEditComponent } from '../menu-popup-edit/menu-popup-edit.component';

@Component({
  selector: 'app-menu-popup',
  templateUrl: './menu-popup.component.html',
  styleUrls: ['./menu-popup.component.scss'],
  standalone: false,
})
export class MenuPopupComponent  implements OnInit {

  menuForm!: FormGroup;  // Form group for binding form data
  displayedColumns: string[] = ['CID', 'MenuGroupID', 'SortID', 'MenuID', 'Description', 'Reserved', 'ApplicationType', 'Options','WebIcon', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  selectedRow: any = {}; 

  constructor(
    private fb: FormBuilder,
    private MenuGroupService: MenuGroup,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['data']) {
      this.selectedRow  = navigation.extras.state['data'];
    }
  }

  ngOnInit() {
    this.initForm();
    this.fetchMenuGrouping();
    this.fetchMenuData();
    this.openDialog();
  }


  initForm() {
    this.menuForm = this.fb.group({
      CID: [''],
      MenuGroupID: [''],
      SortID: [''],
      MenuID: ['', Validators.required],
      Description: [''],
      Reserved: [''],
      ApplicationType: [''],
      Options: [''],
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
        Description: data.description,
        ApplicationType: data.applicationType,
        WebIcon: data.webIcon
      });

    }
  }

  fetchMenuData() {
    this.MenuGroupService.getDDdata().subscribe(
      response => {
        this.dataSource.data =  response.Menumgt;
        console.log('MenuMgt API Response:', response.Menumgt);

      },
      error => {
        console.error('Error fetching menu data:', error);
      }
    );
  }

  onSubmit() {
    if (this.menuForm.valid) {
    const formData = { ...this.menuForm.value };
    // Convert Options string (comma-separated) to JSON format
    const selectedOptions = this.menuForm.value.Options
      .split(',')
      .map((opt: string) => ({ Options: opt.trim() })); 

    // Store the JSON formatted Options
    formData.Options = JSON.stringify(selectedOptions);

    this.MenuGroupService.Submit(formData).subscribe(
      (response) => {
        console.log('Data inserted successfully', response);
        this.snackBar.open('Data saved successfully!', 'Close', { duration: 3000 });
        this.fetchMenuData(); // Refresh table after insertion
        this.menuForm.reset();
      },
      (error) => {
        console.error('Error inserting data', error);
      }
    );
  } else {
    console.log("Form is invalid");
    this.snackBar.open('Enter all fields', 'Close', { duration: 3000 });
  }
}

openDialog(): void {
  const dialogRef = this.dialog.open(MenuPopupSaveComponent, {
    width: '500px',
    data: {
      
    } // You can pass default values here if needed
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Dialog result:', result);
    }
  });
}

  
onEdit(row: any): void {
  const dialogRef = this.dialog.open(MenuPopupEditComponent, {
    width: '500px',
    data: row // Pass the selected row to the edit dialog
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Edit dialog result:', result);
      this.fetchMenuData(); // refresh if updated
    }
  });
}


onDelete(row : any) {

}

  resetForm() {
    this.menuForm.reset();
  }

}


