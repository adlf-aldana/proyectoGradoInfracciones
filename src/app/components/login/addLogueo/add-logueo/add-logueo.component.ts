import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-logueo',
  templateUrl: './add-logueo.component.html',
  styleUrls: ['./add-logueo.component.css']
})
export class AddLogueoComponent implements OnInit {

  public email: string;
  public password: string;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  onSubmitLogin(){        
    this.authService.loginEmail(this.email, this.password)
    .then((res) => {
      this.router.navigate(['/registro']);
    }).catch((err)=>{
      console.log(err);
      
    })
  }

}
