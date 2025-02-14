import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/services/employee.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent  implements OnInit {
  employee = {
    id: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    mobileNo: '',
  };

  errorMessages = {
    id: '',
    email: '',
    mobileNo: '',
    existingEmail: '',
    apiError: ''
  };

  constructor(private router: Router, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.generateEmployeeId();
  }

  generateEmployeeId() {
    this.employeeService.generateNextId().subscribe(
      (response: any) => {
        this.employee.id = response.nextId;
      },
      (error) => {
        console.error('Error fetching generated ID:', error);
        this.errorMessages.id = 'Error generating ID. Please try again later.';
      }
    );
  }

  validateInputs(): boolean {
    let isValid = true;

    // Validate ID
    if (!/^IT\d{3}$/.test(this.employee.id)) {
      this.errorMessages.id = "ID must start with 'IT' followed by 3 digits (e.g., IT001).";
      isValid = false;
    } else {
      this.errorMessages.id = '';
    }

    // Validate Email
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(this.employee.email)) {
      this.errorMessages.email = 'Email must end with @gmail.com.';
      isValid = false;
    } else {
      this.errorMessages.email = '';
    }

    // Validate Mobile Number
    if (!/^\d{10}$/.test(this.employee.mobileNo)) {
      this.errorMessages.mobileNo = 'Mobile number must be exactly 10 digits.';
      isValid = false;
    } else {
      this.errorMessages.mobileNo = '';
    }

    return isValid;
  }

  onSubmit() {
    if (!this.validateInputs()) {
      console.error('Validation failed:', this.errorMessages);
      return;
    }

    this.employeeService.registerEmployee(this.employee).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful!');
        this.errorMessages.existingEmail = '';  // Clear any previous errors
        this.router.navigate(['/emplist']);
      },
      (error) => {
        console.error('Error during registration:', error);

        // Display API validation errors
        if (error.status === 400 || error.status === 409)
          {
          if (error.error)
             {
            // Check for validation errors and display them in the errorMessages object
            if (error.error.includes("The ID already exists.")) {
              this.errorMessages.id = "The ID already exists.";
            }
            if (error.error.includes("The Email already exists.")) {
              this.errorMessages.existingEmail = "The Email already exists.";
            }
            if (error.error.includes("The MobileNo must be exactly 10 digits")) {
              this.errorMessages.mobileNo = "The MobileNo must be exactly 10 digits.";
            }
          }
        } else {
          this.errorMessages.apiError = 'An error occurred during registration. Please try again.';
        }
      }
    );

    console.log('Registration Data:', this.employee);
  }
}
