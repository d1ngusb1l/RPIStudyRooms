import {Building, Room, RoomDef} from './types'

const Folsom_Library = {
    hours: {
      monday : [new Date(1999, 11, 1, 12), new Date(1999, 11, 1, 20)],
      tuesday : [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
      wednesday : [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
      thursday : [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
      friday : [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 17)],
      saturday : [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
      sunday : [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
    }
}

export function isClosed(building : Building) {
    let currentDate = new Date();
    let currentTime = currentDate.getHours();
    let day = currentDate.getDay();
    let openingTime;
    let closingTime;
    let pass = true;
    
    switch (day) {
        case 0:
            openingTime = Folsom_Library.hours.sunday[0].getHours();
            closingTime = Folsom_Library.hours.sunday[1].getHours();
            break;
        case 1:
            openingTime = Folsom_Library.hours.monday[0].getHours();
            closingTime = Folsom_Library.hours.monday[1].getHours();
            break;
        case 2:
            openingTime = Folsom_Library.hours.tuesday[0].getHours();
            closingTime = Folsom_Library.hours.tuesday[1].getHours();
            break;
        case 3:
            openingTime = Folsom_Library.hours.wednesday[0].getHours();
            closingTime = Folsom_Library.hours.wednesday[1].getHours();
            break;
        case 4:
            openingTime = Folsom_Library.hours.thursday[0].getHours();
            closingTime = Folsom_Library.hours.thursday[1].getHours();
            break;
        case 5:
            openingTime = Folsom_Library.hours.friday[0].getHours();
            closingTime = Folsom_Library.hours.friday[1].getHours();
            break;
        case 6:
            openingTime = Folsom_Library.hours.sunday[0].getHours();
            closingTime = Folsom_Library.hours.sunday[1].getHours();
            break;
        default:
            openingTime = Folsom_Library.hours.sunday[0].getHours();
            closingTime = Folsom_Library.hours.sunday[1].getHours();
            pass = false;
            break;
            
    }
    
    if(((openingTime < currentTime && currentTime < closingTime) || (openingTime == currentTime && currentDate.getSeconds() > 0 && currentTime < closingTime)) && pass == true) {
        return "Open";
    }
    return "Closed";
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

export function adjust(color : String, amount : number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
