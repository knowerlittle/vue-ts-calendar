import CalendarDemo from '@/components/CalendarDemo.vue'
import { shallowMount } from "@vue/test-utils"
import Month from "@/components/Month.vue"

// To be mocked externally; Help!
jest.mock('luxon', () => {
  const mockLuxon = {
    plus: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue('20 Jul 2020')
    })
  }

  return {
    DateTime: {
      local: jest.fn().mockReturnValue(mockLuxon),
    }
  }
})

describe('CalendarDemo', () => {
  const factory = (opts = {}) => shallowMount(CalendarDemo, {
    ...opts
  })

  describe('matches props', () => {
    it('when it is single view', async () => {
      const wrapper = factory()

      wrapper.find('#viewTypeSingle').trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'Calendar' }).props())
        .toHaveProperty('viewType', 'single')
    })

    it('when it is dual view', async () => {
      const wrapper = factory()

      wrapper.find('#viewTypeDual').trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'Calendar' }).props())
        .toHaveProperty('viewType', 'dual')
    })

    it('when it is infinite view', async () => {
      const wrapper = factory()

      wrapper.find('#viewTypeInfinite').trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'Calendar' }).props())
        .toHaveProperty('viewType', 'infinite')
    })

    it('when it is range selection', async () => {
      const wrapper = factory()

      wrapper.find('#rangeSelectionTypeTrue').trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'Calendar' }).props())
        .toHaveProperty('isRangeSelection', true)
    })

    it('when it is single selection', async () => {
      const wrapper = factory()

      wrapper.find('#rangeSelectionTypeFalse').trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'Calendar' }).props())
        .toHaveProperty('isRangeSelection', false)
    })
  })
})


