import 'bootstrap';
import {I18N} from 'aurelia-i18n';
import {LogManager} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {IdentityService} from './services/identity-service';
import {SocketService} from './services/socket-service';

let log = LogManager.getLogger('App');

@inject(I18N, IdentityService, SocketService)
export class App {
  constructor(i18n, identityService, socketService) {
    this.i18n = i18n;
    // this.i18n.setLocale(navigator.language || 'en');
    this.i18n.setLocale('ru');
    this.identityService = identityService;
    this.socketService = socketService;
  }

  configureRouter(config, router) {
    config.title = this.i18n.tr('appName');

    let routes = [
      {route: ['', 'home'], name: 'home', moduleId: './home', nav: true, title: this.i18n.tr('home')},
      {route: ['account'], name: 'account', moduleId: './account', nav: true, title: this.i18n.tr('accountList')}
     ];

    config.map(routes);
    this.router = router;
  }

  attached() {
    this.username = this.identityService.username;
    this.org = this.identityService.org;

    this.socketService.subscribe();
  }

  detached() {
    log.debug('detached');
    // this.socketService.disconnect();
  }

  logout() {
    this.identityService.logout();
  }

}
