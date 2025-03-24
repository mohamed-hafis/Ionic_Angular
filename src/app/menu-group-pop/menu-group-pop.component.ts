import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuPopupComponent } from '../menu-popup/menu-popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuGroup } from 'src/services/menugroup.service';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      companyId: ['', Validators.required],
      menuName: ['', Validators.required],
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
      const selectedCompany = this.companies.find(company => Number(company.CID) === Number(this.data.companyId));
      const selectedMenu = this.menus.find(menu => menu.Description === this.data.menuName);

    this.form.patchValue({
      companyId: selectedCompany ? selectedCompany.CID : '',
      menuName: selectedMenu?.ID || this.data.menuName,
      parentId: this.data.parentId || '',
      sortId: this.data.sortId || '',
      reserved: this.data.reserved === true,
      applicationType: this.data.applicationType || '',
      webIcon: this.data.webIcon || ''
    });
    }
  }



  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Send data back
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
