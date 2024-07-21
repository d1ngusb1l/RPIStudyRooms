import {Building, Room, RoomDef} from './types'

export function isClosed(building : Building) {
    /*
    currentTime = time.Now()
    day = time.DayOfTheWeek()

    openingTime = building.hours[day][0]
    closingTime = building.hours[day][1]

    if(openingTime < currentTime < closingTime):
        return true
    else:
        return false

    */
}

export function statusCalculation(room : Room) {
    let reportTime = new Date(room.lastReported);
    let currentTime = new Date();
    //time difference in milliseconds
    let timeDiff = currentTime.getTime() - reportTime.getTime();
    //converting to seconds
    timeDiff /= 1000;
    //converting to minutes
    timeDiff /= 60;

    if(room.status == "full") {
        if(timeDiff <= 30) {return "Certainly Occupied";}
        if(timeDiff <= 60) {return "Likely Occupied";}
        if(timeDiff <= 90) {return "Possibly Occupied";}
        else {return "Uncertain"}

    }
    else if(room.status == "empty") {
        if(timeDiff <= 30) {return "Certainly Empty";}
        if(timeDiff <= 60) {return "Likely Empty";}
        if(timeDiff <= 90) {return "Possibly Empty";}
        else {return "Uncertain"}
    }
    else {return "Closed/Reserved"}
}
