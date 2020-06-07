import { shallowMount } from '@vue/test-utils'
import { DateTime, Interval } from 'luxon'

import Month from '@/components/Month.vue'
import { dayNamesFallback, monthNamesFallback } from '@/helpers'

const mockIsAfter = jest.fn()
const mockIsBefore = jest.fn()

// TODO: extract out to a seperate __mocks__ folders; couldn't figure out how
jest.mock('luxon', () => {
  const mockLuxon = {
    plus: jest.fn().mockReturnValue({
      local: jest.fn(),
      fromISO: jest.fn(),
      month: 2,
      year: 2020,
      plus: jest.fn()
    })
  }

  return {
    DateTime: {
      plus: jest.fn(),
      local: jest.fn().mockReturnValue(mockLuxon),
      fromISO: jest.fn().mockReturnValue(mockLuxon)
    },
    Interval: {
      hasSame: jest.fn(),
      contains: jest.fn(),
      plus: jest.fn(),
      fromDateTimes: () => ({
        fromDateTimes: jest.fn(),
        hasSame: jest.fn(),
        contains: jest.fn(),
        isAfter: mockIsAfter,
        isBefore: mockIsBefore,
        plus: jest.fn(),
        end: {
          day: jest.fn()
        }
      })
    }
  }
})

const mockDateTime = DateTime.local()

describe('Month', () => {
  const defaultOpts = {
    propsData: {
      maximumSelectionRange: Interval.fromDateTimes(mockDateTime, mockDateTime),
      showDayNames: true,
      showPreviousMonth: true,
      showNextMonth: true,
      offsetAmount: 1,
      monthOffset: 2,
      monthAlignRight: false,
      dayNames: dayNamesFallback,
      monthNames: monthNamesFallback
    },
    provide: {
      currentDate: DateTime.local(),
      isInfinite: false
    }
  }

  const factory = (opts = {}) => shallowMount(Month, {
    ...defaultOpts,
    ...opts
  })

  describe('matches snapshot', () => {
    it('with default cases', () => {
      const wrapper = factory()

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('when there are no names of weeks', () => {
      const options = {
        propsData: {
          maximumSelectionRange: Interval.fromDateTimes(mockDateTime, mockDateTime),
          showDayNames: false,
          showPreviousMonth: true,
          showNextMonth: true,
          monthOffset: 2,
          dayNames: dayNamesFallback,
          monthNames: monthNamesFallback
        }
      }

      const wrapper = factory(options)

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('when month align rights and there are no month navigations', () => {
      const options = {
        propsData: {
          maximumSelectionRange: Interval.fromDateTimes(mockDateTime, mockDateTime),
          monthAlignRight: true,
          showDayNames: true,
          showPreviousMonth: false,
          showNextMonth: false,
          monthOffset: 2,
          dayNames: dayNamesFallback,
          monthNames: monthNamesFallback
        }
      }

      const wrapper = factory(options)

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('when both month navigations are disabled', () => {
      mockIsBefore.mockReturnValueOnce(true)
      mockIsAfter.mockReturnValueOnce(true)

      const wrapper = factory()

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('when isInfinite is true', () => {
      const wrapper = factory({
        provide: {
          currentDate: DateTime.local(),
          isInfinite: true
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('events', () => {
    it('should emit an event to change the month to previous month when clicked', async () => {
      mockIsAfter.mockReturnValueOnce(false)
      const wrapper = factory()

      wrapper.find('.month__navigation-left').trigger('click')
      await wrapper.vm.$nextTick()

      // @ts-ignore
      expect(wrapper.emitted('changeMonth')[0][0]).toEqual(-1)
    })

    it('should emit an event to change the month to next month when clicked', async () => {
      mockIsBefore.mockReturnValueOnce(false)
      const wrapper = factory()

      wrapper.find('.month__navigation-right').trigger('click')
      await wrapper.vm.$nextTick()

      // @ts-ignore
      expect(wrapper.emitted('changeMonth')[0][0]).toEqual(1)
    })

    it('should emit a date object when clicked', () => {
      const wrapper = factory()

      const dateObject = {
        date: '2020/12/12'
      }
      wrapper.find('day-stub').vm.$emit('click', dateObject)

      // @ts-ignore
      expect(wrapper.emitted('selectDate')[0][0]).toEqual(dateObject)
    })
  })
})
