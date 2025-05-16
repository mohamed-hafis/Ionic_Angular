/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-trailing-spaces */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { S } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl  } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/Services/OtherServices/notification.service';

interface Leave {
  LID: string;
  name: string;
  ColorCode: string;
}

interface GroupALL {
  Name: string;
  [key: string]: any; // for dynamic columns like S, M, T etc.
}

@Component({
  selector: 'app-attendencreport',
  templateUrl: './attendencreport.component.html',
  styleUrls: ['./attendencreport.component.css']
})
export class AttendencreportComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  selectionForm!: FormGroup;
  calendarForm: FormGroup;
  dataViewForm!: FormGroup;
  datasource: MatTableDataSource<GroupALL> = new MatTableDataSource([]);

// Selection Criteria
  CID: any;
  companies: string[] = [];
  groups: string[] = [];
  months: string[] = [ 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  departments: string[] = [];
  employeeList: Array<{ LedgerID: number, Name: string }> = [];

  categories: string[] = ['All', 'By Employee', 'All With LeaveData'];
  years: number[] = [];

// calender
  leaveid: string;
  leavelist: Leave[] = [];
  leavelist1: Leave[] = [];
  dayColumns: string[] = [];
  employees: { id: number, name: string }[] = [];
  viewFlag: string = 'ALL';
   selectedEmployee: any = null;

  columns = [
    { columnDef: 'Name', header: 'Name', cell: (element: any) => `${element.Name}`, color: 'red' },
    { columnDef: 'S',  header: 'S',   cell: (element: any) => `${element.S}` },
    { columnDef: 'M',  header: 'M',   cell: (element: any) => `${element.M}` },
    { columnDef: 'T',  header: 'T',   cell: (element: any) => `${element.T}` },
    { columnDef: 'W',  header: 'W',   cell: (element: any) => `${element.W}` },
    { columnDef: 'T1', header: 'T',   cell: (element: any) => `${element.T1}` },
     { columnDef: 'F', header: 'F',    cell: (element: any) => `${element.F}` },
    { columnDef: 'S1', header: 'S',    cell: (element: any) => `${element.S1}` },
    { columnDef: 'S2', header: 'S',    cell: (element: any) => `${element.S2}` },
    { columnDef: 'M1', header: 'M',    cell: (element: any) => `${element.M1}` },
    { columnDef: 'T2', header: 'T',    cell: (element: any) => `${element.T2}` },
    { columnDef: 'W1', header: 'W',    cell: (element: any) => `${element.W1}` },
    { columnDef: 'T3', header: 'T',    cell: (element: any) => `${element.T3}` },
    { columnDef: 'F1', header: 'F',    cell: (element: any) => `${element.F1}` },
    { columnDef: 'S3', header: 'S',    cell: (element: any) => `${element.S3}` },
    { columnDef: 'S4', header: 'S',    cell: (element: any) => `${element.S4}` },
    { columnDef: 'M2', header: 'M',    cell: (element: any) => `${element.M2}` },
    { columnDef: 'T4', header: 'T',    cell: (element: any) => `${element.T4}` },
    { columnDef: 'W2', header: 'W',    cell: (element: any) => `${element.W2}` },
    { columnDef: 'T5', header: 'T',    cell: (element: any) => `${element.T5}` },
    { columnDef: 'F2', header: 'F',    cell: (element: any) => `${element.F2}` },
    { columnDef: 'S5', header: 'S',    cell: (element: any) => `${element.S5}` },
    { columnDef: 'S6', header: 'S',    cell: (element: any) => `${element.S6}` },
    { columnDef: 'M3', header: 'M',    cell: (element: any) => `${element.M3}` },
    { columnDef: 'T6', header: 'T',    cell: (element: any) => `${element.T6}` },
    { columnDef: 'W3', header: 'W',    cell: (element: any) => `${element.W3}` },
    { columnDef: 'T7', header: 'T',    cell: (element: any) => `${element.T7}` },
    { columnDef: 'F3', header: 'F',    cell: (element: any) => `${element.F3}` },
    { columnDef: 'S7', header: 'S',    cell: (element: any) => `${element.S7}` },
    { columnDef: 'S8', header: 'S',    cell: (element: any) => `${element.S8}` },
    { columnDef: 'M4', header: 'M',    cell: (element: any) => `${element.M4}` },
    { columnDef: 'T8', header: 'T',    cell: (element: any) => `${element.T8}` },
    { columnDef: 'W4', header: 'W',    cell: (element: any) => `${element.W4}` },
    { columnDef: 'T9', header: 'T',    cell: (element: any) => `${element.T9}` },
    { columnDef: 'F4', header: 'F',    cell: (element: any) => `${element.F4}` },
    { columnDef: 'S9', header: 'S',    cell: (element: any) => `${element.S9}` },
    { columnDef: 'S10', header: 'S',    cell: (element: any) => `${element.S10}` },
    { columnDef: 'M5', header: 'M',    cell: (element: any) => `${element.M5}` },
    { columnDef: 'T10', header: 'T',    cell: (element: any) => `${element.T10}` },
  ];
  displayedColumns = this.columns.map(c => c.columnDef);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




 // Data View
  leaveSummaryData: any[] = [];
  attendanceRecords: any;



  constructor(private fb: FormBuilder, private http: HttpClient,public notificationService: NotificationService) {}

  ngOnInit(): void {

    this.CID=JSON.parse(sessionStorage.getItem('cid'));


    this.selectionForm = this.fb.group({
      company: ['', Validators.required],
      category: ['', Validators.required],
      group: ['', Validators.required],
      year: ['', Validators.required],
      month: ['', Validators.required],
      department: [''],
      employee: ['',Validators.required]
    });

      this.selectionForm.get('category')?.valueChanges.subscribe(value => {
    if (value === 'By Employee') {
      this.selectionForm.get('month')?.disable();
      this.selectionForm.get('department')?.disable();
      this.selectionForm.get('employee')?.enable();
    } else {
      this.selectionForm.get('month')?.enable();
      this.selectionForm.get('department')?.enable();
      this.selectionForm.get('employee')?.disable();
    }
  });



   this.calendarForm = this.fb.group({
    orders: new FormArray([])
    });

    this.dataViewForm = this.fb.group({ });

    this.loadDropdownData();

  }



  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  get ordersFormArray() {
    return this.calendarForm.get('orders') as FormArray;
  }

  private addCheckboxes() {
    this.leavelist.forEach(() => this.ordersFormArray.push(new FormControl(true)));
  }

   getcolor1(state)
  {
    switch (state.columnDef)
    {
      case 'Name':
       return 'black';
    }
  }
  getcolor2(state)
  {
    switch (state.columnDef)
    {
      case 'Name':
       return 'left';
    }
  }
  getcolor(state)
  {
    for (const key of Object.keys(this.leavelist)) {
      const colorName = this.leavelist[key];
      if(colorName.LID==state)
      {
        return colorName.ColorCode;
      }
    }

    switch (state){
        case '2':
          return '#E8DAEF';
        case '0':
          return '#B0C4DE';
        case 'null':
            return '#F9FAFA';
    }

  }

  loadDropdownData(): void {
    const url = 'http://localhost:55121/api/AttendanceReport/GetAttendanceReport';
    const payload = {
      cid: this.CID,
      Flag: 'PAGELOAD',
      EmpID: 0,
      Month: 1,
      TimeZone: 1,
      checkcode: '',
      Year: 2020,
      Department: 'select',
      Ledger: 0
    };

    this.http.post<any>(url, payload).subscribe(res => {
      if (res.errno === 0 && res.respdata) {

        console.log('Full API response:', res);
        console.log('cid:', this.CID);

        const data = res.respdata;
        this.companies = data.Table.map((c: any) => c.Name);
        this.years = data.Table1.map((y: any) => y.years);
        this.departments = data.Table3.map((d: any) => d.Category1);
        this.groups = data.Table4.map((g: any) => g.LeaveGroupName);
        this.employeeList = data.Table5.map((emp: any) => ({
             LedgerID: emp.LedgerID,
             Name: emp.Name
           }));

        if (data.Table2) {
          this.leavelist = data.Table2.map((item: any) => ({
            LID: item.LID,
            name: item.name,
            ColorCode: item.ColorCode
          }));
        console.log('colour:', data.Table2);
        console.log('leavelist1:', this.leavelist);

          // Also reinitialize the checkbox FormArray for calendarForm
          this.calendarForm.setControl(
            'orders',
            this.fb.array(this.leavelist.map(() => true))
          );
        }
      } else {
        console.error('Error fetching dropdowns:', res.errdesc);
      }
    });
  }


  onNext(): void {
  const selectedYear = this.selectionForm.get('year')?.value;
  const selectedMonth = this.selectionForm.get('month')?.value;
  const selectedCategory = this.selectionForm.get('category')?.value;

  let employeeId: number | null = null;

  if (selectedCategory === 'By Employee') {
    employeeId = this.selectionForm.get('employee')?.value;
  }

  const monthIndex = this.months.indexOf(selectedMonth);
  if (monthIndex !== -1) {
    this.loadAttendanceData(selectedYear, employeeId);
  }
}


loadAttendanceData(year: number,  empId?: number): void {
  const url = 'http://localhost:55121/api/AttendanceReport/GetAttendanceReport';

  const selectedCategory = this.selectionForm.get('category')?.value;
  let flag = '';

  if (selectedCategory === 'By Employee') {
    flag = 'By Employee';
  } else if (selectedCategory === 'All With LeaveData') {
    flag = 'AllWithLeaveData';
  } else {
    flag = 'ALL';
  }

  this.viewFlag = flag;


  const payload = {
    cid: this.CID,
    Flag: flag,
    EmpID: empId || 0,
    Month: 1,
    TimeZone: 1,
    checkcode: '',
    Year: year,
    Department: this.selectionForm.get('department')?.value,
    Ledger: 0
  };

  this.http.post<any>(url, payload).subscribe(res => {
    if (res.errno === 0 && res.respdata) {
      const data = res.respdata;
      console.log(`${flag} Attendance Response:`, data);

        this.leavelist = data.Table2 || [];

      // Summary (Table1)
      this.leaveSummaryData = data.Table1 || [];

      this.leaveSummaryData = this.leaveSummaryData.map(({ disName, IsCarryForward, ...item }) => item);

      // Employee dropdown list
      this.employees = this.leaveSummaryData.map((emp: any, index: number) => ({
        id: emp.EmpID || index,
        name: emp.EmpName?.trim() || `Emp${index + 1}`
      }));

      // Attendance matrix (Table)
      const attendanceMatrix = data.Table || [];
      console.log('Matrix Data:', attendanceMatrix);

      this.datasource = new MatTableDataSource<any>(attendanceMatrix);
      this.datasource.sort = this.sort;
      this.datasource.paginator = this.paginator;

      this.stepper.selectedIndex = 1;
    } else {
      this.notificationService.success(res.errdesc || 'Unable to load attendance data');
    }
  }, error => {
    console.error('Error:', error);
    this.notificationService.success('An unexpected error occurred');
  });
}

processSelectedLeaves(): void {
  const lid = this.calendarForm.value.orders
    .map((checked: boolean, i: number) => checked ? this.leavelist[i].LID : null)
    .filter((v: number | null) => v !== null);

  this.leaveid = lid.toString();

  const selectedLeaves = this.leavelist.filter(item => lid.includes(item.LID));
  this.leavelist1 = selectedLeaves;

}

Submit() {
  const lid = this.calendarForm.value.orders
    .map((checked: boolean, i: number) => checked ? this.leavelist[i].LID : null)
    .filter((v: string | null) => v !== null);

  this.leaveid = lid.toString();

  const newList: Leave[] = [];
  for (const value of lid) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.leavelist.length; i++) {
      if (this.leavelist[i].LID === value) {
        newList.push(this.leavelist[i]);
      }
    }
  }
  this.leavelist1 = newList;

}


}


