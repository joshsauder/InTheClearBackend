# In The Clear Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This backend is designed to reduce the number of API calls that the users device (iPhone or iPad) has to make. A request from Columbus, OH to Los Angeles, CA would require upwards of 30 API calls between the weather and reverse geolocation services, and as you can imagine, used up much of the devices CPU. With AWS Lambda, I'm able to process all these requests in less than 5 seconds (before it took >10 seconds) and greatly reduce the amount of the devices CPU usage. This backend features two separate functions and is deployed on AWS.

# Tech Stack
- [Node.JS](https://nodejs.org/en/)
- [Amazon AWS Lambda](https://aws.amazon.com/lambda/)
- [Bluebird](http://bluebirdjs.com/docs/getting-started.html) - Promise library used to process asynchronous operations (API requests)
- [Mocha](https://mochajs.org), [Chai](https://www.chaijs.com), and [Lambda-Tester](https://www.npmjs.com/package/lambda-tester) - testing frameworks used to test each Lambda function
- [Claudia](https://claudiajs.com) - Used to deploy Lambda functions to AWS

# Getting Started
Go to [Dark Sky](https://darksky.net/dev) and [Here Maps](https://developer.here.com) and create an API key for Dark Sky, and an App ID and App Code from Here Maps. These keys can be created for free and allow for a set number of free requests. Create a process.env file in the root directory and set API_KEY equal to the API key obtained from Dark Sky, and APP_ID and APP_CODE equal to the corresponding values obtained from Here. You then need to download each NPM module from the package.json file. Finally, you will need to update the time fields in the event.json file. Please select a time in the future. You can obtain Unix times from the [website](https://www.unixtimestamp.com). Once you have done this, you are all set! Please review the Mocha.js documentation in order to test each function, and the Claudia.js documentation in order to deploy each function to AWS.

# Feedback
If you have any questions or would like to give me feedback, please email me at joshsauder@gmail.com!
