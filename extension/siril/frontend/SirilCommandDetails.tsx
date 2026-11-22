import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SirilCommand } from './api';

type Props = { command: SirilCommand; disclose?: boolean };
export function commandTitle(command: SirilCommand, locale: string) {
    return locale === 'zh' ? command.title_zh ?? command.title : command.title;
}

export function commandDescription(command: SirilCommand, locale: string) {
    return locale === 'zh' ? command.description_zh ?? command.description : command.description;
}

export const SirilCommandDetails = defineComponent((props: Props) => {
    const { locale, t } = useI18n();
    return () => {
        const { command, disclose } = props;
        const instructions = (
            <>
                <pre>{command.usage}</pre>
                {command.requires.length > 0 && <p class="ap-siril-requirements">
                    {t('siril.catalogue.requirements')}{' '}
                    {command.requires.map(value => t('siril.requirements.' + value.replace(/[^A-Za-z0-9]+/g, '_'), value)).join(' · ')}
                </p>}
                {command.build_feature && <p>{t('siril.catalogue.build', { feature: command.build_feature })}</p>}
            </>
        );
        return (
            <div class="ap-siril-command-details">
                <p class="ap-siril-description">{commandDescription(command, locale.value)}</p>
                {disclose ? (
                    <details class="ap-siril-command-usage">
                        <summary>{t('siril.catalogue.usage')}</summary>
                        {instructions}
                    </details>
                ) : instructions}
            </div>
        );
    };
}, { props: ['command', 'disclose'] });
