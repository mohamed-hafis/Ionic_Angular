import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MenuGroup } from 'src/services/menugroup.service';




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

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar, private MenuGroupService: MenuGroup,) {
    this.form = this.fb.group({
      companyId: ['', Validators.required],
      menuName: ['', Validators.required],
      parentId: [''],
      sortId: [''],
      reserved: [''],
      webIcon: ['', Validators.required],
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

        console.log('Grid record:', response);
        this.records = response.Data?.map((item: any) => ({
          companyId: item.CID,
          menuId: item.MenuID,
          menuName: item.MenuName,
          parentId: item.ParentID || '',
          sortId: item.SqlQuery2 || '',
          reserved: item.RelationColumn1 || '',
          webIcon: item.RelationColumn2,
        })) || [];
      },
      (error) => console.error('Error fetching grid data:', error)
    );
  
  }


  onSave(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please fill out all required fields', 'Close', { duration: 3000 });
      return;
    }

    const newRecord = this.form.value;
    this.records.push(newRecord);
    this.snackBar.open('Record saved successfully!', 'Close', { duration: 3000 });
    this.form.reset();
  }

  onAdd(row: any): void {
    this.records.push({ ...row });
    this.snackBar.open('Record added successfully!', 'Close', { duration: 3000 });
  }

  onCancel(): void {
    this.form.reset();
    this.isEditing = false;
  }
}
