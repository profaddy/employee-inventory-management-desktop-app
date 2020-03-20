### 🙋‍♂️ Made by [@profaddy]

---

# React + Electron + node + mongodb= 😍

An example of using create-react-app and Electron.

## Scripts
```yarn start``` will start the Electron app and the React app at the same time.  
```yarn build``` will build the React app and package it along the Electron app.

## Steps to install app on local machine(Windows)
install mongodb for windows.
install node-windows globally and run command ```npm link node-windows```.
Navigate to server folder.
```cd server```.
Run command.
```npm run install-win-service```.
Now node js project is installed as a service on windows and will start on port localhost:4000.
Navigate to root of repo.
```cd .. ```.
run ```yarn build```.
Go to dist folder there you will find exe file execute it and electron app will get started that is connected to node js server running at port 4000.

special thanks to [@kitze] for providing react electron wrapper
