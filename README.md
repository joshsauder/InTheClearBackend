# In The Clear Backend

This backend is designed to reduce the number of API calls that the users device has to make. A call from Columbus, OH to Los Angeles, CA would require upwards of 30 API calls between the weather services and reverse geolocation service, and as you can imagine, uses up all the users device CPU and requires more than 10 seconds to complete. Using AWS Lambda, I'm able to process all these requests in less than 5 seconds and without using much of the users devices RAM. This backend features two separate functions and is deployed on AWS.

# Tech Stack
- Node.JS
- Amazon AWS Lambda
- Bluebird (for API requests)
- Mocha, Chai, and Lambda-Tester for testing each function
- Claudia (used to deploy Lambda functions to AWS)

# Getting Started
Go to Dark Sky and create an API key. These keys can be created for free and allow for up to 1,000 free requests each month. Create a process.env file in the root directory and set API_KEY equal to the API key obtained from Dark Sky. You then need to download each NPM module from the package.json file. Once you have done this, you are all set!