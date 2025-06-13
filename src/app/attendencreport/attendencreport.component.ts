/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable quote-props */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-trailing-spaces */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { S } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl  } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { DatecontrolComponent } from 'src/app/components/HR/DateControl/datecontrol/datecontrol.component';
import { NotificationService } from 'src/app/Services/OtherServices/notification.service';
import * as ExcelJS from 'exceljs';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';


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
  @ViewChild('picker') picker: MatDatepicker<Date>;
   fileName: string = 'AttendanceReport.xlsx';
   DataName: string = 'AttendanceDataReport.xlsl';

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
   leaveDates: Set<string> = new Set();
   calendertab: any[] = [];

   todate: any;
    DateTypeFlag: any = '';
    fromdate: any;

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

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;




 // Data View
  leaveSummaryData: any[] = [];
  attendanceRecords: any;



  constructor(private fb: FormBuilder,
    private http: HttpClient,
    public notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,) {}

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
    orders: new FormArray([]),
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
          default:
      return 'center';
    }
  }
 getcolor(value: any): string {
   const lid = Number(value);
  if (!isNaN(lid)) {
    const matchedLeave = this.leavelist1.find(l => Number(l.LID) === lid);
    if (matchedLeave) {
      return matchedLeave.ColorCode;
    }
  }

  switch (String(value)) {
    case '2': return '#E8DAEF';
    case '0': return '#B0C4DE';
    case '10': return '#00c853 ';
    case '15' : return '#ffff00';
    case 'null': return '#F9FAFA';
    default: return '';
  }
}

previousSelections = {
  year: null,
  month: null,
  category: null,
   employee: null
};



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
        this.selectionForm.get('company')?.setValue(this.companies[0]);

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

          this.calendarForm.setControl(
            'orders',
            this.fb.array(this.leavelist.map(() => true))
          );
        }
        const currentYear = new Date().getFullYear();
      if (this.years.includes(currentYear)) {
        this.selectionForm.get('year')?.setValue(currentYear);
      }

      this.selectionForm.get('category')?.setValue('All');

    } else {
        console.error('Error fetching dropdowns:', res.errdesc);
      }
    });
  }

onNext(): void {
  const selectedYear = this.selectionForm.get('year')?.value;
  const selectedMonth = this.selectionForm.get('month')?.value;
  const selectedCategory = this.selectionForm.get('category')?.value;
  const selectedEmployee = this.selectionForm.get('employee')?.value || null;

  let employeeId: number | null = null;
  if (selectedCategory === 'By Employee') {
    employeeId = this.selectionForm.get('employee')?.value;
  }

  const shouldReload =
    this.previousSelections.year !== selectedYear ||
    this.previousSelections.month !== selectedMonth ||
    this.previousSelections.category !== selectedCategory ||
    (selectedCategory === 'By Employee' && this.previousSelections.employee !== selectedEmployee);

  if (shouldReload || !this.leaveSummaryData.length) {
    this.previousSelections = {
      year: selectedYear,
      month: selectedMonth,
      category: selectedCategory,
      employee: selectedEmployee
    };
    this.loadAttendanceData(selectedYear, employeeId);
  }

  // Always move to the next step
  this.stepper.selectedIndex = 1;
}

Refresh(): void {
  this.onNext();
}


loadAttendanceData(year: number, empId?: number): void {
  const url = 'http://localhost:55121/api/AttendanceReport/GetAttendanceReport';

  const selectedCategory = this.selectionForm.get('category')?.value;
  const selectedMonth = this.selectionForm.get('month')?.value;

  let flag = '';
  let month = 1;
  let department = 'select';



const monthIndex = this.months.indexOf(selectedMonth);
month = monthIndex !== -1 ? monthIndex + 1 : 1;

if (selectedCategory === 'By Employee') {
  flag = 'By Employee';
} else {
  flag = selectedCategory === 'All' ? 'ALL' : 'All With LeaveData';
  department = this.selectionForm.get('department')?.value;
}

  // this.leaveSummaryData = [];
  // this.leavelist = [];
  this.datasource = new MatTableDataSource<any>([]);  // reset table data
  this.viewFlag = flag;


  const payload = {
    cid: this.CID,
    Flag: flag,
    EmpID: empId || 0,
    Month: month,
    TimeZone: 1,
    checkcode: '106,118,119,120,121,122,102,123,124,125,126,127,128,129,130,131',
    Year: year,
    Department: '0',
    Ledger: 0
  };

  // this.leaveSummaryData = [];

  this.http.post<any>(url, payload).subscribe(res => {
    if (res.errno === 0 && res.respdata) {
      const data = res.respdata;
      console.log(`${flag} Attendance Response:`, data);

         this.leavelist = (data.Table2 || []).map((item: any) => ({
        LID: item.LID,
        name: item.name,
        ColorCode: item.ColorCode
      }));


      this.calendarForm.setControl(
        'orders',
        this.fb.array(this.leavelist.map(() => true))
      );

      this.leaveSummaryData = data.Table1 || [];

      console.log('Leave Summary Data:', this.leaveSummaryData);

      if (flag === 'By Employee') {
  this.leaveSummaryData = this.leaveSummaryData.map(({ disName, IsCarryForward, ...item }) => item);
      }
  this.processLeaveDates(data.Table3 || []);

console.log('All With LeaveData Table1:', data.Table1);


      this.employees = this.leaveSummaryData.map((emp: any, index: number) => ({
        id: emp.EmpID || index,
        name: emp.EmpName?.trim() || `Emp${index + 1}`
      }));

      const attendanceMatrix = data.Table || [];
      console.log('Matrix Data:', attendanceMatrix);
      this.calendertab = data.Table || [];

      this.datasource = new MatTableDataSource<any>(attendanceMatrix);
      this.datasource.sort = this.sort;
      this.datasource.paginator = this.paginator;

      this.processSelectedLeaves();

      this.stepper.selectedIndex = 1;
    } else {
      this.notificationService.success(res.errdesc || 'Unable to load attendance data');
    }
  }, error => {
    console.error('Error:', error);
    this.notificationService.success('An unexpected error occurred');
  });
}

processLeaveDates(table3: any[]) {
  this.leaveDates = new Set(
    table3.map(item => new Date(item.Date).toDateString())
  );
}

highlightLeaveDates = (date: Date): string => this.leaveDates.has(date.toDateString()) ? 'leave-highlight' : '';

processSelectedLeaves(): void {
  const lid = this.calendarForm.value.orders
    .map((checked: boolean, i: number) => checked ? this.leavelist[i].LID : null)
    .filter((v: number | null) => v !== null);

  this.leaveid = lid.toString();

  this.leaveid = lid.join(',');
  this.leavelist1 = this.leavelist.filter(item => lid.includes(item.LID));
}

Submit() {
  const lid = this.calendarForm.value.orders
    .map((checked: boolean, i: number) => checked ? this.leavelist[i].LID : null)
    .filter((v: string | null) => v !== null);

  this.leaveid = lid.toString();

  const newList: Leave[] = [];
  for (const value of lid) {
    for (let i = 0; i < this.leavelist.length; i++) {
      if (this.leavelist[i].LID === value) {
        newList.push(this.leavelist[i]);
      }
    }
  }
  this.leavelist1 = newList;
}


dataExportexcel(): void {
  if (!this.leaveSummaryData || this.leaveSummaryData.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Convert data directly (dynamic keys)
  const exportData = this.leaveSummaryData.map(row => {
    const rowData: any = {};
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        rowData[key] = row[key] ?? 0; // Replace null/undefined with 0
      }
    }
    return rowData;
  });

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  // === Set column widths based on longest content (including header) ===
  const keys = Object.keys(exportData[0]);
  const colWidths = keys.map(key => ({
    wch: Math.max(
      key.length,
      ...exportData.map(row => String(row[key]).length)
    ) + 2 // Padding
  }));
  ws['!cols'] = colWidths;

  // === Apply styles: Bold header, left-align values ===
  const range = XLSX.utils.decode_range(ws['!ref']!);

  for (let C = range.s.c; C <= range.e.c; ++C) {
    // Header row
    const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
    if (headerCell) {
      headerCell.s = {
        font: { bold: true },
        alignment: { horizontal: 'left' }
      };
    }

    // Data rows
    for (let R = 1; R <= range.e.r; ++R) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
      if (cell) {
        cell.s = {
          alignment: { horizontal: 'left' }
        };
      }
    }
  }

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leave Summary');
  XLSX.writeFile(wb, 'leave_summary_export.xlsx');
}


// exportexcel(): void {
//         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.calendertab);
//         const wb: XLSX.WorkBook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//         XLSX.writeFile(wb, this.fileName);
//     }


hexToARGB(hex: string): string {
  return 'FF' + hex.replace('#', '').toUpperCase(); // Convert #FA8E8E to FFFA8E8E
}

exportexcel(): void {
  if (!this.calendertab || !this.calendertab.length) {
    this.notificationService.success('No calendar data available to export.');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Calendar Export');

  // Add legend rows before headers
 let legendRowCount = 0;
this.leavelist.forEach((leave, index) => {
  const row = worksheet.addRow([leave.name]);
  const colorCell = row.getCell(2);
  row.height = 18;

  if (leave.ColorCode) {
    colorCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.hexToARGB(leave.ColorCode) }
    };
  }

  row.alignment = { vertical: 'middle', horizontal: 'left' };
  legendRowCount++;
});

  // Add headers
  const headers: string[] = this.columns.map(col => String(col.header));
  worksheet.addRow(headers);

  // Center-align header row
 const headerRow = worksheet.getRow(legendRowCount + 1); // ✅ adjusted here
 headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
 headerRow.font = { bold: true };

  // Add data rows
  this.calendertab.forEach(row => {
    let dayCounter = 0;
    const excelRow = worksheet.addRow([]);

    this.columns.forEach((col, i) => {
      const value = col.cell(row);
      const cell = excelRow.getCell(i + 1);

      if (i === 0) {
        // Name column
        cell.value = String(value);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        if (value !== 'null' && value !== null && value !== '') {
          dayCounter++;
          cell.value = dayCounter;
          cell.alignment = { vertical: 'middle', horizontal: 'center' };

          const lid = Number(value);
let hexColor = '';

// 1. Check from API
const matchedLeave = this.leavelist1.find(l => Number(l.LID) === lid);
if (matchedLeave && matchedLeave.ColorCode) {
  hexColor = matchedLeave.ColorCode;
} else {
  // 2. Fallback to static values
  switch (String(value)) {
    case '2': hexColor = '#E8DAEF'; break;
    case '0': hexColor = '#B0C4DE'; break;
    case '10': hexColor = '#00c853'; break;
    case '15': hexColor = '#ffff00'; break;
    case 'null': hexColor = '#F9FAFA'; break;
    default: break;
  }
}

// Apply color if found
if (hexColor) {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: this.hexToARGB(hexColor) }
  };
}
        } else {
          cell.value = '';
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    });
  });

  // Set Name column width based on longest name
  const nameColumnIndex = 1;
  const nameLengths = this.calendertab.map(row => String(this.columns[0].cell(row)).length);
  const maxNameLength = Math.max(...nameLengths, String(this.columns[0].header).length);
  worksheet.getColumn(nameColumnIndex).width = maxNameLength + 5;

  // Set equal width for all day columns
  const dayColumnWidth = 5; // Adjust to look square
  for (let i = 2; i <= this.columns.length; i++) {
    worksheet.getColumn(i).width = dayColumnWidth;
  }

  // Optional: make all rows the same height for squareness
  worksheet.eachRow(row => {
    row.height = 20; // Adjust as needed
  });

  // Export
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    fs.saveAs(blob, this.fileName || 'CalendarExport.xlsx');
  });
}



}


// export interface employee {
//       Name: string;
//   S: any;M: any;T: any;W: any;T1: any;F: any;S1: any;S2: any;M1: any;T2: any;W1: any;T3: any;F1: any;S3: any;S4: any;
//   M2: any;T4: any;W2: any;T5: any;F2: any;S5: any;S6: any;M3: any;T6: any;W3: any;T7: any;F3: any;S7: any;S8: any;
//   M4: any;T8: any;W4: any;T9: any;F4: any;S9: any;S10: any;M5: any;T10: any;

//   Employee: string;
//   Accrual: any;
// AnnualVacation: any;
// CarryForward: any;
// EmpName: any;
// Leave: any;
// Lieu: any;
// Remaining: any;
// RequestedLeave: any;
// SickLeave: any;
// TakenLeave: any;
// Total: any;
// UnpaidLeave: any;
// WorkFromHome: any;
// }



