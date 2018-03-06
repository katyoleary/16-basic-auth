#Installation

git clone this repository down to your local machine.  
run npm i (in your terminal) to install all the dependencies of this application. 

#Server

to start your server, run teh command npm run start in your terminal. make sure you are in the same directory you cloned down.  

#Endpoints

POST requests to /api/signup
-to 'sign up', you must enter a valid username and password
-invalid requests will not respond with a token

GET requests to /api/signin
-if you enter a proper username and password, you'll be granted authorization with a token
-if your username or password is invalid, you will recieve a 401: Unauthorized error
