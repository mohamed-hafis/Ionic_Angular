import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-menu-popup-edit',
  templateUrl: './menu-popup-edit.component.html',
  styleUrls: ['./menu-popup-edit.component.scss'],
  standalone: false
})
export class MenuPopupEditComponent  implements OnInit {
  form: FormGroup;
  isEditing: boolean = false;
  companies: any[] = [];
  menus: any[] = [];
  webIcons: string[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MenuPopupEditComponent>
  ) {
    this.form = this.fb.group({
      CID: ['', Validators.required],
      MenuGroupID: ['', Validators.required],
      SortID: [''],
      MenuID: [''],
      Description: [''],
      Reserved: [''],
      ApplicationType: [''],
      Options: [''],
      WebIcon: [''],
    });
  }

  ngOnInit() {
    if (this.data) {
      const patchedData = { ...this.data }; // pre-fill with passed data

      if (Array.isArray(patchedData.Options)) {
        patchedData.Options = patchedData.Options.map((opt: any) => opt.Options).join(', ');
      }
  
      this.form.patchValue(patchedData); // pre-fill with processed data
    
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // send data back to parent
    }
  }
  onCancel(): void {
    this.dialogRef.close(); // close dialog without saving
  }
}

