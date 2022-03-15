import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignin from '@okta/okta-signin-widget';
import { throws } from 'assert';
import myAppConfig from '../../config/my-app-config'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;
  constructor(private octaOuthService: OktaAuthService) { 
    this.oktaSignin= new OktaSignin({
      logo: 'assets/images/logo.png',
      features: {
          registration: true
      },
      baseUrl: myAppConfig.oidc.issuer.split('.ouath2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
       pkce: true,
       issuer: myAppConfig.oidc.issuer,
       scopes: myAppConfig.oidc.scopes
      }

    });
  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
    el: '#okta-sign-in-widget'},
    (response) => {
      if(response.status==='SUCCESS'){
        this.octaOuthService.signInWithRedirect();

      }
    },
    (error) =>{
      throw error;
    }
    )
  }

}