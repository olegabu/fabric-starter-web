# Web application for [Fabric Starter](https://github.com/olegabu/fabric-starter) decentralized application 

Sample application built with [Aurelia](https://aurelia.io/) to connect to 
[Fabric REST API server](https://github.com/MaxXx1313/fabric-rest) and transact on 
[Hyperledger Fabric](https://www.hyperledger.org/projects/fabric) blockchain network.

## Install and build

Install prerequisites: Node.js. This example is for Ubuntu 18:
```bash
sudo apt install nodejs npm
```

Install Aurelia CLI
```bash
npm install aurelia-cli -g
```

Build
```bash
npm install && au build
```
## Create and start the network

Follow instructions on  [Fabric Starter](https://github.com/olegabu/fabric-starter) to create a network of four organizations

- orderer
- a
- b
- c

and channels
- common
- a-b
- a-c
- b-c

## Connect to the API servers

Once the network is up each organization's REST API servers will be running and accessible by urls

- a [http://localhost:3000](http://localhost:3000)
- b [http://localhost:3001](http://localhost:3001)
- c [http://localhost:3002](http://localhost:3002)

## Serve by the API servers

Build to be served by fabric-rest servers of fabric-starter network, assume it's cloned into `../fabric-starter`:
```bash
au build --env stage \
&& cp index.html ../fabric-starter/www/ \
&& cp -r scripts ../fabric-starter/www/ \
&& mkdir -p ../fabric-starter/www/src && cp -r src/locales ../fabric-starter/www/src
```

## Development

Run in development
```bash
au run --watch
```
Your web application served by `au run` in development at [http://localhost:9000](http://localhost:9000) will connect
to the API server of org *a* [http://localhost:3000](http://localhost:3000).



