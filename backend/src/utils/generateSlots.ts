interface GenerateSlotsParams {
    startTime:number;
    endTime:number;
    slotDuration:number;
    bufferTime?:number
}

interface Slot {
    startTime:number;
    endTime:number;
}

const generateSlots =({
    startTime,
    endTime,
    slotDuration,
    bufferTime = 0
}:GenerateSlotsParams):Slot[] => {

const slots:Slot[] = []

let currentTime = startTime

while (currentTime + slotDuration <= endTime) {

    const slotStart = currentTime

    const slotEnd = currentTime + slotDuration

    slots.push({
        startTime:slotStart,
        endTime:slotEnd
    })

    currentTime = slotEnd + bufferTime

    }
    return slots
    
}

export default generateSlots