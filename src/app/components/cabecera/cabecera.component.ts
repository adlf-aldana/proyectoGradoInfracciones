import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import * as firebase from 'firebase/app'

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  public isLogin: boolean = false;
  public isAdmin: any = null;
  public isPolicia: any = null;

  public nombreUsuario: string;
  public emailUsuario: string;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.onCheckUser()
    this.authService.getAuth().subscribe(auth =>{      
   
      if(auth){
        this.isLogin=true;
        
        // this.nombreUsuario=auth.displayName;
        this.emailUsuario=auth.email;

        var ref = firebase.database().ref('gestionUsuarios');
        // ref.orderByChild('correoUsuario').equalTo(this.authService.correo).on("child_added", snap => {
        ref.orderByChild('correoUsuario').equalTo(this.emailUsuario).on("child_added", snap => {
          // console.log(snap.val().cargoUsuario);
          
          if (snap.val().cargoUsuario === 'Administrador') {
            // console.log('es administrador');
            this.isAdmin = true
          }
          else {
            // console.log('no es administrador');
            this.isPolicia = true
          }
          })
        }
      })
      
    
  }

  onCheckUser(): void{
    if(this.authService.getAuth()==null){
      this.isLogin == false
    }else{
      this.isLogin == true
    }
  }
  onClickLogout(){
    this.authService.logOut();
  }
}
