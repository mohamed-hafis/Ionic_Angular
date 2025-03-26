import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuPopupComponent } from '../menu-popup/menu-popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuGroup } from 'src/services/menugroup.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu-group-pop',
  templateUrl: './menu-group-pop.component.html',
  styleUrls: ['./menu-group-pop.component.scss'],
  standalone:false,
})
export class MenuGroupPopComponent  implements OnInit {

  form: FormGroup;
  isEditing: boolean = false;
  companies: any[] = [];
  menus: any[] = [];
  webIcons: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MenuGroupPopComponent>,
     private MenuGroupService: MenuGroup,
     private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      companyId: ['', Validators.required],
      id: ['', Validators.required],
      parentId: [''],
      sortId: [''],
      reserved: [''],
      applicationType: ['', Validators.required],
      webIcon: [''],
    });

    if (data) {
      this.isEditing = true;
    }
  }

  ngOnInit() {
    this.loadDropdownData(); // Load company data
  
  }

  loadDropdownData() {
    this.MenuGroupService.getDDdata().subscribe(
      (response: any) => {
        this.companies = response.Companies || [];
        this.menus = response.Menus || [];
        this.webIcons = response.Webicon.map((icon: any) => icon.WebIcon).filter((icon: any) => icon !== null);
        
        if (this.isEditing) {
          this.patchFormValues();
        }
      },
      (error: any) => console.error('Error fetching dropdown data:', error)
    );
  }
  
  patchFormValues() {
    if (this.data) {
      console.log("Data received for editing:", this.data);

      const selectedCompany = this.companies.find(company => Number(company.CID) === Number(this.data.companyId));
      const selectedMenu = this.menus.find(menu => menu.Description === this.data.description);

    this.form.patchValue({
      companyId: selectedCompany ? selectedCompany.CID : '',
      id: selectedMenu ? selectedMenu.ID : '',
      description: this.data.id || '', 
      parentId: this.data.parentId || '',
      sortId: this.data.sortId || '',
      reserved: this.data.reserved === true,
      applicationType: this.data.applicationType || '',
      webIcon: this.data.webIcon || ''
    });
    console.log('Patched form values:', this.form.value);
    }
  }



  onSave(): void {
    if (this.form.valid) {
      const menuItem = { ...this.form.value };

      const selectedMenu = this.menus.find(menu => menu.ID === menuItem.id);
      menuItem.Description = selectedMenu ? selectedMenu.Description : '';
      
      console.log("Form data before sending:", menuItem); // Debugging log
      // Ensure ID is included for updates
      const menuItemId = this.data?.id || menuItem.id;

      console.log("Sending ID to API:", menuItemId);


      this.MenuGroupService.updateItem(menuItemId, menuItem).subscribe({
        next: (response: any) => {
          console.log("Update response:", response);
          this.snackBar.open('Menu item updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close({ success: true, message: response.message });
        },
        error: (error) => {
          console.error('Update Error:', error);
          this.snackBar.open(error.error?.message || 'Update failed', 'Close', { duration: 3000 });
          this.dialogRef.close({ success: false, message: error.error?.message || 'Update failed' });
        }
      });
    }
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
