import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MenuGroup } from 'src/services/menugroup.service';
import { MenuPopupComponent } from '../menu-popup/menu-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-menu-group',
  templateUrl: './menu-group.component.html',
  styleUrls: ['./menu-group.component.scss'],
  standalone: false,
})
export class MenuGroupComponent implements OnInit {
  form: FormGroup;
  companies: any[] = [];
  menus: any[] = [];
  webIcons: string[] = [];
  records: any[] = [];
  isEditing = false;
  selectedMenuItemId: string | null = null; // Store selected ID for editing

  constructor(private router: Router,private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar, private MenuGroupService: MenuGroup,public dialog: MatDialog) {
    this.form = this.fb.group({
      companyId: ['', Validators.required],
      menuName: ['', Validators.required],
      parentId: [''], 
      sortId: [''], 
      reserved: [''],
      applicationType: [''],
      webIcon: [''],
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
        console.log('Menus:', this.menus);
        console.log('WebIcons:', this.webIcons);
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

  if (this.isEditing) {
    // **Updating an existing record**
    this.MenuGroupService.updateItem(Rec.ID , Rec).subscribe({
      next: (response) => {
        console.log('Update Response:', response);
        this.snackBar.open('Record updated successfully!', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadMenuGroup();
      }, 
      error: (error) => this.handleApiError(error)
    });
  } else {
    // **Saving a new record**
    this.MenuGroupService.saveData(Rec).subscribe({
      next: (response) => {
        console.log('Save Response:', response);
        this.snackBar.open('Record saved successfully!', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadMenuGroup();
      }, 
      error: (error) => this.handleApiError(error)
    });
  }
}

handleApiError(error: any): void {
  console.error('API Error:', error);

  if (error.status === 409) {  
    // Backend returns a 409 Conflict for duplicate records
    this.snackBar.open(error.error?.message || 'Duplicate record exists!', 'Close', { duration: 3000 });
  } else if (error.status === 400) {
    // Handle Bad Request (Validation errors)
    this.snackBar.open(error.error?.message || 'Invalid input. Please check your data.', 'Close', { duration: 3000 });
  } else if (error.status === 500) {
    // Handle Server Errors
    this.snackBar.open('Internal Server Error! Please contact support.', 'Close', { duration: 3000 });
  } else {
    // Default error
    this.snackBar.open('Failed to save data. Please try again.', 'Close', { duration: 3000 });
  }
}

onEdit(row: any) {
  this.selectedMenuItemId = row.id; // Store the ID for editing
  this.isEditing = true; // Set flag

  const companyId = Number(row.companyId);


  const selectedCompany = this.companies.find(company => Number(company.CID) === companyId);

  this.form.patchValue({
    companyId: selectedCompany ? selectedCompany.CID : '', // Ensure field names match API model
    menuName: row.id,
    parentId: row.parentId ?? null,
    sortId: row.sortId ?? null,
    reserved: row.reserved === 1,
    applicationType: row.applicationType,
    webIcon: row.webIcon
  });
  if (selectedCompany) {
    this.form.patchValue({ companyId: selectedCompany.CID });
  }

  console.log('Editing Row:', row);
  console.log('Selected Company:', selectedCompany);
}




onDelete(row: any) {
  console.log("Row data:", row); 

  if (!row.companyId) {
    console.error("Error: CID is missing in the row data!");
    this.snackBar.open('Error: CID is missing!', 'Close', { duration: 3000 });
    return;
  }

  if (!confirm(`Are you sure you want to delete menu item "${row.description}"?`)) {
    return;
  }


  this.MenuGroupService.deleteMenuItem(row).subscribe({
    next: (response) => {
      console.log('Deleted:', response);
      this.snackBar.open('Record deleted successfully!', 'Close', { duration: 3000 });
      this.loadMenuGroup();
    },
    error: (error) => {
      console.error('Error deleting record:', error);
      this.snackBar.open('Delete failed. Please try again.', 'Close', { duration: 3000 });
    }
  });
}
 resetForm() {
    this.form.reset();
    this.isEditing = false;
    this.selectedMenuItemId = null;
  }

  onAddClick(selectedRow: any) {
    this.router.navigate(['/menu-popup'], {
      state: { data: selectedRow } // Passing selected row data
    });
  }
  

  onCancel(): void {
    this.resetForm();
  }
}
