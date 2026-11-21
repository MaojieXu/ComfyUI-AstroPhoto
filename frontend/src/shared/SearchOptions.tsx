import { computed, defineComponent, ref, useId } from 'vue';

type Option = { id: string; label: string; checked: boolean; select: () => void };

type Props = {
    icon: 'filter' | 'sort';
    label: string;
    options: Option[];
    multiple?: boolean;
    disabled?: boolean;
};

export const SearchOptions = defineComponent(
    (props: Props) => {
        const id = useId();
        const trigger = ref<HTMLButtonElement | null>(null);
        const open = ref(false);
        const expanded = computed(() => open.value && !props.disabled);

        return () => {
            const { icon, label, options, multiple, disabled } = props;
            return (
                <div
                    class="ap-search-options"
                    onFocusout={(event) => {
                        if (
                            !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)
                        )
                            open.value = false;
                    }}
                    onKeydown={(event) => {
                        if (expanded.value && event.key === 'Escape') {
                            event.preventDefault();
                            event.stopPropagation();
                            open.value = false;
                            trigger.value?.focus();
                        }
                    }}
                >
                    <button
                        ref={trigger}
                        type="button"
                        disabled={disabled}
                        class="ap-search-action"
                        aria-label={label}
                        title={label}
                        aria-expanded={expanded.value}
                        aria-controls={id}
                        onClick={() => (open.value = !open.value)}
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
                            {icon === 'filter' ? (
                                <path d="M3 6h18M6 12h12M9 18h6" />
                            ) : (
                                <>
                                    <path d="M20 7h-9m3 10H5" />
                                    <circle cx="7" cy="7" r="3" />
                                    <circle cx="17" cy="17" r="3" />
                                </>
                            )}
                        </svg>
                    </button>
                    <div
                        id={id}
                        class="ap-search-menu"
                        role={multiple ? 'group' : 'radiogroup'}
                        aria-label={label}
                        hidden={!expanded.value}
                    >
                        {options.map((option) => (
                            <label key={option.id} onMousedown={(event) => event.preventDefault()}>
                                <input
                                    type={multiple ? 'checkbox' : 'radio'}
                                    name={id}
                                    checked={option.checked}
                                    onChange={option.select}
                                />
                                <span>{option.label}</span>
                                <svg
                                    class="ap-option-check"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="m5 12 4 4L19 6" />
                                </svg>
                            </label>
                        ))}
                    </div>
                </div>
            );
        };
    },
    { props: ['icon', 'label', 'options', 'multiple', 'disabled'] },
);
