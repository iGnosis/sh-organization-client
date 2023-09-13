# Sound Health - Organization Client

This repository contains the front-end code for Sound Health Organization Client.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3
## Getting Started

### Requirements

[Node.js](https://nodejs.org/en) >= v12.22

### Local setup

1. Use the package manager [npm](https://www.npmjs.com/) to install the required dependencies
```bash
npm install
```
2. Make necessary changes to the environment variables in `src/environments/local/environment.local.pure.ts`
3. You can start the local server by running the following command:
```bash
npm run start:local-pure
```
This will start the local server, and you can access the application in your web browser at http://localhost:4200

### Build for Production

1. Create a copy of environment file `environment.ts` into the `src/environments` directory and name it `environment.prod.ts` and make necessary changes to the environment variables
2. Run the following command to build the application for production:
```bash
npm run build
```

This will create a `dist` directory in your project containing the production-ready files which can be uploaded to any static site hosting service of choice.

## Contributing

WIP

## License

WIP
