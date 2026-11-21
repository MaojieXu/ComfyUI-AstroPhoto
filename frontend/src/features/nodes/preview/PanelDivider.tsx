import { defineComponent } from 'vue';

type Props = {
    axis: 'x' | 'y';
    value: number;
    min: number;
    max: number;
    label: string;
    controls: string;
    onChange: (value: number) => void;
};

export const PanelDivider = defineComponent(
    (props: Props) => {
        let drag: { id: number; start: number; size: number; value: number } | undefined;
        return () => {
            const { axis, value, min, max, label, controls, onChange } = props;
            const horizontal = axis === 'x';
            const update = (next: number) => onChange(Math.max(min, Math.min(max, next)));

            return (
                <div
                    class="ap-inspector-splitter"
                    data-axis={axis}
                    role="separator"
                    tabindex={0}
                    aria-label={label}
                    aria-controls={controls}
                    aria-orientation={horizontal ? 'vertical' : 'horizontal'}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={Math.round(value)}
                    onPointerdown={(event) => {
                        if (event.button !== 0) return;
                        const bounds = (
                            event.currentTarget as HTMLElement
                        ).parentElement?.getBoundingClientRect();
                        const size = horizontal ? bounds?.width : bounds?.height;
                        if (!size) return;
                        (event.currentTarget as HTMLElement).focus();
                        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
                        drag = {
                            id: event.pointerId,
                            start: horizontal ? event.clientX : event.clientY,
                            size,
                            value,
                        };
                    }}
                    onPointermove={(event) => {
                        const start = drag;
                        if (start?.id !== event.pointerId) return;
                        const position = horizontal ? event.clientX : event.clientY;
                        update(start.value + ((position - start.start) * 100) / start.size);
                    }}
                    {...{
                        onLostpointercapture: () => {
                            drag = undefined;
                        },
                    }}
                    onKeydown={(event) => {
                        const moves: Record<string, number> = {
                            Home: min,
                            End: max,
                            [horizontal ? 'ArrowLeft' : 'ArrowUp']: value - 3,
                            [horizontal ? 'ArrowRight' : 'ArrowDown']: value + 3,
                        };
                        const next = moves[event.key];
                        if (typeof next !== 'number') return;
                        event.preventDefault();
                        update(next);
                    }}
                />
            );
        };
    },
    { props: ['axis', 'value', 'min', 'max', 'label', 'controls', 'onChange'] },
);
