import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatForm } from 'src/services/matform.service';

@Component({
  selector: 'app-matform',
  templateUrl: './matform.component.html',
  styleUrls: ['./matform.component.scss'],
  standalone: false,
})
export class MatformComponent  implements OnInit {

  form!: FormGroup;
  companies: any[] = [];
  menus: any[] = [];
  records: any[] = [];
  isEditing: boolean = false;
  editIndex: number | null = null;
  displayedColumns: string[] = ['companyId', 'menuId', 'menuName', 'actions'];


  constructor(private fb: FormBuilder, private matFormService: MatForm) { }

  ngOnInit() {
    this.form = this.fb.group({
      companyId: ['', Validators.required],
      menuId: ['', Validators.required],
      sqlQuery1: ['', Validators.required],
      sqlQuery2: [''],
      relationColumn1: [''],
      relationColumn2: [''],
      formatColumn: ['']
    });
    this.loadDropdownData();
    this.loadGridData();
  }

  loadDropdownData() {
    this.matFormService.getDDdata().subscribe(
      (response: any) => {
        this.companies = response.Companies || [];

        const defaultCompany = this.companies.find(company => company.CompanyName === "AcSys IT Solution");

      if (defaultCompany) {
        this.form.patchValue({ companyId: defaultCompany.CID });
      }
      console.log('Companies:', this.companies);
      this.menus = response.Menus || [];

      },
      (error) => console.error('Error fetching dropdown data:', error)
    );
  }

  loadGridData() {
    this.matFormService.getDDdata().subscribe(
      (response: any) => {

        console.log('Grid record:', response);
        this.records = response.Data?.map((item: any) => ({
          companyId: item.CID,
          menuId: item.ID,
          menuName: item.Description,
          sqlQuery1: item.SqlQuery1 || '',
          sqlQuery2: item.SqlQuery2 || '',
          relationColumn1: item.RelationColumn1 || '',
          relationColumn2: item.RelationColumn2 || '',
          formatColumn: item.FormatColumn || ''
        })) || [];
      },
      (error) => console.error('Error fetching grid data:', error)
    );
  }


 // Save
 onSave() {
  if (this.form.invalid) {
    alert('Please fill all required fields');
    return;
  }
  this.saveOrUpdateData();
}

saveOrUpdateData() {
  const formData = {
    CID: this.form.value.companyId,
    MenuID: this.form.value.menuId,
    MenuName: this.menus.find(menu => menu.MenuID === this.form.value.menuId)?.MenuName || '',
    SqlQuery1: this.form.value.sqlQuery1,
    SqlQuery2: this.form.value.sqlQuery2,
    RelationColumn1: this.form.value.relationColumn1,
    RelationColumn2: this.form.value.relationColumn2,
    FormatColumn: this.form.value.formatColumn
  };

  if (this.isEditing) {
    this.matFormService.updateData(formData).subscribe(
      () => {
        alert('Data updated successfully!');
        this.loadGridData();
        this.resetForm();
      },
      error => alert('Error updating data: ' + error)
    );
  } else {
    this.matFormService.saveData(formData).subscribe(
      () => {
        alert('Data saved successfully!');
        this.loadGridData();
        this.resetForm();
      },
      error => {

        if (error?.error?.Message && error.error.Message.includes('This MenuID is already registered. Please choose a different MenuID.')) {
          alert(error.error.Message);
        } else {
          alert('Error saving data: ' + error);
        }
      }
    );
  }
}


  // Edit
  onEdit(record: any) {
    console.log('Record data:', record);

    // Get the CID and MenuID of the selected record
    const cid = record.companyId;
    const menuId = record.menuId;

    this.matFormService.getRecordForEdit(cid, menuId).subscribe((response: any) => {
        console.log('Fetched record for edit:', response);

         if (!response || !response.Data) {
          console.error('Invalid response data:', response);
          return;
        }

        const data = response.Data;
        // Assuming the response is in the structure you mentioned, populate the form
        this.form.patchValue({
          companyId: data.CID, // Set CID to match the form value
          menuId: data.MenuID, // Set MenuID to match the form value
          sqlQuery1: data.SqlQuery1,
          sqlQuery2: data.SqlQuery2,
          relationColumn1: data.RelationColumn1,
          relationColumn2: data.RelationColumn2,
          formatColumn: data.FormatColumn
        });

        // Set additional data, like company and menu names, if needed
        const selectedCompany = this.companies?.find(company => company.CID?.toString() === data.CID?.toString());
        const selectedMenu = this.menus?.find(menu => menu.MenuID?.toString() === response.MenuID?.toString());

        console.log('Selected Company:', selectedCompany);
        console.log('Selected Menu:', selectedMenu);

        if (selectedCompany && selectedMenu) {
          this.form.patchValue({
            companyName: selectedCompany.CompanyName, // Optional: set company name if needed
            menuName: selectedMenu.MenuName // Optional: set menu name if needed
          });
        }

        // Set the edit flag and track the index of the edited record
        this.isEditing = true;
        this.editIndex = this.records.indexOf(record); // Track the index of the edited row
      },
      (error) => {
        console.error('Error fetching record:', error);
      }
    );
  }




  onDelete(record: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.matFormService.deleteData(record.companyId, record.menuId).subscribe(
        () => {
          alert('Record deleted successfully');
          this.loadGridData();
          this.resetForm();
        },
        (error) => alert('Error deleting record: ' + error)
      );
    }
  }

  onCancel() {
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
    this.isEditing = false;
    this.editIndex = null;
  }
}
