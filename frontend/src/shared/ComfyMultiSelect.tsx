import { defineComponent } from 'vue';
import MultiSelect from '@comfyorg/design-system/multi-select/MultiSelect';

type Option = { value: string; name: string };
type Props = {
    label: string;
    placeholder: string;
    emptyText: string;
    options: Option[];
    value: string[];
    disabled: boolean;
    onChange: (value: string[]) => void;
};

export const ComfyMultiSelect = defineComponent(
    (props: Props) => () => (
        <MultiSelect
            class="ap-comfy-select ap-native-button"
            accessibleLabel={props.label}
            label={props.placeholder}
            emptyText={props.emptyText}
            disabled={props.disabled}
            options={props.options}
            modelValue={props.value.map(
                (id) => props.options.find((option) => option.value === id) ?? { value: id, name: id },
            )}
            {...{
                'onUpdate:modelValue': (items: Option[]) => props.onChange(items.map((item) => item.value)),
            }}
        />
    ),
    { props: ['label', 'placeholder', 'emptyText', 'options', 'value', 'disabled', 'onChange'] },
);
