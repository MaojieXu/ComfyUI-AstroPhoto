import TabList from '@comfyorg/design-system/tab/TabList';
import Tab from '@comfyorg/design-system/tab/Tab';

export function SidebarTabs<T extends string>({ items, active, prefix, label, title, select, dragOver }: {
    items: readonly T[];
    active: T;
    prefix: string;
    label: string;
    title: (item: T) => string;
    select: (item: T) => void;
    dragOver?: (item: T, event: DragEvent) => void;
}) {
    return <div class="ap-tab-scroll">
        <TabList modelValue={active} onUpdate:modelValue={select} aria-label={label}>
            {items.map(item => <Tab key={item} value={item} class="ap-native-button"
                id={`${prefix}-tab-${item}`} aria-controls={`${prefix}-panel-${item}`}
                onClick={() => { if (item === active) select(item); }}
                onDragenter={(event: DragEvent) => dragOver?.(item, event)}
                onDragover={(event: DragEvent) => dragOver?.(item, event)}>
                {title(item)}
            </Tab>)}
        </TabList>
    </div>;
}
