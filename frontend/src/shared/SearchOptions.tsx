import { defineComponent, ref } from 'vue';
import Button from '@comfyorg/design-system/button/Button';
import Menu from '@comfyorg/design-system/menu/Menu';
import MenuItems from '@comfyorg/design-system/menu/MenuItems';
import MenuRadioGroup from '@comfyorg/design-system/menu/MenuRadioGroup';

type Option = { id: string; label: string; checked: boolean; select: () => void };
type Props = {
    icon: 'filter' | 'sort' | 'more';
    label: string;
    options: Option[];
    multiple?: boolean;
    disabled?: boolean;
    closeOnSelect?: boolean;
};

const icons = {
    filter: 'icon-[lucide--list-filter]',
    sort: 'icon-[lucide--sliders-horizontal]',
    more: 'icon-[lucide--ellipsis]',
};

export const SearchOptions = defineComponent((props: Props) => {
    const open = ref(false);
    return () => <Menu open={open.value} onUpdate:open={(value: boolean) => { open.value = value; }}
        align="end" aria-label={props.label} v-slots={{
            trigger: () => <Button class="ap-native-button" variant="secondary" size="icon"
                disabled={props.disabled} aria-label={props.label} {...{ type: 'button', title: props.label }}>
                <i class={[icons[props.icon], 'size-4']} aria-hidden="true" />
            </Button>,
            default: () => props.closeOnSelect || props.multiple
                ? <MenuItems items={props.options.map(option => ({
                    key: option.id,
                    label: option.label,
                    ...(props.multiple ? { checked: option.checked } : {}),
                    command: () => { option.select(); if (props.closeOnSelect) open.value = false; },
                }))} />
                : <MenuRadioGroup modelValue={props.options.find(option => option.checked)?.id ?? ''}
                    options={props.options.map(option => ({ value: option.id, label: option.label, command: option.select }))}
                    onSelect={(event: Event) => event.preventDefault()} />,
        }} />;
}, { props: ['icon', 'label', 'options', 'multiple', 'disabled', 'closeOnSelect'] });
