# Vacation Home

Vacation Home is a web application designed to help users find, manage, and enjoy vacation properties seamlessly. This project leverages a range of AWS services and modern web technologies to provide a robust, scalable, and user-friendly experience.

## Features

- **User Authentication:** Secure user sign-up, login, and management using AWS Cognito.
- **Property Search:** Search for vacation homes using an intuitive interface powered by React.js and AWS Lambda.
- **Notifications:** Real-time notifications for property updates and booking confirmations using AWS SNS and SQS.
- **Chatbot Support:** Interactive chatbot support using AWS Lex for customer service and assistance.
- **Data Storage:** Persistent storage of user data, property listings, and booking information using AWS DynamoDB.
- **Analytics:** Integration with Looker Studio for data visualization and analytics.
- **Pub/Sub Communication:** Efficient messaging system using Pub/Sub for real-time updates and communication.
- **Serverless Functions:** Cloud Functions for executing backend operations without managing servers.

## Tech Stack

- **Frontend:** React.js
- **Backend:** AWS Lambda, AWS Cloud Functions
- **Authentication:** AWS Cognito
- **Notifications:** AWS SNS, AWS SQS
- **Database:** AWS DynamoDB
- **Chatbot:** AWS Lex
- **Analytics:** Looker Studio
- **Messaging:** Pub/Sub

## Architecture

The Vacation Home application is built with a serverless architecture to ensure scalability and reliability. Here’s an overview of the key components:

1. **Frontend (React.js):** Provides a dynamic and responsive user interface for users to interact with the application.
   
2. **Backend (AWS Lambda & Cloud Functions):** Handles all business logic, such as searching for properties, processing bookings, and managing user data.
   
3. **Authentication (AWS Cognito):** Manages user authentication and authorization securely.
   
4. **Database (AWS DynamoDB):** Stores user information, property details, and booking records in a NoSQL database.
   
5. **Chatbot (AWS Lex):** Provides users with interactive support through a natural language chatbot interface.
   
6. **Notifications (AWS SNS & SQS):** Facilitates real-time notifications and messaging between different components of the application.
   
7. **Analytics (Looker Studio):** Visualizes data and provides insights into user behavior, property popularity, and more.
   
8. **Messaging (Pub/Sub):** Supports real-time communication and updates across the application.
