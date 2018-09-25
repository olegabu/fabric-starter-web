import {LogManager} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {IdentityService} from './services/identity-service';
import {ChaincodeService} from './services/chaincode-service';
import {ConfigService} from './services/config-service';

let log = LogManager.getLogger('Home');

@inject(IdentityService, EventAggregator, ChaincodeService, ConfigService)
export class Home {
  orgList = [];
  channelList = [];

  constructor(identityService, eventAggregator, chaincodeService, configService) {
    this.identityService = identityService;
    this.eventAggregator = eventAggregator;
    this.chaincodeService = chaincodeService;
    this.configService = configService;
  }

  attached() {
    // this.queryOrgs();
    this.queryChannels();
    this.queryAll();

    this.subscriberBlock = this.eventAggregator.subscribe('block', o => {
      log.debug('block', o);
      this.queryAll();
    });
  }

  detached() {
    this.subscriberBlock.dispose();
  }

  queryAll() {
    this.queryStorage();
  }

  queryStorage() {
    this.chaincodeService.query('common', 'reference', 'list', ['storage']).then(o => {
      this.storageList = o;
    });
  }

  queryOrgs() {
    this.configService.get().then(config => {
      let networkConfig = config['network-config'];
      Object.keys(networkConfig).forEach(k => {
        if(k !== 'orderer') {
          this.orgList.push({key: k, value: networkConfig[k]});
        }
      });
    });
  }

  queryChannels() {
    this.chaincodeService.getChannels().then(channels => {
      this.channelList = channels;
    });
  }
}
