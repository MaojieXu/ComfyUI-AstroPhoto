import { useLayoutEffect, useRef } from 'react';
import { h, render } from 'vue';
import MultiSelect from '../../../src/vendor/comfyui/multi-select/MultiSelect.vue';

type Option = { value: string; name: string };

export function ComfyMultiSelect({ label, placeholder, emptyText, options, value, disabled, onChange }: {
  label: string; placeholder: string; emptyText: string; options: Option[]; value: string[];
  disabled: boolean; onChange: (value: string[]) => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = mount.current;
    if (!node) return;
    return () => render(null, node);
  }, []);
  useLayoutEffect(() => {
    const node = mount.current;
    if (!node) return;
    render(h(MultiSelect, {
      class: 'ap-comfy-select',
      accessibleLabel: label,
      label: placeholder,
      emptyText,
      disabled,
      options,
      modelValue: value.map(id => options.find(option => option.value === id) ?? { value: id, name: id }),
      'onUpdate:modelValue': (items: Option[]) => onChange(items.map(item => item.value)),
    }), node);
  });
  return <div ref={mount} />;
}
