import { computed, defineComponent, ref, watch } from 'vue';
import { ComboboxAnchor, ComboboxInput, ComboboxRoot } from 'reka-ui';

type Props = {
    label: string;
    clearLabel: string;
    onSearch: (value: string) => void;
    value?: string;
    onValueChange?: (value: string) => void;
};

// Adapted from ComfyUI Frontend v1.59.6 SearchInput.vue. AstroPhoto
// retains its sidebar styling, composition guard and existing debounce.
export const SearchField = defineComponent(
    (props: Props) => {
        const input = ref<InstanceType<typeof ComboboxInput> | null>(null);
        const localValue = ref('');
        const composing = ref(false);
        const value = computed({
            get: () => props.value ?? localValue.value,
            set: (next) => {
                if (props.onValueChange) props.onValueChange(next);
                else localValue.value = next;
            },
        });
        watch(
            [value, composing],
            ([query, isComposing], _, onCleanup) => {
                if (isComposing) return;
                const timer = window.setTimeout(() => props.onSearch(query), 180);
                onCleanup(() => window.clearTimeout(timer));
            },
            { immediate: true },
        );

        return () => (
            <ComboboxRoot open={false} ignoreFilter class="ap-search-field">
                <ComboboxAnchor
                    as="div"
                    {...{
                        onClick: () => input.value?.$el.focus(),
                        onCompositionstart: () => {
                            composing.value = true;
                        },
                        onCompositionend: (event: CompositionEvent) => {
                            value.value = (event.target as HTMLInputElement).value;
                            composing.value = false;
                        },
                    }}
                >
                    {value.value ? (
                        <button
                            type="button"
                            class="ap-search-clear"
                            aria-label={props.clearLabel}
                            title={props.clearLabel}
                            onClick={() => {
                                value.value = '';
                                input.value?.$el.focus();
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                aria-hidden="true"
                            >
                                <path d="m18 6-12 12M6 6l12 12" />
                            </svg>
                        </button>
                    ) : (
                        <svg
                            class="ap-search-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    )}
                    <ComboboxInput
                        ref={input}
                        aria-label={props.label}
                        modelValue={value.value}
                        {...{
                            type: 'search',
                            placeholder: props.label,
                            'onUpdate:modelValue': (next: string) => {
                                value.value = next;
                            },
                        }}
                    />
                </ComboboxAnchor>
            </ComboboxRoot>
        );
    },
    { props: ['label', 'clearLabel', 'onSearch', 'value', 'onValueChange'] },
);
