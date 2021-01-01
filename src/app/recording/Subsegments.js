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
  OTHER: 'other',
  NO_RESTRICTION: 'no restriction'
}

export const USAGE_WHEN_NO_PARKING = {
  BUS_STOP: 'bus_stop',
  BUS_LANE: 'bus_lane',
  MARKET: 'market',
  LANE: 'lane',
  TAXI: 'taxi',
  OTHER: 'other'
}

export const NO_PARKING_REASONS_AND_LABEL = {
  'private_parking': 'Privatparkplatz',
  'bus_stop': 'Haltestelle',
  'bus_lane': 'Busspur',
  'taxi': 'Taxi',
  'tree': 'Baum',
  'bike_racks': 'Fahrradständer',
  'pedestrian_crossing': 'Zebrastreifen',
  'driveway': 'Einfahrt',
  'loading_zone': 'Ladezone',
  'standing_zone': '"Standing Zone"',
  'emergency_exit': 'Notausgang',
  'lowered_curb_side': 'Abgesenkter Bordstein',
  'lane': 'Fahrspur'
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

export function setTimeConstraint (subsegment) {
  subsegment.time_constraint = true
}

export function setNoTimeConstraint (subsegment) {
  subsegment.time_constraint = false
}

export function setFee (subsegment, hasFee) {
  console.log('hasFee', hasFee)
  subsegment.fee = hasFee
}

export function setWithoutFee (subsegment) {
  subsegment.fee = false
}

export function setDurationConstraint (subsegment, hasDurationConstraint) {
  subsegment.duration_constraint = hasDurationConstraint
}

export function setNoDurationConstraint (subsegment) {
  subsegment.duration_constraint = false
}

export function setLengthInMeters (subsegment, length) {
  subsegment.length_in_meters = length === '' ? '' : Number(length)
}

export function setCarCount (subsegment, car_count) {
  subsegment.car_count = car_count === '' ? '' : Number(car_count)
}

/**
 * TODO: rename to setTimeConstraintDetails
 */
export function setTimeConstraintReason (subsegment, details) {
  subsegment.details = details
}

export function setStreetLocation (subsegment, street_location) {
  subsegment.street_location = street_location
}

export function setUsageRestriction (subsegment, usageRestriction) {
  subsegment.usage_restrictions = usageRestriction === USAGE_RESTRICTIONS.NO_RESTRICTION
    ? null
    : usageRestriction
}

export function setUsageWhenNoParking (subsegment, usageWhenNoParking) {
  subsegment.usage_when_no_parking = usageWhenNoParking
}

export function setAlignmentParallel (subsegment) {
  subsegment.alignment = ALIGNMENT.PARALLEL
}

export function setAlignmentPerpendicular (subsegment) {
  subsegment.alignment = ALIGNMENT.PERPENDICULAR
}

export function setAlignmentDiagonal (subsegment) {
  subsegment.alignment = ALIGNMENT.DIAGONAL
}

export function getToggleNoParkingReasonFn (reason) {
  return (subsegment) => {
    if (!subsegment.no_parking_reasons) {
      subsegment.no_parking_reasons = [reason]
    } else if (subsegment.no_parking_reasons.includes(reason)) {
      subsegment.no_parking_reasons = subsegment.no_parking_reasons.filter(r => r !== reason)
    } else {
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
    // TODO: should be singular?
    usage_restrictions: null,
    time_constraint: false,
    time_constraint_reason: null,   // TODO: should be renamed to `time_constraint_details`
    usage_when_no_parking: null,
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
