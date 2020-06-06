import { DateTime, Interval } from 'luxon'

export default class CalendarDate {
  date: number

  month: number

  year: number

  selectionInterval: Interval | undefined

  maxInterval: Interval

  luxon: DateTime

  constructor (
    date: number,
    month: number,
    year: number,
    selectionInterval: Interval | undefined,
    maxInterval: Interval
  ) {
    this.date = date
    this.month = month
    this.year = year
    this.selectionInterval = selectionInterval
    this.maxInterval = maxInterval
    this.luxon = this.createLuxon()
  }

  createLuxon () {
    return DateTime.local(this.year, this.month, this.date)
  }

  isStartDate () {
    return this.selectionInterval && this.selectionInterval.start.hasSame(this.luxon, 'day')
  }

  isEndDate () {
    return this.selectionInterval && this.selectionInterval.end.hasSame(this.luxon, 'day')
  }

  isBetween () {
    return this.selectionInterval && this.selectionInterval.contains(this.luxon)
  }

  isDisabled () {
    return this.maxInterval.isBefore(this.luxon)
      || this.maxInterval.isAfter(this.luxon)
      || !this.maxInterval.contains(this.luxon)
  }

  weekDay () {
    return this.luxon.weekday
  }
}
