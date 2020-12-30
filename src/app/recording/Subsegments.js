export const STREET_LOCATION = {
  STREET: 'street',
  CURB: 'curb',
  SIDEWALK: 'sidewalk',
  PARKING_BAY: 'parking_bay',
  MIDDLE: 'middle',
  CAR_PARK: 'car_park'
}

export const ALIGNMENT = {
  PARALLEL: 'parallel',
  PERPENDICULAR: 'perpendicular',
  DIAGONAL: 'diagonal'
}

export const USAGE_RESTRICTIONS = {
  HANDICAP: 'handicap',
  RESIDENTS: 'residents',
  CAR_SHARING: 'car_sharing',
  GENDER: 'gender',
  ELECTRIC_CARS: 'electric_cars',
  OTHER: 'other'
}

export const NO_PARKING_REASON = {
  PRIVATE_PARKING: 'private_parking',
  BUS_STOP: 'bus_stop',
  BUS_LANE: 'bus_lane',
  TAXI: 'taxi',
  TREE: 'tree',
  BIKE_RACKS: 'bike_racks',
  PEDESTRIAN_CROSSING: 'pedestrian_crossing',
  DRIVEWAY: 'driveway',
  LOADING_ZONE: 'loading_zone',
  STANDING_ZONE: 'standing_zone',
  EMERGENCY_EXIT: 'emergency_exit',
  LOWERED_CURB_SIDE: 'lowered_curb_side',
  LANE: 'lane'
}

export const NO_PARKING_REASON_LABEL = {
  PRIVATE_PARKING: 'Privatparkplatz',
  BUS_STOP: 'Haltestelle',
  BUS_LANE: 'Busspur',
  TAXI: 'Taxi',
  TREE: 'Baum',
  BIKE_RACKS: 'Fahrradständer',
  PEDESTRIAN_CROSSING: 'Zebrastreifen',
  DRIVEWAY: 'Einfahrt',
  LOADING_ZONE: 'Ladezone',
  STANDING_ZONE: '"Standing Zone"',
  EMERGENCY_EXIT: 'Notausgang',
  LOWERED_CURB_SIDE: 'Abgesenkter Bordstein',
  LANE: 'Fahrspur'
}

export function setParkingAllowed (subsegment) {
  subsegment.parking_allowed = true
}

export function setParkingNotAllowed (subsegment) {
  subsegment.parking_allowed = false
}

export function setMarked (subsegment) {
  subsegment.marked = true
}

export function setNotMarked (subsegment) {
  subsegment.marked = false
}

export function setLengthInMeters (subsegment, length) {
  subsegment.length_in_meters = length === '' ? '' : Number(length)
}

export function setCarCount (subsegment, car_count) {
  subsegment.car_count = car_count === '' ? '' : Number(car_count)
}

export function getToggleNoParkingReasonFn (reason) {
  return (subsegment) => {
    if (!subsegment.no_parking_reasons) {
      subsegment.no_parking_reasons = [reason]
    }
    else if (subsegment.no_parking_reasons.includes(reason)){
      subsegment.no_parking_reasons = subsegment.no_parking_reasons.filter(r => r !== reason)
    }
    else {
      subsegment.no_parking_reasons.push(reason)
    }
  }

}

export function createEmptySubsegment (orderNumber) {
  return {
    parking_allowed: null,
    order_number: orderNumber,
    length_in_meters: 0,
    car_count: 0,
    quality: 1,
    fee: false,
    street_location: STREET_LOCATION.STREET,
    marked: false,
    alignment: ALIGNMENT.PARALLEL,
    duration_constraint: false,
    usage_restrictions: null,
    time_constraint: false,
    time_constraint_reason: null,
    no_parking_reasons: null,
  }
}

export function createParkingSubsegment (orderNumber) {
  return Object.assign(createEmptySubsegment(orderNumber), {
    parking_allowed: true,
  })
}

export function createNonParkingSubsegment (orderNumber) {
  return Object.assign(createEmptySubsegment(orderNumber), {
    parking_allowed: false
  })
}
