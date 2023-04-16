# Atelier Products API

A RESTful API serving an ecommerce front-end for product information endpoints. Employs nginx to load balance and content cache as well as Docker to easily accomplish horizontal scaling and handle heavy client traffic. 

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [System Architecture](#system-architecture)
3. [Stress Testing](#stress-testing)
4. [Getting Started](#getting-started)

## Tech Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## System Architecture

![System Architecture](system-architecture.png)

## Stress Testing

- Stress testing in development environment accomplished with [Artillery](https://www.artillery.io/)
- Tested deployed environment with [Loader.io](https://loader.io/)
- Final Deployed Results (Average): 17 ms latency, 0% error rate, 1000 requests per second

| Endpoints  | /products | /products/:product_id  | /products/:product_id/styles | /products/:product_id/related |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| **Latency**  | 13ms  | 17ms  | 22ms  | 15ms  |
| **Throughput (RPS)**  | 1000  | 1000  | 1000  | 1000  |
| **Error Rate**  | 0%  | 0%   | 0%  | 0%  |


## Getting Started

### Installation

1. Clone the repo to your computer
```bash
git clone https://github.com/Team-Gemli/Products-Gemli-SDC.git
```

2. Install dependencies
```bash
npm install
```

3. Copy example.env file and rename it to .env, enter your desired port number for server and PostgreSQL connection information. Enter loader.io key if desired to stress test the API. 

4. Start the server
```bash
npm run server-dev
```

### Local Testing

**Run Jest tests with code coverage results:**

```bash
npm run test
```

**Stress test in the local development environment with Artillery:**

1. Install Artillery
```bash
npm install -g artillery@latest
```

2. Run artillery tests using YAML script file
```bash
artillery run scripts/load-test.yml
```
