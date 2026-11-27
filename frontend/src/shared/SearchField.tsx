import { computed, defineComponent, ref, watch } from 'vue';
import SearchInput from '@comfyorg/design-system/search-input/SearchInput';

type Props = {
    label: string;
    clearLabel: string;
    onSearch: (value: string) => void;
    value?: string;
    onValueChange?: (value: string) => void;
};

export const SearchField = defineComponent(
    (props: Props) => {
        const localValue = ref('');
        const composing = ref(false);
        const value = computed({
            get: () => props.value ?? localValue.value,
            set: (next: string) => {
                if (props.onValueChange) props.onValueChange(next);
                else localValue.value = next;
            },
        });
        watch([value, composing], ([query, isComposing], _, onCleanup) => {
            if (isComposing) return;
            const timer = window.setTimeout(() => props.onSearch(query), 180);
            onCleanup(() => window.clearTimeout(timer));
        }, { immediate: true });

        return () => <div class="ap-search-field ap-native-search"
            onCompositionstart={() => { composing.value = true; }}
            onCompositionend={(event: CompositionEvent) => {
                value.value = (event.target as HTMLInputElement).value;
                composing.value = false;
            }}>
            <SearchInput modelValue={value.value} accessibleLabel={props.label}
                clearLabel={props.clearLabel} placeholder={props.label}
                onUpdate:modelValue={(next: string) => { value.value = next; }} />
        </div>;
    },
    { props: ['label', 'clearLabel', 'onSearch', 'value', 'onValueChange'] },
);
