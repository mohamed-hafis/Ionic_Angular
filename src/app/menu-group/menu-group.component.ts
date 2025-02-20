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
      parentId: ['',], // Only numbers allowed
      sortId: ['',], // Only numbers allowed
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
          companyId: this.form.value.companyId, // Assign default companyId
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
  if (Rec.parentId && isNaN(Rec.parentId)) {
    this.snackBar.open('Parent ID must be a number.', 'Close', { duration: 3000 });
    return;
  }

  if (Rec.sortId && isNaN(Rec.sortId)) {
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
  Rec.ID = selectedMenu.ID; // Ensure ID is the numeric value from menu.ID

 

  console.log('Saving Data:', Rec); // Debug log

  this.MenuGroupService.saveData(Rec).subscribe({
    next: (response) => {
      console.log('API Response:', response);

      if (response && response.message) {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
      } else {
        this.snackBar.open('Record saved successfully!', 'Close', { duration: 3000 });
      }

      this.form.reset(); // Reset the form after saving
    }, 
    error: (error) => {
      console.error('Error saving data:', error);
      this.snackBar.open('Failed to save data. Please try again.', 'Close', { duration: 3000 });
    }
  });
}

  onAdd(): void {
    this.snackBar.open('Record added successfully!', 'Close', { duration: 3000 });
  }

  onCancel(): void {
    this.form.reset();
    this.isEditing = false;
  }
}
