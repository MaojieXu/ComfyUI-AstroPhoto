import { defineComponent, ref, useId, type SetupContext } from 'vue';
import { DisclosureChevron } from '../../../shared/DisclosureChevron';
import './detail-accordion.css';

export const DetailAccordion = defineComponent((props: { title: string; count?: string; initiallyOpen?: boolean }, { slots }: SetupContext) => {
  const open = ref(props.initiallyOpen ?? false);
  const id = useId();
  return () => <section class="ap-detail-section">
    <button type="button" class="ap-detail-toggle ap-tree-row ap-tree-folder"
      aria-expanded={open.value} aria-controls={id} onClick={() => { open.value = !open.value; }}>
      <DisclosureChevron /><span>{props.title}</span>{props.count && <small>{props.count}</small>}
    </button>
    <div id={id} hidden={!open.value} class="ap-detail-content">{slots.default?.()}</div>
  </section>;
}, { props: ['title', 'count', 'initiallyOpen'] });
