# React Neighbourhood Map

This is a neighbourhood map app made for Udacity's Front-End Developers course.

## Description

This is a neighbourhood map app that shows map markers identifying 5 locations in this neighborhood. Click on the markers to display additional information.

## Folder Structure
```bash
├── README.md 
├── package.json 
├── public
│   ├── favicon.ico 
    ├── index.html
│   └── manifest.json
└── src
    ├── App.css 
    ├── App.js 
    ├── App.test.js 
    ├── index.css 
    ├── index.js
    ├── MapContainer.js
    └── registerServiceWorker.js
```
## Dependencies
[google-maps-react](https://github.com/google-map-react/google-map-react)
for Google Map API

## API 

My project uses the following API's:

- [Google Map & Places](https://cloud.google.com/maps-platform/) 
- [Four Square](https://foursquare.com/) 
- [randomUser](https://randomuser.me/)

## Installation & Launch

1. Download the Git Repository

```
$ git clone https://github.com/peterclerkin/react-neighbourhood-map
```

2. CD into the folder once it has been downloaded

```
$ cd react-neighbourhood-map
```

3. Install dependencies using yarn

```
yarn install
```

4. Run the application and get ready to view it :)

```
yarn start
```

The application will automatically open in your browser

## Run in Build Mode

Run App in build mode

```
yarn build
```

The folder will be ready to be deployed with a static server


