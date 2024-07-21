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

export function StatusCalculation(room : Room) {
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
    else if(room.status == "In Use by a RPI Study Rooms User") {return("Certainly Occupied");}
    else {return "Closed/Reserved"}
}

export function colorCalc(status : String) {
    switch(status) {
        case "Certainly Empty":
            return '#4CFF00'
        case "Likely Empty":
            return '#7FFF00'
        case "Possibly Empty":
            return '#CCFF00'
        case "Uncertain":
            return '#FFFF00'
        case "Possibly Occupied":
            return '#FFBB00'
        case "Likely Occupied":
            return '#FF6A00'
        case "Certainly Occupied":
            return '#FF0000'
        case "Closed":
            return '#808080'
        case "Reserved":
            return '#0026FF'
        case "Available":
            return '#4CFF00'
        default:
            return '#FFFFFF'
    }
}

export function doorCalc(status : String) {
    switch(status) {
        case "Certainly Empty":
            return './assets/roomOpen.png'
        case "Likely Empty":
            return './assets/roomLEmpty.png'
        case "Possibly Empty":
            return './assets/roomPEmpty.png'
        case "Uncertain":
            return './assets/roomUncertain.png'
        case "Possibly Occupied":
            return './assets/roomPOccupied.png'
        case "Likely Occupied":
            return './assets/roomLOccupied.png'
        case "Available":
            return './assets/roomOpen.png'
        default:
            return './assets/roomClosed.png'
    }

}
