import { shallowMount } from '@vue/test-utils'
import { dayNamesFallback } from '@/helpers'
import DayOfWeekNames from '@/components/DayOfWeekNames.vue'

describe('DayOfWeekNames', () => {
  const factory = (opts = {}) => shallowMount(DayOfWeekNames, {
    ...opts
  })

  describe('matches snapshot', () => {
    it('matches when header is not sticky', () => {
      const options = {
        propsData: {
          sticky: false,
          dayNames: dayNamesFallback
        }
      }
      const wrapper = factory(options)

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches when header is sticky', () => {
      const options = {
        propsData: {
          sticky: true,
          dayNames: dayNamesFallback
        }
      }
      const wrapper = factory(options)

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
