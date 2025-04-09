import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MenuGroup } from 'src/services/menugroup.service';

@Component({
  selector: 'app-menu-popup-save',
  templateUrl: './menu-popup-save.component.html',
  styleUrls: ['./menu-popup-save.component.scss'],
  standalone: false,
})
export class MenuPopupSaveComponent  implements OnInit {
  menuForm: FormGroup;
  companies: any[] = [];
  menus: any[] = [];
  webIcons: string[] = [];
  records: any[] = [];
  isEditing = false;
  dataSource = new MatTableDataSource<any>([]);
  selectedMenuItemId: string | null = null; // Store selected ID for editing


  constructor(
    public dialogRef: MatDialogRef<MenuPopupSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
      private snackBar: MatSnackBar,
     private MenuGroupService: MenuGroup,
  ) {
     console.log('Incoming dialog data:', data);
    this.menuForm = this.fb.group({
      CID: [{ value: data?.CID || '', disabled: true }],
      MenuGroupID: [{ value: data?.MenuGroupID || '', disabled: true }],
      SortID: [data?.SortID || ''],
      MenuID: [data?.MenuID || ''],
      Description: [{ value: data?.Description || '', disabled: true }],
      Reserved: [data?.Reserved || ''],
      ApplicationType: [{ value: data?.ApplicationType || '', disabled: true }],
      Options: [data?.Options || ''],
      WebIcon: [{ value: data?.WebIcon || '', disabled: true }],
    });

    if (this.data) {
      this.menuForm.patchValue(this.data);
    }
  }
  ngOnInit(): void {
    console.log('Incoming dialog data:', this.data);
    this.initializeForm();
    this.loadCompanies();
    this.loadMenuGroup();
  }

  private initializeForm(): void {
    const patchData = {
      CID: this.data?.CID || '',
      MenuGroupID: this.data?.MenuGroupID || '',
      SortID: this.data?.SortID || '',
      MenuID: this.data?.MenuID || '',
      Description: this.data?.Description || '',
      Reserved: this.data?.Reserved || '',
      ApplicationType: this.data?.ApplicationType || '',
      Options: this.data?.Options || '',
      WebIcon: this.data?.WebIcon || ''
    };
    console.log('Patched Form Data:', patchData); 

    this.menuForm = this.fb.group({
      CID: [{ value: patchData.CID, }],
      MenuGroupID: [{ value: patchData.MenuGroupID }],
      SortID: [patchData.SortID],
      MenuID: [patchData.MenuID],
      Description: [{ value: patchData.Description, }],
      Reserved: [patchData.Reserved],
      ApplicationType: [{ value: patchData.ApplicationType, }],
      Options: [patchData.Options],
      WebIcon: [{ value: patchData.WebIcon,  }],
    });
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
          this.menuForm.patchValue({ companyId: defaultCompany.CID });
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

  onCancel(): void {
    this.dialogRef.close();
  }
}