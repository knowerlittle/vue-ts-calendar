import { shallowMount } from '@vue/test-utils'
import { DateTime } from 'luxon'
import Calendar from '@/components/Calendar.vue'

// TODO: extract out to a separate __mocks__ folders; couldn't figure out how
jest.mock('luxon', () => {
  const mockLuxon = {
    toISO: jest.fn().mockReturnValue('22 2020'),
    toFormat: jest.fn().mockReturnValue('22 2020'),
    hasSame: jest.fn().mockReturnValue(true),
    diff: jest.fn().mockReturnValue({ months: 5 }),
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
      local: jest.fn().mockReturnValue(mockLuxon),
      fromISO: jest.fn().mockReturnValue(mockLuxon)
    },
    Interval: {
      hasSame: jest.fn(),
      contains: jest.fn(),
      plus: jest.fn(),
      fromDateTimes: jest.fn().mockReturnValue({
        fromDateTimes: jest.fn(),
        hasSame: jest.fn(),
        contains: jest.fn(),
        plus: jest.fn(),
        isAfter: jest.fn().mockReturnValue(true)
      })
    }
  }
})

describe('Calendar', () => {
  const factory = (opts = {}) => shallowMount(Calendar, {
    ...opts
  })

  describe('matches snapshot', () => {
    it('when it is single view', () => {
      const options = {
        propsData: {
          viewType: 'single',
          maxDate: '2020/12/20'
        }
      }

      const wrapper = factory(options)
      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  it('when it is dual view', () => {
    const options = {
      propsData: {
        viewType: 'dual',
        maxDate: '2020/12/20'
      }
    }

    const wrapper = factory(options)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('when it is infinite view', () => {
    const options = {
      propsData: {
        viewType: 'infinite',
        maxDate: '2020/12/20'
      }
    }

    const wrapper = factory(options)
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('events', () => {
    it('emits the correct object when date selection range is false', async () => {
      const options = {
        propsData: {
          viewType: 'single',
          maxDate: '2020/12/20',
          isRangeSelection: false
        }
      }
      const wrapper = factory(options)
      const dateMock = {
        luxon: DateTime.local()
      }

      wrapper.findComponent({ name: 'Month' }).vm.$emit('selectDate', dateMock)
      await wrapper.vm.$nextTick()

      // @ts-ignore
      expect(wrapper.emitted('dateSelection')[0][0]).toEqual({
        fromDate: '22 2020',
        toDate: '22 2020',
        label: '22 2020'
      })
    })
  })

  it('emits the correct object when date selection range is true', async () => {
    const options = {
      propsData: {
        viewType: 'single',
        maxDate: '2020/12/20',
        isRangeSelection: true
      }
    }
    const wrapper = factory(options)
    const dateMock1 = {
      luxon: DateTime.local()
    }
    const dateMock2 = {
      luxon: DateTime.local()
    }

    dateMock1.luxon.hasSame = jest.fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)

    wrapper.findComponent({ name: 'Month' }).vm.$emit('selectDate', dateMock1)
    wrapper.findComponent({ name: 'Month' }).vm.$emit('selectDate', dateMock2)

    await wrapper.vm.$nextTick()

    // @ts-ignore
    expect(wrapper.emitted('dateSelection')[0][0]).toEqual({
      fromDate: '22 2020',
      toDate: '22 2020',
      label: '22 2020 - 22 2020'
    })
  })

  it('changes the month offset by the emitted offset', () => {
    const options = {
      propsData: {
        viewType: 'single',
        maxDate: '2020/12/20'
      }
    }

    const wrapper = factory(options)

    wrapper.findComponent({ name: 'Month' }).vm.$emit('changeMonth', 1)

    expect(wrapper.vm.$data.monthOffset).toEqual(1)
  })

  it('resets month offset when viewType changes', async () => {
    const options = {
      propsData: {
        viewType: 'single',
        maxDate: '2020/12/20'
      }
    }
    const wrapper = factory(options)
    wrapper.setData({ monthOffset: 5 })
    // @ts-ignore
    expect(wrapper.vm.monthOffset).toEqual(5)

    wrapper.setProps({ viewType: 'infinite' })
    await wrapper.vm.$nextTick()

    // @ts-ignore
    expect(wrapper.vm.monthOffset).toEqual(0)
  })
})
