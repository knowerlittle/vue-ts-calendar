import { shallowMount } from '@vue/test-utils'
import Day from '@/components/Day.vue'

describe('Day', () => {
  const luxonMock = jest.fn()

  const defaultOpts = {
    propsData: {
      date: {
        luxon: luxonMock,
        isDisabled: jest.fn().mockReturnValue(true),
        isBetween: jest.fn().mockReturnValue(true),
        isStartDate: jest.fn().mockReturnValue(true),
        isEndDate: jest.fn().mockReturnValue(true),
        weekDay: jest.fn().mockReturnValue(5),
        day: 1,
        date: 1
      },
      firstSaturdayDate: 1
    }
  }

  const factory = (opts = {}) => shallowMount(Day, {
    ...defaultOpts,
    ...opts
  })

  describe('matches snapshot', () => {
    it('when the cases are true for class names', () => {
      const wrapper = factory()

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('when the cases are false for class names', () => {
      const options = {
        propsData: {
          date: {
            luxon: luxonMock,
            isDisabled: jest.fn().mockReturnValue(false),
            isBetween: jest.fn().mockReturnValue(false),
            isStartDate: jest.fn().mockReturnValue(false),
            isEndDate: jest.fn().mockReturnValue(false),
            weekDay: jest.fn().mockReturnValue(4),
            day: 1,
            date: 1
          },
          firstSaturdayDate: 1
        }
      }
      const wrapper = factory(options)

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('when the calculation for applying the grid-area numbers for the inline styles are correct', () => {
      const options = {
        propsData: {
          date: {
            luxon: luxonMock,
            isDisabled: jest.fn().mockReturnValue(false),
            isBetween: jest.fn().mockReturnValue(false),
            isStartDate: jest.fn().mockReturnValue(false),
            isEndDate: jest.fn().mockReturnValue(false),
            weekDay: jest.fn().mockReturnValue(5),
            day: 3,
            date: 20
          },
          firstSaturdayDate: 4
        }
      }
      const wrapper = factory(options)

      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('events', () => {
    it('emits a date event when clicked and date is not disabled', () => {
      const options = {
        propsData: {
          date: {
            isDisabled: jest.fn().mockReturnValue(false),
            isBetween: jest.fn().mockReturnValue(false),
            isStartDate: jest.fn().mockReturnValue(false),
            isEndDate: jest.fn().mockReturnValue(false),
            weekDay: jest.fn().mockReturnValue(2)
          },
          firstSaturdayDate: 1
        }
      }
      const wrapper = factory(options)
      wrapper.find('.innerDate').trigger('click')

      // @ts-ignore
      expect(wrapper.emitted('click')[0][0]).toEqual(options.propsData.date)
    })

    it('does not emits a date event when clicked if date is disabled', () => {
      const options = {
        propsData: {
          date: {
            isDisabled: jest.fn().mockReturnValue(true),
            isBetween: jest.fn().mockReturnValue(false),
            isStartDate: jest.fn().mockReturnValue(false),
            isEndDate: jest.fn().mockReturnValue(false),
            weekDay: jest.fn().mockReturnValue(2)
          },
          firstSaturdayDate: 1
        }
      }
      const wrapper = factory(options)

      wrapper.find('.innerDate').trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })
})
