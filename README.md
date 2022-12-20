# Forum API

Dicoding - BE Expert Submission

## Setup

### Setup postgresql db

- Login as root user: ```psql --username postgres```

- Create db: ```CREATE DATABASE authapi; CREATE DATABASE authapi_test;```

- Grant access to user 'alvin': ```GRANT ALL PRIVILEGES ON DATABASE authapi, authapi_test TO alvin;```

### Run migration

- App db: ```npm run migrate up```

- Test db: ```npm run migrate:test up```

### Run test (watch mode)

- ```npm run test:watch```

### Run server

- Prod: ```npm run start```

- Dev: ```npm run start:dev```
