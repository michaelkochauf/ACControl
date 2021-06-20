import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Room {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  username: string;
  password: string;
  acId: number = 1;

  rooms: Room[] = [
    {viewValue: 'Michael', value: 1},
    {viewValue: 'Engelbert&Monika', value: 2}
  ];

  isLoading = false;
  isLoadingSuccessful = false;
  hasError = false;
  errorMessage = "";

  constructor(private http: HttpClient, private cookieService: CookieService)
  {
    
  }
  ngOnInit(): void {
    let user = this.cookieService.get("AC_User");
    let pw = this.cookieService.get("AC_PW");

    if(user)
    {
      this.username = user;
    }

    if(pw)
    {
      this.password = pw;
    }
  }

  public turnOn()
  {
    this.send(true);
  }

  public turnOff()
  {
    this.send(false);
  }

  private send(value: boolean)
  {
    this.isLoading = true;
    let url = "https://impossible-geode-mockingbird.glitch.me/status/"+this.acId;
    let body = {
      status: value,
      username: this.username,
      password: this.password
    };

    this.http.post(url,body).subscribe(response => {
      this.isLoading = false;
      this.hasError = false;
      this.isLoadingSuccessful = true;
      setTimeout(() => {
        this.isLoadingSuccessful = false;
      },5000);
      this.cookieService.set("AC_User",this.username);
      this.cookieService.set("AC_PW",this.password);
    },error =>{
      if(error.status === 403)
      {
        this.hasError = true;
        this.errorMessage = "User oder Passwort ist falsch!";
      }
      this.isLoading = false;
    })

  }
}
