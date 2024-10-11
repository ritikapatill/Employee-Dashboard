import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-emp-add',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;

  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      _id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      company: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(1)]],
      package: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.empForm.patchValue(this.data);
  }

  onFormSubmit() {
    
    if (this.empForm.valid) {
      console.log("valid");
      
      if (this.empForm.value._id) {
        console.log("edit");
        
        this._empService
          .updateEmployee(this.empForm.value._id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              // this._coreService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error('Error updating employee:', err);
            },
          });
      } else {
        console.log("add");
        const emp = {
          firstName: this.empForm.value.firstName,
          lastName: this.empForm.value.lastName,
          email: this.empForm.value.email,
          dob: this.empForm.value.dob,
          gender: this.empForm.value.gender,
          education: this.empForm.value.education,
          company: this.empForm.value.company,
          experience: this.empForm.value.experience,
          package: this.empForm.value.package,
        }
        console.log(emp);
        
        this._empService.addEmployee(emp).subscribe({
          next: (val: any) => {
            // this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error('Error adding employee:', err);
          },
        });
      }
    } else {
      this.empForm.markAllAsTouched();
    }
  }
}
