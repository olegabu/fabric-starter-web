import {LogManager} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {IdentityService} from './services/identity-service';

let log = LogManager.getLogger('Login');

@inject(IdentityService)
export class Login {

  constructor(identityService) {
    this.identityService = identityService;
  }

  get org() {
    return this.identityService.org;
  }

  login() {
    this.identityService.enroll(this.username, this.password);
  }

}
