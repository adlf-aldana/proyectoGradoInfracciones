import {AuthService} from '../../services/auth.service'
import * as firebase from 'firebase/app'
import {Router} from '@angular/router'
export class ObteniendoDatosPersonal {

    constructor(
        // public authService: AuthService,
        // public router: Router
    ){
    }

    datosPersonal: {
        nombre: any;
        apPaterno: any;
        apMaterno: any;
        cedula: any;
        cargo: any;
      }

    datosPersonalPolicial(){
        console.log('otra clase');
        
    //     let correo = this.authService.correo;
        
    //     var ref = firebase.database().ref('gestionUsuarios')
    //     var ref2 = firebase.database().ref('personalTransito')
    //     if(correo == null)
    //     {
    //       // console.log('error');
    //       this.router.navigate(['/']);
    //     }else{
    
    //       ref.orderByChild('correoUsuario').equalTo(correo).on("child_added", snap => {
            
    //         ref2.orderByChild('ciPersonal').equalTo(snap.val().ciUsuario).on("child_added", snap2 => {
    //           this.datosPersonal = {
    //           cedula: snap.val().ciUsuario,
    //           nombre: snap2.val().nombrePersonal,
    //           apPaterno: snap2.val().apPaternoPersonal,
    //           apMaterno: snap2.val().apMaternoPersonal,
    //           cargo: snap2.val().cargo
    //           }
    //         })
    //       }); 
    //     }
      }
}
