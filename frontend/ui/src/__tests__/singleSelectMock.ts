import { defineComponent, h, type PropType } from 'vue';

// Jest exercises the form contract without compiling the upstream Vue SFC.
export default defineComponent({
  props: {
    modelValue: String,
    accessibleLabel: String,
    disabled: Boolean,
    options: Array as PropType<{ name: string; value: string }[]>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('select', {
      'aria-label': props.accessibleLabel,
      disabled: props.disabled,
      value: props.modelValue,
      onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLSelectElement).value),
    }, props.options?.map(option => h('option', { value: option.value }, option.name)));
  },
});
