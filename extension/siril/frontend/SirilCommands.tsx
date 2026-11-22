import { computed, defineComponent, ref, type VNode } from 'vue';
import { useI18n } from 'vue-i18n';
import { nodeCategoryLabel } from '../../../frontend/src/i18n/nodeDefinitions';
import { SearchField } from '../../../frontend/src/shared/SearchField';
import { useResource } from '../../../frontend/src/shared/useResource';
import { getCommands, type SirilCommand } from './api';
import { commandTitle, SirilCommandDetails } from './SirilCommandDetails';

type CommandGroup = {
    label: string;
    commands: SirilCommand[];
    children: Map<string, CommandGroup>;
};

export const SirilCommands = defineComponent(() => {
    const { locale, t } = useI18n();
    const { resource, refresh } = useResource(getCommands, true);
    const search = ref('');
    const groups = computed(() => {
        const matches = new Map<string, CommandGroup>();
        if (resource.value.state !== 'ready') return matches;
        const query = search.value.toLowerCase().trim();
        for (const row of resource.value.data) {
            if (![row.id, row.title, row.title_zh, row.usage, row.node_id, row.category, row.category_zh, ...(row.search_aliases ?? [])]
                .some(value => value?.toLowerCase().includes(query))) continue;
            const path = row.category?.replace(/^AstroPhoto\/Siril\//, '').split('/') ?? ['Siril'];
            const translated = locale.value === 'zh' ? row.category_zh?.split('/') : undefined;
            let children = matches;
            path.forEach((segment, index) => {
                let group = children.get(segment);
                if (!group) {
                    group = {
                        label: translated?.[index] ?? nodeCategoryLabel(segment, locale.value),
                        commands: [],
                        children: new Map(),
                    };
                    children.set(segment, group);
                }
                if (index === path.length - 1) group.commands.push(row);
                children = group.children;
            });
        }
        return matches;
    });

    function renderGroups(groups: Map<string, CommandGroup>, nested = false): VNode[] {
        const Heading = nested ? 'h5' : 'h4';
        return [...groups].map(([segment, group]) => (
            <section key={segment} class="ap-siril-command-group">
                <Heading>{group.label}</Heading>
                {group.commands.length > 0 && (
                    <ul>
                        {group.commands.map(row => (
                            <li key={row.id}>
                                <details>
                                    <summary>
                                        {commandTitle(row, locale.value)}{' '}
                                        <code>{row.id}</code>
                                        <small>{t(row.scriptable ? 'siril.catalogue.node' : 'siril.catalogue.gui')}</small>
                                    </summary>
                                    <SirilCommandDetails command={row} />
                                </details>
                            </li>
                        ))}
                    </ul>
                )}
                {renderGroups(group.children, true)}
            </section>
        ));
    }

    return () => (
        <section class="ap-software-section ap-siril-commands">
            <SearchField label={t('siril.catalogue.search')} clearLabel={t('actions.clear')}
                onSearch={value => { search.value = value; }} />
            {resource.value.state === 'loading' && <p role="status">{t('states.loading')}</p>}
            {resource.value.state === 'error' && (
                <p role="alert">
                    {t('siril.catalogue.unavailable')}{' '}
                    <button type="button" class="ap-storage-button" onClick={refresh}>{t('actions.refresh')}</button>
                </p>
            )}
            {resource.value.state === 'ready' && (groups.value.size ? (
                renderGroups(groups.value)
            ) : <p role="status">{t('siril.catalogue.empty')}</p>)}
        </section>
    );
});
