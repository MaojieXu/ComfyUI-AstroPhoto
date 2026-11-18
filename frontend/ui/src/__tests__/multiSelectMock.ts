import { defineComponent, h, type PropType } from 'vue';

export default defineComponent({
  props: {
    modelValue: Array as PropType<{ name: string; value: string }[]>,
    accessibleLabel: String,
    disabled: Boolean,
    options: Array as PropType<{ name: string; value: string }[]>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('select', {
      multiple: true, 'aria-label': props.accessibleLabel, disabled: props.disabled,
      onChange: (event: Event) => {
        const selected = Array.from((event.target as HTMLSelectElement).selectedOptions, option => option.value);
        emit('update:modelValue', props.options?.filter(option => selected.includes(option.value)));
      },
    }, props.options?.map(option => h('option', {
      value: option.value, selected: props.modelValue?.some(item => item.value === option.value),
    }, option.name)));
  },
});
