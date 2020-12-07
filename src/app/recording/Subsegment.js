import MainReason from './MainReason'

export const SegmentType = Object.freeze({
  PARKING_ALLOWED: Symbol('PARKING_ALLOWED'),
  NO_PARKING_LANE: Symbol('NO_PARKING_LANE'),
  PARKING_TEMPORARILY_ALLOWED: Symbol('PARKING_TEMPORARILY_ALLOWED'),
  SPECIAL_USE: Symbol('SPECIAL_USE'),
  UNDEFINED: Symbol('UNDEFINED')
})

export const PARKING_ALLOWED = Object.freeze({
  ALWAYS: Symbol('ALWAYS'),
  TEMPORARILY: Symbol('TEMPORARILY'),
  NEVER: Symbol('NEVER'),
  UNKNOWN: Symbol('UNKNOWN')
})

/**
 * TODO: find proper English words
 */
export const PARKING_TYPE = Object.freeze({
  LAENGS: Symbol('LAENGS'),
  SCHRAEG: Symbol('SCHRAEG'),
  QUER: Symbol('QUER')
})

export default class Subsegment {

  constructor (type = SegmentType.UNDEFINED) {
    this.type = type
    this.parkingAllowed = PARKING_ALLOWED.UNKNOWN
    this.mainReason = new MainReason()
    this.isMarked = false
    this.parkingType = PARKING_TYPE.LAENGS
  }

  /**
   *
   * @param segment {Subsegment | null}
   * @returns {Subsegment}
   */
  static fromSegment (segment) {
    const result = new Subsegment()
    if (segment) {
      result.type = segment.type
      result.parkingAllowed = segment.parkingAllowed
      result.mainReason = Object.assign({}, segment.mainReason)
      result.isMarked = segment.isMarked
      result.parkingType = segment.parkingType
    }
    return result
  }
}