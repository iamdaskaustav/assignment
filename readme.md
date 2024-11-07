### Stock Order Allocator

Automate investments (model portfolios) offering.

## Requirements

For development, you will only need Node.js, VS Code and Postman.

### Node

- ### Node installation on Windows

Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have git available in your PATH,
npm` might need it (You can find git [here](https://git-scm.com/))

- #### Node installation on Ubuntu

You can install nodejs and npm easily with apt install, just run the following commands.

    $ sudo apt install nodejs
    $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the
  [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

the installation was successful, you should be able to run the following command.

    $ node --version
    v20.18.0


    $ npm --version
    10.8.2

## Install

Clone github repository and then

    $ cd order-allocator
    $ npm install

## Build

    $ npm run build
    $ npm run start

### Run

Open Postman and import postman crul, change api payload if needed and then click send

    curl --location --request POST 'http://localhost:3000/order-allocate' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "portfolio": [
            {
                "symbol": "AAPL",
                "weight": 51,
                "currentPrice": 156
            },
            {
                "symbol": "TSLA",
                "weight": 45
            }
        ],
        "orderType": "Buy",
        "totalAmount": 190
    }'

## Api

Server Default port is set to 3000, if default port is unavailable or busy then please change port from .env file in project folder. upon change port in .env file please again complete Build process.

## Endpoint:

POST http://localhost:3000/order-allocate

Payload:

    {
        "portfolio": [
            {
                "symbol": "AAPL",
                "weight": 51,
                "currentPrice": 156
            },
            {
                "symbol": "TSLA",
                "weight": 45
            }
        ],
        "orderType": "Buy",
        "totalAmount": 190
    }

### Sum of the weight of total stock should not be more than 100

Expected Output:

    {
        "success": true,
        "orderType": "Buy",
        "balance": 190,
        "actuallyInvested": 182.376,
        "remainBalance": 7.624,
        "order": [
            {
                "symbol": "AAPL",
                "moneyAllocated": 96.9,
                "price": 156,
                "quantity": 0.621,
                "totalInvested": 96.876
            },
            {
                "symbol": "TSLA",
                "moneyAllocated": 85.5,
                "price": 100,
                "quantity": 0.855,
                "totalInvested": 85.5
            }
        ]
    }

## Library Used

1. express 4.21.1
2. dotenv 16.4.5

### Development library used

1. @types/express 5.0.0
2. @types/node 22.8.7
3. nodemon 3.1.7
4. tsInode 0.9.2
5. typescript 5.6.3
