import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EmployeeService } from 'src/services/employee.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-emplist',
  templateUrl: './emplist.component.html',
  styleUrls: ['./emplist.component.scss'],
  standalone: false,
})
export class EmplistComponent  implements OnInit {
  employees: any[] = [];
  editingEmployeeId: string | null = null; // To track the employee being edited
  updatedEmployee: any = {}; // Temporary storage for the edited employee data
  filteredEmployees: any[] = []; // To store filtered employees
  searchTerm: string = ''; // Store search query

  constructor(private employeeService: EmployeeService,  private alertController: AlertController, private toastController: ToastController, private router: Router) { }

  ngOnInit() {

    this.loadEmployees();
  }

  navigateToRegister() {
    this.router.navigate(['/register']); // Ensure this path matches your registration page route
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(
      (response: any) => {
        this.employees = response.RegEmp;
        this.filteredEmployees = [...this.employees];
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  searchEmployees() {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.employees]; // Show all employees if search is empty
    } else {
      // Filter employees based on search term (by name, DOB, or gender)
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.employees.filter(employee => {
        return (
          employee.Id.toString().toLowerCase().includes(searchLower) ||
          employee.Firstname.toLowerCase().includes(searchLower) ||
          employee.Lastname.toLowerCase().includes(searchLower) ||
          (employee.DOB && employee.DOB.includes(searchLower)) || // Check if DOB contains the search term
          (employee.Gender && employee.Gender.toLowerCase() === (searchLower)) || // Check gender
          (employee.Mobileno && employee.Mobileno.toString().includes(searchLower)) || // Check mobile number
          (employee.Email && employee.Email.toLowerCase().includes(searchLower)) // Check email
        );
      });
    }
  }

 // Method for Edit
 editEmployee(employee: any) {
  this.editingEmployeeId = employee.Id; // Set the employee being edited
  this.updatedEmployee = { ...employee }; // Create a copy to work with the data
}

saveEmployee() {
  if (this.editingEmployeeId !== null) {
    this.alertController
      .create({
        header: 'Confirm Update',
        message: 'Are you sure you want to save the changes for this employee?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Update cancelled');
            },
          },
          {
            text: 'Save',
            handler: () => {
              this.employeeService.updateEmployee(this.updatedEmployee).subscribe(
                async (response: any) => {
                  console.log('Employee updated successfully', response);
                  this.loadEmployees(); // Refresh the employee list after update
                  this.editingEmployeeId = null; // Stop editing

                  // Show success alert
                  const toast = await this.toastController.create({
                    message: 'Employee updated successfully!',
                    duration: 2000, // Duration in milliseconds
                    color: 'success', // Color of the toast
                    position: 'bottom', // Position of the toast
                  });
                  await toast.present();
                },
                (error) => {
                  console.error('Error saving employee:', error);
                  if (error.status === 400) {
                    this.alertController
                      .create({
                        header: 'Validation Error',
                        message: error.error.Message,
                        buttons: ['OK'],
                      })
                      .then((alert) => alert.present());
                  }
                }
              );
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}

  // Method for Cancel Edit
  cancelEdit() {
    if (this.editingEmployeeId !== null) {
      this.updatedEmployee = {}; // Clear the temporary storage
      this.editingEmployeeId = null; // Stop editing
    }
  }
// Method for Delete
  deleteEmployee(employeeId: string) {
    this.alertController
      .create({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this employee?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Deletion cancelled');
            },
          },
          {
            text: 'Delete',
            handler: () => {
              this.employeeService.deleteEmployee(employeeId).subscribe(
                async (response: any) => {
                       console.log('Employee deleted successfully', response);
                  this.loadEmployees(); // Refresh the employee list after deletion

                  const toast = await this.toastController.create({
                    message: 'Employee deleted successfully',
                    duration: 2000, // Duration in milliseconds
                    color: 'danger', // Color of the toast
                    position: 'bottom', // Position of the toast
                  });
                  await toast.present();

                },
                (error) => {
                  console.error('Error deleting employee:', error);
                }
              );
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}

