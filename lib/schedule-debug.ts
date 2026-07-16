let _day: number | null = null
let _time: string | null = null
let _listeners: (() => void)[] = []

export const scheduleDebug = {
  get day() { return _day },
  get time() { return _time },
  set(day: number | null, time: string | null) {
    _day = day
    _time = time
    _listeners.forEach(fn => fn())
  },
  reset() {
    _day = null
    _time = null
    _listeners.forEach(fn => fn())
  },
  subscribe(fn: () => void) {
    _listeners.push(fn)
    return () => { _listeners = _listeners.filter(f => f !== fn) }
  },
}
