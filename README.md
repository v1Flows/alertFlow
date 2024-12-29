# AlertFlow

AlertFlow is a monitoring automation platform designed to streamline workflows, manage team members, and monitor project progress. This repository contains both the frontend and backend code for the AlertFlow application.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Project Management**: Create, edit, and delete projects.
- **Flows**: Create flows to design workflows per alarm pattern.
- **Payloads**: Receive incoming alarms from your monitoring infrastructure via payloads & flows.
- **Runners**: Manage self-hosted runners for executing tasks.
- **Team Collaboration**: Invite team members, assign roles, and manage permissions.
- **Audit Logs**: Track changes and activities within projects.

## Installation

To get started with the AlertFlow project, follow these steps:

### Backend

1. Clone the repository:
    ```sh
    git clone git@github.com:AlertFlow/alertflow.git
    cd alertflow
    ```

2. Install dependencies:
    ```sh
    cd services/backend && go mod download
    ```

3. Create a [config.yaml](https://github.com/AlertFlow/alertflow/blob/main/services/backend/config/config.yaml) file in the `config` directory and add the necessary configuration:
    ```yaml
    LogLevel: info

    Database:
      Server: localhost
      Port: 5432
      Name: postgres
      User: postgres
      Password: postgres

    JWT:
      Secret: your-jwt-secret
    ```

4. Build and run the backend server:
    ```sh
    go build -o alertflow-backend
    ./alertflow-backend --config config/config.yaml
    ```

### Frontend

1. Navigate to the frontend directory:
    ```sh
    cd services/frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env.local` file and add the necessary environment variables:
    ```env
    NEXT_PUBLIC_API_URL="https://your-api-url.com"
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

## Usage

Once the development server is running, you can access the application at `http://localhost:3000`. From there, you can create and manage projects, invite team members, and monitor project activities.

## Project Structure

The project structure is organized as follows:

- **backend**: Contains the backend code for handling API requests, database interactions, and business logic.
- **frontend**: Contains the frontend code for the user interface, including components, pages, and styles.

## Contributing

We welcome contributions to the AlertFlow project! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Add your commit message"
    ```
4. Push to the branch:
    ```sh
    git push origin feature/your-feature-name
    ```
5. Open a pull request on GitHub.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International Public License. See the [LICENSE](https://github.com/AlertFlow/alertflow/blob/main/LICENSE) file for details.