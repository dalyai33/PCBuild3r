# Project Overview

This project consists of a main program (`Main-Program-C361`) and four microservices (`MicroserviceA`, `MicroserviceB`, `MicroserviceC`, and `MicroserviceD`). Each component has its own dependencies and instructions for running.

---

## Dependencies

### MainProg
- Node.js
- Nodemon
- express.js
- cookie-parser
- express-handlebars

### MicroserviceA
- Python

### MicroserviceB, MicroserviceC, MicroserviceD
- Node.js

---

## Installation

### Main-Program-C361
1. Install Node.js if not already installed.
2. Navigate to the `MainProg` folder.
3. Install dependencies:

```bash
npm install
```

## Running the Programs

### Main-Program-C361
```bash npm run dev```
or
```bash nodemon server.js ```

### microserviceA
```bash cd microserviceA //in another terminal
python microserviceA.py ```

### microserviceB
cd microserviceB in another terminal
python microserviceB.js

### microserviceC
cd microserviceC in another terminal
python microserviceC.js

### microserviceD
cd microserviceD in another terminal
python microserviceD.js

##Microservices Explained
- Microservice A handles the user login and registration
- Microservice B recommends PC based on user preferances
- Microservice C produces images for gpu and cpu brand
- Microservice D shows the user PCs that are in there budget that are in the database already





