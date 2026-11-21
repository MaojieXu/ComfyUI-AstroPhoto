import { defineComponent } from 'vue';
import SingleSelect from '../vendor/comfyui/single-select/SingleSelect.vue';

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
const encode = (value: string) => (value === '' ? empty : 'value:' + value);

export const ComfySingleSelect = defineComponent(
    (props: Props) => () => (
        <SingleSelect
            class="ap-comfy-select"
            accessibleLabel={props.label}
            aria-describedby={props.invalid ? `${props.id}-error` : undefined}
            disabled={props.disabled}
            invalid={props.invalid}
            modelValue={
                props.options.some((option) => option.value === props.value) ? encode(props.value) : empty
            }
            options={props.options.map((option) => ({
                value: encode(option.value),
                name: option.label,
                disabled: option.disabled,
            }))}
            {...{
                id: props.id,
                'onUpdate:modelValue': (selection: string | number | undefined) => {
                    if (typeof selection === 'string')
                        props.onChange(selection === empty ? '' : selection.slice('value:'.length));
                },
            }}
        />
    ),
    { props: ['id', 'label', 'value', 'options', 'disabled', 'invalid', 'onChange'] },
);
