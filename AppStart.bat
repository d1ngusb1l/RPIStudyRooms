@echo off
echo Initializing Webpage!
call npm install
echo hello world
cd \frontend
docker compose up -d
cd ..
echo:
echo: 
echo Initialization of webpage complete!
echo Opening up the RPIStudyrooms webpage!

start "" http://localhost:5173