import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetformService } from 'src/services/assetform.service';


@Component({
  selector: 'app-assetform',
  templateUrl: './assetform.component.html',
  styleUrls: ['./assetform.component.scss'],
  standalone: false,
})
export class AssetformComponent  implements OnInit {
  AssetForm!: FormGroup;
  isEditing = false;
  locationids: any[] = [];
  branchids: any[] =[];
  records: any[] = [];
  allBranches: any[] = [];  // Declare allBranches
  message: string = '';
  errorMessage: string = '';
  

  displayedColumns = [
    'CID', 'AssetID', 'AssetName', 'LocationID', 'BranchID',
  ...Array.from({ length: 30 }, (_, i) => `Desc${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Int_Column${i + 1}`),
  ...Array.from({ length: 3 }, (_, i) => `Date${i + 1}`),
  ...Array.from({ length: 3 }, (_, i) => `Qty${i + 1}`),
  'action'
];

  constructor(private fb: FormBuilder, private AssetformService: AssetformService,private snackBar: MatSnackBar) {
    this.AssetForm = this.fb.group({
     CID: [''],
      AssetID: ['', [Validators.required, Validators.pattern("^[0-9]*$")]], // Added validation
      AssetName:  ['', Validators.required],
      LocationID: [''],
      BranchID:  [''],
      Desc1: [''], Desc2: [''], Desc3: [''], Desc4: [''], Desc5: [''],  
      Desc6: [''], Desc7: [''], Desc8: [''], Desc9: [''], Desc10: [''],  
      Desc11: [''], Desc12: [''], Desc13: [''], Desc14: [''], Desc15: [''],  
      Desc16: [''], Desc17: [''], Desc18: [''], Desc19: [''], Desc20: [''],  
      Desc21: [''], Desc22: [''], Desc23: [''], Desc24: [''], Desc25: [''],  
      Desc26: [''], Desc27: [''], Desc28: [''], Desc29: [''], Desc30: [''],  
      Int_Column1:  ['', Validators.pattern("^[0-9]*$")], Int_Column2: ['', Validators.pattern("^[0-9]*$")],
       Int_Column3: ['', Validators.pattern("^[0-9]*$")], 
      Int_Column4: ['', Validators.pattern("^[0-9]*$")], Int_Column5: ['', Validators.pattern("^[0-9]*$")],
      Date1: [''], Date2: [''], Date3: [''],
      Qty1: ['', [Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]], Qty2: ['', [Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]],
       Qty3: ['', [Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]]
    });
   }

  ngOnInit(): void {
this.loadDDdata();
this.fetchAssetData();
  }

  loadDDdata() {
    this.AssetformService.getDDdata().subscribe(
      (response: any) => {
        this.locationids = response.LocationIds || [];
        this.allBranches = response.BranchIds || []; // Store the full list
        this.branchids = [...this.allBranches]; // Initialize with full list
  
        if (this.locationids.length > 0) {
          this.AssetForm.controls['CID'].setValue(this.locationids[0].CID);
        }
      },
      (error: any) => console.error('Error fetching dropdown data:', error)
    );
  }
  
  onLocationChange(selectedLocation: number) {
    this.branchids = this.allBranches.filter(branch => branch.LocationID === selectedLocation);
    this.AssetForm.controls['BranchID'].setValue(''); // Reset branch selection
  }
  
  fetchAssetData() {
    this.AssetformService.getDDdata().subscribe(
      (response: any) => {
        this.records = response.AssetMain; // Assigning API data to table
      },
      (error: any) => {
        console.error('Error fetching asset data:', error);
      }
    );
  }
  

  onSave(): void {
    if (this.AssetForm.invalid) {
      this.showSnackBar('Please fix the errors in the form.', 'error');
      return;
    }
  
    const assetData = this.AssetForm.value; // Get form values
  
    if (this.isEditing) {
      // Update existing record
      this.AssetformService.updateAssetData(assetData).subscribe(
        (response) => {
          console.log('Asset updated successfully:', response);
          this.showSnackBar('Data updated successfully!', 'success');
          this.fetchAssetData(); // Refresh table after update
          this.onCancel(); // Reset form and exit edit mode
        },
        (error) => {
          this.handleError(error);
        }
      );
    } else {
      // Insert new record
      this.AssetformService.saveAssetData(assetData).subscribe(
        (response) => {
          console.log('Asset added successfully:', response);
          this.showSnackBar('Data inserted successfully!', 'success'); 
          this.fetchAssetData(); // Refresh table after insert
          this.onCancel(); // Reset form after saving
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }
  
  handleError(error: any) {
    console.error('API Error:', error); // Log the full error to debug
  
    if (error.status === 409) {
      this.showSnackBar(error.error.Message || 'AssetID Already Exists!', 'error'); 
    } else {
      this.showSnackBar(error.error.Message || 'An unexpected error occurred. Please try again.', 'error');
    }
  }
  

  showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error'
    });
  }

  onCancel(): void {
    this.AssetForm.reset();
    this.loadDDdata();
    this.isEditing = false;
    this.message = '';
  }

  onEdit(row: any) {
    this.AssetForm.patchValue(row);
    this.isEditing = true; // Set flag
    console.log('Editing Row:', row);
  }

  onDelete(row: any) {
    if (confirm(`Are you sure you want to delete Asset ID: ${row.AssetID}?`)) {
      this.AssetformService.deleteAssetData(row.CID,row.AssetID).subscribe({
        next: (response: any) => {
          console.log(response?.Message || 'Delete Successful:', response);
          this.showSnackBar('Deleted Successful', 'success'); 
          this.fetchAssetData(); // Refresh the grid after deletion
        },
        error: (error) => {
          console.error('Error deleting asset:', error);
          if (error?.error?.Message) {
            this.showSnackBar('Deletion Failed', 'error'); 
          } else {
            alert('An error occurred while deleting the asset.');
          }
        }
      });
    }
  }
}

