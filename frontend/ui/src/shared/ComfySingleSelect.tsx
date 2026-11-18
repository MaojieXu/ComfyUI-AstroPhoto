import { useLayoutEffect, useRef } from 'react';
import { h, render } from 'vue';
import SingleSelect from '../../../src/vendor/comfyui/single-select/SingleSelect.vue';

type Props = {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
};

// Reka reserves the empty string for clearing the selection.
const empty = 'unspecified';
const encode = (value: string) => value === '' ? empty : 'value:' + value;

export function ComfySingleSelect({ id, label, value, options, disabled, invalid, onChange }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = mount.current;
    if (!node) return;
    return () => render(null, node);
  }, []);
  useLayoutEffect(() => {
    const node = mount.current;
    if (!node) return;
    render(h(SingleSelect, {
      id,
      class: 'ap-comfy-select',
      accessibleLabel: label,
      'aria-describedby': invalid ? id + '-error' : undefined,
      disabled,
      invalid,
      modelValue: options.some(option => option.value === value) ? encode(value) : empty,
      options: options.map(option => ({ value: encode(option.value), name: option.label, disabled: option.disabled })),
      'onUpdate:modelValue': (selection: string) => onChange(selection === empty ? '' : selection.slice('value:'.length)),
    }), node);
  });
  return <div ref={mount} />;
}
