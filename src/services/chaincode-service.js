import {LogManager} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {IdentityService} from './identity-service';
import {AlertService} from './alert-service';
import {Config} from '../config';

let log = LogManager.getLogger('ChaincodeService');

const baseUrl = Config.getUrl('channels/');

@inject(HttpClient, IdentityService, AlertService)
export class ChaincodeService {

  constructor(http, identityService, alertService) {
    this.identityService = identityService;
    this.http = http;
    this.alertService = alertService;
  }

  fetch(url, params, method, org, username) {
    log.debug('fetch', params);
    log.debug(JSON.stringify(params));

    return new Promise((resolve, reject) => {
      const jwt = IdentityService.getJwt(org, username);

      let promise;

      if (method === 'get') {
        let query = '';
        if (params) {
          query = '?' + Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
        }

        promise = this.http.fetch(`${url}${query}`, {
          headers: {
            'Authorization': 'Bearer ' + jwt
          }
        });
      } else {
        promise = this.http.fetch(url, {
          method: method,
          body: json(params),
          headers: {
            'Authorization': 'Bearer ' + jwt
          }
        });
      }

      promise.then(response => {
        response.json().then(j => {
          log.debug('fetch', j);

          if (!response.ok) {
            const msg = `${response.statusText} ${j}`;

            if (response.status === 401) {
              this.alertService.info('session expired, logging you out');
              this.identityService.logout();
            } else {
              this.alertService.error(msg);
            }

            reject(new Error(msg));
          } else {
            resolve(j);
          }
        });

      }).catch(err => {
          this.alertService.error(`caught ${err}`);
          reject(err);
        });
    });
  }

  getChannels(org, username) {
    log.debug(`getChannels ${org} ${username}`);

    const url = baseUrl;

    return new Promise((resolve, reject) => {
      this.fetch(url, null, 'get', org, username).then(j => {
        const channels = j.map(o => {
          return o.channel_id;
        });

        resolve(channels);
      })
        .catch(err => {
          reject(err);
        });
    });
  }

  query(channel, chaincode, func, args, org, username) {
    log.debug(`query channel=${channel} chaincode=${chaincode} func=${func} ${org} ${username}`, args);

    const peerOrg = org ? org.name : this.identityService.org;
    const url = org ? `${org.url}/channels/` : baseUrl;

    const params = {
      fcn: func,
      args: json(args),
      // peer: `${peerOrg}/peer0`
    };

    return new Promise((resolve, reject) => {
      this.fetch(`${url}${channel}/chaincodes/${chaincode}`, params, 'get', org, username).then(j => {
        // log.debug('query', j);
        resolve(JSON.parse(j[0]));
      }).catch(err => {
          reject(err);
        });
    });
  }

  invoke(channel, chaincode, func, args, org, username) {
    log.debug(`invoke channel=${channel} chaincode=${chaincode} func=${func} ${org} ${username}`, args);

    const peerOrg = org ? org.name : this.identityService.org;
    const url = org ? `${org.url}/channels/` : baseUrl;

    let peers = [`${peerOrg}/peer0`];

    //TODO make this optional; loop thru all orgs in the channel not only 2
    // invoke both orgs of bilateral channel
    /*const orgs = channel.split('-');
    if(orgs.length === 2) {
      peers = [`${orgs[0]}/peer0`,`${orgs[1]}/peer0`];
    }*/

    const params = {
      fcn: func,
      args: args,
      // peers: peers
    };

    return new Promise((resolve, reject) => {
      this.fetch(`${url}${channel}/chaincodes/${chaincode}`, params, 'post', org, username).then(j => {
        resolve(j.transaction);
      })
        .catch(err => {
          reject(err);
        });
    });
  }

}
