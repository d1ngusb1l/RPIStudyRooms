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
    /* 
    if building.isClosed():
        return "closed"
    else:
        prev = room.status
        timeGap = (time.Now() - room.lastReported) / ...
        level = timeGap / 30 //min
        adjective = ""
        case(level)
            0:  adjective = "certainly "
            1-2:  adjective = "likely "
            3-4:  adjective = "possibly "
            default (>4): return "uncertain"
        return (adjective + prev)

    */

    room.lastReported.toLocaleTimeString()


}
