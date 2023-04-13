import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../core/_services/login.service';
declare var alertify: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formSubmitted = false;
  UserData: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: LoginService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  myForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginWAG() {
    // this.spinner.show();
    if (this.myForm.invalid) {
      this.formSubmitted = true;
    } else {
      const logObj = {
        userName: this.myForm.value.username,
        password: this.myForm.value.password,
      };
      this.service.loginUser(logObj).subscribe(
        (data:any) => {
          console.log('service data', data);
          this.UserData = data;

          localStorage.setItem('Cora_Id', this.UserData.cora_Id);
          localStorage.setItem('UserToken', this.UserData.token);
          localStorage.setItem('UserName', this.UserData.username);
          localStorage.setItem('UserTitle', this.UserData.title);
          localStorage.setItem('UserDisplay', this.UserData.displayname);
          localStorage.setItem('UserId', this.UserData.uId);

          console.log('Data ', this.UserData);
          alertify.set('notifier', 'position', 'top-right');
          alertify.success('User Login Successfully');
          // alert("Login Successfull.")
          this.myForm.reset();
          this.formSubmitted = false;
          this.router.navigate(['/deallog']);
          // this.spinner.hide();
        },
        (error:any) => {
          const errorMsg = error.error;
          console.log(errorMsg);
          if (errorMsg == 'User Not Found') {
            alert('User Not Found.');
          } else {
            if (errorMsg == 'Password Incorrect') {
              alert('Password Incorrect');
            }
          }
        }
      );
      this.myForm.reset();
    }
  }
}
