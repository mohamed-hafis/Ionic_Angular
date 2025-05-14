/* eslint-disable no-trailing-spaces */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { S } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl  } from '@angular/forms';



@Component({
  selector: 'app-attendencreport',
  templateUrl: './attendencreport.component.html',
  styleUrls: ['./attendencreport.component.css']
})
export class AttendencreportComponent {
  selectionForm!: FormGroup;
  calendarForm!: FormGroup;
  dataViewForm!: FormGroup;

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
  selectedMonth = '';
  selectedYear = 0;
 monthDays: { day: number, date: string, weekday: number }[] = [];
  leavelist: { name: string; ColorCode: string }[] = [];
leaveDays: { empId: number; date: string; type: string }[] = [];

 employees: { id: number, name: string }[] = [];

 statusCodeColor = {
  5: '#e91e63',    // Leave
  2: '#9c27b0',    // Weekend
  106: '#03a9f4',  // Public Holiday
  0: '#ffffff'     // No entry
};
 calendarData: any[] = [];





 // Data View
  leaveSummaryData: any[] = [];



  constructor(private fb: FormBuilder, private http: HttpClient) {}

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

    this.calendarForm = this.fb.group({ });
    this.dataViewForm = this.fb.group({ });

    this.loadDropdownData();
    this.generateMonthDays(new Date().getFullYear(), new Date().getMonth());
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


        if (data.Table2 && data.Table2.length) {
          this.leavelist = data.Table2.map((item: any) => ({
            name: item.name,
            ColorCode: item.ColorCode
          }));
        console.log('colour:', data.Table2);
        console.log('leavelist1:', this.leavelist);

          // Also reinitialize the checkbox FormArray for calendarForm
          this.calendarForm.setControl(
            'orders',
            this.fb.array(this.leavelist.map(() => false))
          );
        }

          if (data.Table5 && data.Table5.length) {
      this.employeeList = data.Table5.map((emp: any) => ({
        LedgerID: emp.LedgerID,
        Name: emp.Name
      }));
    }

      } else {
        console.error('Error fetching dropdowns:', res.errdesc);
      }
    });
  }


  onNext(): void {
  const selectedMonthName = this.selectionForm.get('month')?.value;
  const selectedYear = this.selectionForm.get('year')?.value;

  this.selectedMonth = selectedMonthName;
  this.selectedYear = selectedYear;

  const monthIndex = this.months.indexOf(selectedMonthName); // 0-based index
  if (monthIndex === -1) return;

   const selectedCategory = this.selectionForm.get('category')?.value;
  if (selectedCategory === 'By Employee') {
    const employeeId = this.selectionForm.get('employee')?.value; // Get the selected employee's ID
    this.loadAttendanceData(selectedYear, monthIndex + 1, employeeId); // +1 for 1-based month
  } else {
    this.generateMonthDays(selectedYear, monthIndex);
    this.loadAttendanceData(selectedYear, monthIndex + 1); // +1 for 1-based month
  }
}

 generateMonthDays(year: number, monthIndex: number): void {
  this.monthDays = [];
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Leading blanks
  for (let i = 0; i < firstDay; i++) {
    this.monthDays.push({ day: 0, date: '', weekday: -1 });
  }

for (let i = 1; i <= daysInMonth; i++) {
  const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
  this.monthDays.push({ day: i, date: dateStr, weekday: new Date(dateStr).getDay() });
}

}


// Function to generate the calendar matrix for a month
generateCalendar(year: number, month: number) {
  // Get the number of days in the current month
  const daysInMonth = new Date(year, month, 0).getDate(); // e.g., for February: new Date(2025, 2, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // e.g., Sunday = 0, Monday = 1, etc.

  // Initialize the calendar matrix (weeks)
  const calendarMatrix: number[][] = [];

  // Fill in the first week with leading blanks for the first day of the month
  let week: number[] = new Array(firstDayOfMonth).fill(null); // Start with empty cells for the first day
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) { // If the week is full (7 days)
      calendarMatrix.push(week);
      week = []; // Start a new week
    }
  }
  // If there are leftover days in the final week, add them
  if (week.length > 0) {
    calendarMatrix.push(week);
  }

  return calendarMatrix;
}


loadAttendanceData(year: number, month: number, empId?: number): void {
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

  const payload = {
    cid: this.CID,
    Flag: flag,
    EmpID: empId || 0,
    Month: month,
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

      // Setup employees
      this.leaveSummaryData = data.Table1 || [];
      this.employees = this.leaveSummaryData.map((emp: any, index: number) => ({
        id: index,
        name: emp.EmpName?.trim() || `Emp${index + 1}`
      }));

       const attendanceMatrix = data.Table || [];
      console.log('Matrix Data:', attendanceMatrix);

      // Generate calendar for the specified month and year
      const calendarMatrix = this.generateCalendar(year, month);
      console.log('Generated Calendar:', calendarMatrix);

      // Now map the attendance data into the generated calendar
      // (You will need to correlate dates with attendance records here)
    } else {
      console.error('Error loading attendance data:', res.errdesc);
    }
  });
}


  get ordersFormArray(): FormArray {
    return this.calendarForm.get('orders') as FormArray;
  }

 onLeaveTypeChange(index: number): void {
  const selectedTypes = this.leavelist
    .map((leave, i) => this.ordersFormArray.at(i).value ? leave.name : null)
    .filter(name => name !== null);

  console.log('Active leave filters:', selectedTypes);

  // Filter attendance records accordingly (optional if you're storing them already)
  // But you’ll show/hide colors via `getDayColor` and `getDayLabel`
}



 toggleLeave(empId: number, date: string): void {
   const existingIndex = this.leaveDays.findIndex(
    d => d.empId === empId && d.date === date
  );

  if (existingIndex !== -1) {
    this.leaveDays.splice(existingIndex, 1);
  } else {
    const selectedType = this.getSelectedLeaveType();
    if (selectedType) {
      this.leaveDays.push({ empId, date, type: selectedType });
    }
  }
}


  getSelectedLeaveType(): string | null {
    const index = this.ordersFormArray.controls.findIndex(c => c.value === true);
    return index !== -1 ? this.leavelist[index].name : null;
  }

  getDayColor(empId: number, date: string): string {
  if (!date) return 'transparent';

  const entry = this.leaveDays.find(d => d.empId === empId && d.date === date);

  if (entry) {
    const selectedIndex = this.leavelist.findIndex(l => l.name === entry.type);
    const isSelected = selectedIndex !== -1 && this.ordersFormArray.at(selectedIndex).value;

    if (isSelected) {
      return this.leavelist[selectedIndex].ColorCode;
    }
  }

  // Default for Sunday
  const dateObj = new Date(date);
  if (dateObj.getDay() === 0) {
    return '#E8DAEF';
  }

  return 'transparent';
}


  getFormControl(i: number): FormControl {
    return this.ordersFormArray.at(i) as FormControl;
  }

  // Calender View

getCalendarDays(): number[] {
  const selectedCategory = this.selectionForm.get('category')?.value;
  if (selectedCategory === 'By Employee') {
    return Array.from({ length: 31 }, (_, i) => i + 1); // always 31
  } else {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const daysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }
}

getCalendarRows(): Array<{ label: string; id: number; dates: string[] }> {
  const rows = [];
  const selectedCategory = this.selectionForm.get('category')?.value;

  if (selectedCategory === 'By Employee') {
    const emp = this.employeeList.find(e => e.LedgerID === this.selectionForm.get('employee')?.value);
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(this.selectedYear, m + 1, 0).getDate();
      const dates = Array.from({ length: 31 }, (_, d) => {
        const day = d + 1;
        return day <= daysInMonth ? `${this.selectedYear}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
      });
      rows.push({ label: this.months[m], id: emp?.LedgerID || 0, dates });
    }
  } else {
    for (const emp of this.employees) {
      const monthIndex = this.months.indexOf(this.selectedMonth);
      const daysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();
      const dates = Array.from({ length: daysInMonth }, (_, d) =>
        `${this.selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(d + 1).padStart(2, '0')}`
      );
      rows.push({ label: emp.name, id: emp.id, dates });
    }
  }

  return rows;
}

getDayLabel(empId: number, date: string): string {
  const leave = this.leaveDays.find(d => d.empId === empId && d.date === date);
  return leave ? leave.type[0] : ''; // First letter of leave type
}

getLabel(code: number | string): string {
  const labels: any = {
    5: 'Leave',
    2: 'Weekend',
    106: 'Public Holiday',
    0: 'None'
  };
  return labels[code] || 'Unknown';
}

loadCalendarData(year: number, month: number, empId: number): void {
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


  const payload = {
   cid: this.CID,
    Flag: flag,
    EmpID: empId || 0,
    Month: month,
    TimeZone: 1,
    checkcode: '',
    Year: year,
    Department: this.selectionForm.get('department')?.value,
    Ledger: 0
  };

  this.http.post<any>(url, payload).subscribe(res => {
    if (res?.errno === 0 && res?.respdata?.Table) {
      const tableData = res.respdata.Table;
      this.calendarData = [];

      tableData.forEach((monthEntry: any) => {
        const days: Array<{ day: number, value: number }> = [];
        let dayCounter = 1;

        for (const [key, value] of Object.entries(monthEntry)) {
          if (key !== 'Name' && value !== null) {
            days.push({
              day: dayCounter,
              value: value as number
            });
            dayCounter++;
          }
        }

        this.calendarData.push({
          month: monthEntry.Name,
          days
        });
      });

      console.log('Parsed calendar data:', this.calendarData);
    } else {
      console.error('Error loading calendar data:', res?.errdesc);
    }
  });
}

}


