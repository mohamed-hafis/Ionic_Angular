import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MenuGroup } from 'src/services/menugroup.service';

@Component({
  selector: 'app-menu-popup',
  templateUrl: './menu-popup.component.html',
  styleUrls: ['./menu-popup.component.scss'],
  standalone: false,
})
export class MenuPopupComponent  implements OnInit {

  displayedColumns: string[] = ['CID', 'MenuGroupID', 'SortID', 'MenuID', 'Description', 'Reversed', 'ApplicationType', 'WebIcon', 'action'];
  dataSource = new MatTableDataSource<any>([]);


  constructor(
    public dialogRef: MatDialogRef<MenuPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private MenuGroupService: MenuGroup
  ) {}


  ngOnInit() {
    this.fetchMenuData();
  }

  fetchMenuData() {
    this.MenuGroupService.getDDdata().subscribe(
      response => {
        this.dataSource.data =  response.Menumgt;
      },
      error => {
        console.error('Error fetching menu data:', error);
      }
    );
  }


   onSelect(menu: any) {
    this.dialogRef.close(menu); // Send selected row back to parent component
  }
}


