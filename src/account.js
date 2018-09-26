import {CRUD} from './crud';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {IdentityService} from './services/identity-service';
import {ChaincodeService} from './services/chaincode-service';

@inject(IdentityService, EventAggregator, ChaincodeService)
export class Account extends CRUD {
  accountTypeByName = {};

  queryAll() {
    let res = [];
    res.push(this.query('account'));

    return Promise.all(res);
  }

  setNew() {
    this.accountEdit = {new: true, value: {}};
  }

}
