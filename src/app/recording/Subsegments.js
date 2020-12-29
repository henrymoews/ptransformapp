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

export function setLengthInMetersMandatory (subsegment, length) {
  subsegment.length_in_meters = Number(length)
}

export function setLengthInMeters (subsegment, length) {
  subsegment.length_in_meters = length === '' ? '' : Number(length)
}

export function setCarCount (subsegment, car_count) {
  subsegment.car_count = car_count === '' ? '' : Number(car_count)
}

export function createParkingSubsegment (orderNumber) {
  return {
    parking_allowed: true,
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
    no_parking_reason: null,
  }
}

export function createNonParkingSubsegment (orderNumber) {
  return {
    parking_allowed: false,
    order_number: orderNumber,
    length_in_meters: null,   // will be set on save
    car_count: 0,
    quality: 1,
    no_parking_reason: null,
  }
}
