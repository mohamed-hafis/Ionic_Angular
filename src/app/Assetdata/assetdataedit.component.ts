import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetformService } from 'src/services/assetform.service';


@Component({
  selector: 'app-assetdataedit',
  templateUrl: './assetdataedit.component.html',
  styleUrls: ['./assetdataedit.component.scss'],
  standalone: false,
})
export class AssetdataComponent implements OnInit {
  AssetForm!: FormGroup;
  assetData: any;
  editForm: any;
  isEditing = false;
  locationids: any[] = [];
  branchids: any[] =[];
  records: any[] = [];
  allBranches: any[] = [];  // Declare allBranches
  message: string = '';
  errorMessage: string = '';

  
  constructor(
    private fb: FormBuilder,
    private assetService: AssetformService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
   
  ) {this.AssetForm = this.fb.group({
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
  });}

 

   ngOnInit(): void {
    this.loadDDdata();
    this.fetchAssetData();
      }
    
      loadDDdata() {
        this.assetService.getDDdata().subscribe(
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
    this.assetService.getDDdata().subscribe(
      (response: any) => {
        this.records = response.AssetMain; // Assigning API data to table
      },
      (error: any) => {
        console.error('Error fetching asset data:', error);
      }
    );
  }

  openAssetDialog(assetData?: any): void {
    const dialogRef = this.dialog.open(AssetdataComponent, {
      width: '800px',
      data: assetData ? assetData : null,  // Pass data for editing, or null for new
      disableClose: true,
      autoFocus: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated' || result === 'saved') {
        this.fetchAssetData(); // Refresh grid or table
      }
    });
  }

  onUpdate() {
    if (this.editForm.invalid) {
      this.snackBar.open('Please fix the errors in the form.', 'Close', { duration: 3000, panelClass: 'snack-error' });
      return;
    }

    const updatedData = this.editForm.value;
    this.assetService.updateAssetData(updatedData).subscribe({
      next: (res) => {
        this.snackBar.open('Asset updated successfully!', 'Close', { duration: 3000, panelClass: 'snack-success' });
        // You may want to emit an event here to notify the parent to refresh
      },
      error: (err) => {
        this.snackBar.open('Error updating asset.', 'Close', { duration: 3000, panelClass: 'snack-error' });
        console.error(err);
      }
    });
  }

  onCancel() {
    this.editForm.reset(this.assetData);
  }
}
