# Steps to Get Started

### You can test the backend service at /identity endpoint:
http://139.59.246.150:3000/api/contact/identify

Example CURL:
```sh
curl --location 'http://139.59.246.150:3000/api/contact/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "717171"
}'
```

## Setting Up Locally

### Prerequisites
- Node.js
- TypeScript
- PostgreSQL

### Steps to Build the Project Locally

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary environment variables.
    ```sh
    PORT=<Backend Port>
    DB_NAME=<DB Name>
    DB_USER=<DB User>
    DB_PASSWORD=<DB Password>
    DB_HOST= <DB Host>
    ```

4. **Compile TypeScript:**
    ```sh
    npx tsc
    ```

5. **Start the server:**
    ```sh
    npm start
    ```

