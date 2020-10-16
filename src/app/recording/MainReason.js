export const PropertyNames = {
  IS_BIKELANE: 'isBikelane',
  IS_BUSLANE: 'isBuslane',
  IS_STOP: 'isStop',
  IS_TREE: 'isTree'
}

/**
 *  This is the main property why parking is not allowed in a segment
 */
export default class MainReason {

  constructor () {
    // these properties must be the same as in PropertyNames constant
    this.isBikelane = false
    this.isBuslane = false
    this.isStop = false
    this.isTree = false
  }

  setAllToFalse() {
    Object.values(PropertyNames).forEach(prop => {
      this[prop] = false
    })
  }

  enableProperty (propName) {
    this.setAllToFalse()
    this[propName] = true
  }

  disableProperty (propName) {
    this[propName] = false
  }

  toggleProperty (propName) {
    if (this[propName]) {
      this.disableProperty(propName)
    }
    else {
      this.enableProperty(propName)
    }
  }
}