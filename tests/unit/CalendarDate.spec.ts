import CalendarDate from '@/services/CalendarDate'

// To be mocked externally; Help!
jest.mock('luxon', () => {
  const mockLuxon = jest.genMockFromModule('luxon')
  // @ts-ignore
  mockLuxon.weekday = 5

  return {
    DateTime: {
      local: jest.fn().mockReturnValue(mockLuxon)
    }
  }
})

const mockLuxon = jest.genMockFromModule('luxon')
// @ts-ignore
const { Interval } = mockLuxon

describe('CalendarDate', () => {
  const day = 1
  const month = 2
  const year = 3
  const selectionInterval = new Interval()
  selectionInterval.start = new Interval()
  selectionInterval.end = new Interval()
  const maxInterval = new Interval()

  let date: CalendarDate

  beforeEach(() => {
    date = new CalendarDate(day, month, year, selectionInterval, maxInterval)
  })

  it('has a weekday property', () => {
    expect(date.weekDay()).toEqual(5)
  })

  it('should create a new luxon date', () => {
    const newDate = date.createLuxon()

    expect(newDate).toBeTruthy()
  })

  it('should check if the start date is the same as the selection interval', () => {
    selectionInterval.start.hasSame.mockReturnValueOnce(true)

    expect(date.isStartDate()).toBeTruthy()
  })

  it('should check if the end date is the same as the selection interval', () => {
    selectionInterval.end.hasSame.mockReturnValueOnce(true)

    expect(date.isEndDate()).toBeTruthy()
  })

  it('should check if the date is between the start and end dates', () => {
    selectionInterval.contains.mockReturnValueOnce(true)

    expect(date.isBetween()).toBeTruthy()
  })

  it('should check if it is disabled; false', () => {
    maxInterval.isBefore.mockReturnValueOnce(false)
    maxInterval.isAfter.mockReturnValueOnce(false)
    maxInterval.contains.mockReturnValueOnce(true)

    expect(date.isDisabled()).toBeFalsy()
  })

  it('should check if it is disabled; true', () => {
    maxInterval.isBefore.mockReturnValueOnce(true)
    maxInterval.isAfter.mockReturnValueOnce(false)
    maxInterval.contains.mockReturnValueOnce(true)

    expect(date.isDisabled()).toBeTruthy()
  })
})
