export const SegmentType = Object.freeze({
  PARKING_ALLOWED: Symbol('PARKING_ALLOWED'),
  NO_PARKING_LANE: Symbol('NO_PARKING_LANE'),
  PARKING_TEMPORARILY_ALLOWED: Symbol('PARKING_TEMPORARILY_ALLOWED'),
  SPECIAL_USE: Symbol('SPECIAL_USE'),
  UNDEFINED: Symbol('UNDEFINED')
})

export default class Segment {

  constructor (type = SegmentType.UNDEFINED) {
    this.type = type
  }

  /**
   *
   * @param segment {Segment | null}
   * @returns {Segment}
   */
  static fromSegment (segment) {
    const result = new Segment()
    if (segment) {
      result.type = segment.type
    }
    return result
  }
}