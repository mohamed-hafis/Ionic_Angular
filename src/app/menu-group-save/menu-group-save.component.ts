import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuGroup } from 'src/services/menugroup.service';

@Component({
  selector: 'app-menu-group-save',
  templateUrl: './menu-group-save.component.html',
  styleUrls: ['./menu-group-save.component.scss'],
  standalone:false,
})
export class MenuGroupSaveComponent  implements OnInit {
 
  form: FormGroup;
  companies: any[] = [];
  menus: any[] = [];
  webIcons: string[] = [];
  records: any[] = [];
  isEditing = false;
  selectedMenuItemId: string | null = null; // Store selected ID for editing
 
  constructor(
    private fb: FormBuilder,
   public dialog: MatDialog,
    private MenuGroupService: MenuGroup,
     private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      companyId: [''],
      menuName: [''],
      parentId: [''],
      sortId: [''],
      reserved: [''],
      applicationType: [''],
      webIcon: ['']
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadMenuGroup()
  }

  loadCompanies() {
    this.MenuGroupService.getDDdata().subscribe(
      (response: any) => {
        this.companies = response.Companies || [];
        this.menus = response.Menus || [];
        this.webIcons = response.Webicon.map((icon: any) => icon.WebIcon).filter((icon: any) => icon !== null);

        // Set default company
        const defaultCompany = this.companies.find(company => company.CompanyName === "AcSys IT Solution");
        if (defaultCompany) {
          this.form.patchValue({ companyId: defaultCompany.CID });
        }
        
        console.log('Companies:', this.companies);
      },
      (error : any) => console.error('Error fetching dropdown data:', error)
    );
  }

loadMenuGroup() {
    this.MenuGroupService.getDDdata().subscribe(
      (response: any) => {
        this.records = response.MenuGrouping.map((data: any) => ({
          companyId: data.CID, // Assign default companyId
          id: data.ID,
          description: data.Description,
          parentId: data.ParentID,
          sortId: data.SortID,
          reserved: data.Reserved ? 1 : 0,
          applicationType: data.ApplicationType,
          webIcon: data.WebIcon || 'NULL',
        }));
  
        console.log('Menu Group Records:', this.records);
      },
      (error: any) => {
        console.error('Error fetching menu group data:', error);
      }
    );
  }

  onSave(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please fill out all required fields', 'Close', { duration: 3000 });
      return;
    }
    
  // Get form data
  const Rec = this.form.value;

  // Ensure CID is assigned correctly
  if (!Rec.parentId || isNaN(Rec.parentId)) {
    this.snackBar.open('Parent ID must be a number.', 'Close', { duration: 3000 });
    return;
  }

  if (!Rec.sortId || isNaN(Rec.sortId)) {
    this.snackBar.open('Sort ID must be a number.', 'Close', { duration: 3000 });
    return;
  }

  // Ensure CID is assigned correctly
  if (!Rec.companyId || Rec.companyId === 0) {
    this.snackBar.open('Invalid Company selection. Please choose a valid Company.', 'Close', { duration: 3000 });
    return;
  }
  Rec.CID = Rec.companyId; // Assign CID correctly

  // Find the selected menu based on menuName (ID) and get Description
  const selectedMenu = this.menus.find(menu => menu.ID === Rec.menuName);
  if (!selectedMenu) {
    this.snackBar.open('Invalid Menu selection. Please choose a valid Menu.', 'Close', { duration: 3000 });
    return;
  }

  // Assign Description and ID
  Rec.Description = selectedMenu.Description;
  Rec.ID = selectedMenu.ID; 


  console.log('Saving Data:', Rec); 

 
  this.MenuGroupService.saveData(Rec).subscribe({
    next: (response: any) => {
      if (response && response.message && response.message.includes("Error")) {
        this.snackBar.open(response.message, 'Close', { duration: 4000 });
      } else {
        this.snackBar.open('Record saved successfully!', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadMenuGroup();
      }
    },
    error: (error: any) => this.handleApiError(error)
  });
}


handleApiError(error: any): void {
  console.error('API Error:', error);

  let errorMessage = 'Failed to save data. Please try again.';
  
  if (error.error && typeof error.error === 'object') {
    if (error.error.message) {
      errorMessage = error.error.message; // Get error message from API response
    } else if (error.error.error) {
      errorMessage = error.error.error; // Alternative error field
    }
  } else if (typeof error.error === 'string') {
    errorMessage = error.error; // Handle plain text errors
  } else if (error.status === 409) {
    errorMessage = 'Duplicate record exists!';
  } else if (error.status === 400) {
    errorMessage = 'Invalid input. Please check your data.';
  } else if (error.status === 500) {
    errorMessage = 'Internal Server Error! Please contact support.';
  }

  this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
}

resetForm() {
  this.form.reset();
  this.isEditing = false;
  this.selectedMenuItemId = null;
}

}
