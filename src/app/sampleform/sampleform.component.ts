import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SampleForm } from 'src/services/sampleform.service';


@Component({
  selector: 'app-sampleform',
  templateUrl: './sampleform.component.html',
  styleUrls: ['./sampleform.component.scss'],
  standalone: false,
})
export class SampleformComponent  implements OnInit {

  formGroup!: FormGroup;
  companies: any[] = [];
  menus: any[] = [];
  gridData: {
    cid: String;
    description: string;
    menuId: string;
    menuName: string;
    query1: string;
    query2: string;
    relationColumn1: string;
    relationColumn2: string;
    formatColumn: string;}[] = []; // Holds data displayed in the grid
  isEditing: boolean = false;
  editIndex: number | null = null;
  constructor(private fb: FormBuilder, private sampleFormService: SampleForm) {}

  ngOnInit() {
    // Initialize the form
    this.formGroup = this.fb.group({
      companyId: ['', Validators.required],
      menuId: ['', Validators.required],
      query1: ['', Validators.required],
      query2: ['', Validators.required],
      relationColumn1: ['', Validators.required],
      relationColumn2: ['', Validators.required],
      formatColumn: ['', Validators.required],
    });
    // Fetch dropdown options
    this.loadDropdownData();
    this.loadGridData();
  }

  // Function to fetch dropdown options from API

  loadDropdownData() {
    this.sampleFormService.getDDdata().subscribe(
      (response: any) => {
        if (response) {
          this.companies = response.Companies || [];
          this.menus = response.Menus || [];
        }
      },
      (error) => {
        console.error('Error fetching dropdown data:', error);
      }
    );
  }

  loadGridData() {
    this.sampleFormService.getDDdata().subscribe(
      (response: any) => {
        if (response && response.Data) {
          this.gridData = response.Data.map((item: any) => ({
            cid: item.CID,
            menuId: item.MenuID,
            menuName: item.MenuName,
            description: item.MenuName,
            query1: item.SqlQuery1 || '',
            query2: item.SqlQuery2 || '',
            relationColumn1: item.RelationColumn1 || '',
            relationColumn2: item.RelationColumn2 || '',
            formatColumn: item.FormatColumn || ''
          }));
        } else {
          this.gridData = [];
        }
        console.log(this.gridData); // Debugging output
      },
      (error) => {
        console.error('Error fetching grid data:', error);
      }
    );
  }


  onSave() {

    if (!this.formGroup.value.companyId || !this.formGroup.value.menuId || !this.formGroup.value.query1) {
      alert('CompanyID, MenuID, and Query1 cannot be empty.');
      return;  // Stop further execution if validation fails
    }

    const selectedMenu = this.menus.find(menu => menu.MenuID === this.formGroup.value.menuId);

    if (selectedMenu) {
      const formData = {
        CID: this.formGroup.value.companyId,  // Match C# API model
        MenuID: this.formGroup.value.menuId,
        MenuName: selectedMenu.MenuName, // Ensure MenuName matches C# API
        SqlQuery1: this.formGroup.value.query1,
        SqlQuery2: this.formGroup.value.query2,
        RelationColumn1: this.formGroup.value.relationColumn1,
        RelationColumn2: this.formGroup.value.relationColumn2,
        FormatColumn: this.formGroup.value.formatColumn
      };

      if (this.isEditing) {
        // If editing, call update API
        this.sampleFormService.updateData(formData).subscribe(
          response => {
            if (response) { // Ensure response is valid
              console.log("Response from API:", response);
              alert("Data updated successfully!");
              this.loadGridData();
              this.resetForm();
            } else {
              alert("Unexpected response from API");
            }
          },
          error => {
            console.error("Error updating data:", error);
            alert("Failed to update data.");
          }
        );
      } else {
        // If not editing, call save API
        this.sampleFormService.saveData(formData).subscribe(response => {
          console.log("Response from API:", response);
          alert("Data saved successfully!"); // Show success message
          this.loadGridData();  // Reload the grid data after save
          this.resetForm(); // Reset the form after save
        }, error => {
          console.error("Error saving data:", error);
          alert("Failed to save data.");
        });
      }
    }
  }


  onEdit(row: any) {
    console.log('Record data:', row);
    // Get the CID and MenuID of the selected row
    const cid = row.cid;
    const menuId = row.menuId;

    console.log('cid from row:', cid);

    // Call the service to fetch the data
    this.sampleFormService.getRecordForEdit(cid, menuId).subscribe((data: any) => {
      console.log('Fetched data:', data);
      console.log('Companies loaded:', this.companies);
      // Find the selected company and menu from the dropdown data
      const selectedCompany = this.companies.find(company => company.CID === cid.toString());
      const selectedMenu = this.menus.find(menu => menu.MenuID === menuId);

      console.log('Selected Company:', selectedCompany);
      console.log('Selected Menu:', selectedMenu);


      // Populate the form with the data
      this.formGroup.patchValue({
        companyId: selectedCompany ? selectedCompany.CID : '', // Set CID to match the form value
        menuId: selectedMenu ? selectedMenu.MenuID : '', // Set MenuID to match the form value
        query1: data.SqlQuery1,
        query2: data.SqlQuery2,
        relationColumn1: data.RelationColumn1,
        relationColumn2: data.RelationColumn2,
        formatColumn: data.FormatColumn
      });

      this.isEditing = true;
      this.editIndex = row.index; // Optional: Track the index of the edited row
    }, (error) => {
      console.error('Error fetching data for edit', error);
    });
  }

  onDelete(row: any) {
    const cid = row.cid;
    const menuId = row.menuId;

    // Confirm the deletion action
    if (confirm('Are you sure you want to delete this record?')) {
      // Call the deleteData method to delete the record from the backend
      this.sampleFormService.deleteData(cid, menuId).subscribe(
        (response: any) => {
          console.log('Data deleted successfully', response);

          // Remove the deleted item from the gridData array
          const index = this.gridData.findIndex(item => item.cid === cid && item.menuId === menuId);
          if (index !== -1) {
            this.gridData.splice(index, 1); // Remove the item from the array
          }

          // Optionally, show a success message or reload the grid data
          alert('Record deleted successfully');
        },
        (error) => {
          console.error('Error deleting data', error);
          alert('Error deleting record');
        }
      );
    }
  }


  onCancel() {
    this.resetForm();
  }

  resetForm() {
    this.formGroup.reset();
    this.isEditing = false;
    this.editIndex = null;
  }
}
