#!/bin/bash
echo Initializing Webpage!
npm install
cd frontend
docker compose up -d
cd ..
echo
echo
echo Initialization of webpage complete!
echo To access RPIStudyRooms, open your browser and type the following into the search bar:
echo localhost:5173

RPIStudyRooms="http://localhost:5173"

xdg-open "$RPIStudyRooms"