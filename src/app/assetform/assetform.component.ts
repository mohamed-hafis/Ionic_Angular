import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  displayedColumns = [
    'CID', 'AssetID', 'AssetName', 'LocationID', 'BranchID',
  ...Array.from({ length: 30 }, (_, i) => `Desc${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Int_Colmn${i + 1}`),
  ...Array.from({ length: 3 }, (_, i) => `Date${i + 1}`),
  ...Array.from({ length: 3 }, (_, i) => `Qty${i + 1}`),
  'action'
];

  constructor(private fb: FormBuilder, private AssetformService: AssetformService) {
    this.AssetForm = this.fb.group({
      CID: [''],
      AssetID:  [''],
      AssetName:  [''],
      LocationID:  [''],
      BranchID:  [''],
      Desc1: [''],  
      Desc2: [''],
      Desc3: [''],
      Desc4: [''],  
Desc5: [''],  
Desc6: [''],  
Desc7: [''],  
Desc8: [''],  
Desc9: [''],  
Desc10: [''],  
Desc11: [''],  
Desc12: [''],  
Desc13: [''],  
Desc14: [''],  
Desc15: [''],  
Desc16: [''],  
Desc17: [''],  
Desc18: [''],  
Desc19: [''],  
Desc20: [''],  
Desc21: [''],  
Desc22: [''],  
Desc23: [''],  
Desc24: [''],  
Desc25: [''],  
Desc26: [''],  
Desc27: [''],  
Desc28: [''],  
Desc29: [''],  
Desc30: [''],  

      Int_Colmn1: [''],
      Int_Colmn2: [''],
      Int_Colmn3: [''],
      Int_Colmn4: [''],
      Int_Colmn5: [''],
      Date1: [''],
      Date2: [''],
      Date3: [''],
      Qty1: [''],
      Qty2: [''],
      Qty3: ['']
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
      console.error('Form is invalid. Please check the required fields.');
      return;
    }
  
    const assetData = this.AssetForm.value; // Get form values
  
    if (this.isEditing) {
      // Update existing record
      this.AssetformService.updateAssetData(assetData).subscribe(
        (response) => {
          console.log('Asset updated successfully:', response);
          this.fetchAssetData(); // Refresh table after update
          this.onCancel(); // Reset form and exit edit mode
        },
        (error) => {
          console.error('Error updating asset:', error);
        }
      );
    } else {
      // Insert new record
      this.AssetformService.saveAssetData(assetData).subscribe(
        (response) => {
          console.log('Asset added successfully:', response);
          this.fetchAssetData(); // Refresh table after insert
          this.onCancel(); // Reset form after saving
        },
        (error) => {
          console.error('Error adding asset:', error);
        }
      );
    }
  }
  

  onCancel(): void {
    this.AssetForm.reset();
    this.isEditing = false;
  }

  onSelect(row: any) {
    console.log('Selected Row:', row);
  }

}

