# Notes app

## Local development
1. Npm install
```
npm install
```
2. Start web-app
```
npm run web:dev
```
3. Navigate to http://localhost:5173/

## Self hosting
1. Pull docker image
```
docker pull cadamsdev/notes:latest
```
2. Run docker container
```
docker run -d -p 4173:4173 -v ~/.block-notes:/app/data --name notes cadamsdev/notes
```
