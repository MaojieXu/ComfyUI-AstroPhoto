import { defineComponent, onUnmounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    clearSiril,
    discoverSiril,
    getSiril,
    saveSiril,
    setSirilEnabled,
    type Candidate,
    type SoftwareStatus,
} from './api';
import { ApiError } from '../../../frontend/src/api/client';
import { SirilCommands } from './SirilCommands';
import { useResource } from '../../../frontend/src/shared/useResource';

type SummaryProps = { onOpen: () => void };

export const SirilSummary = defineComponent(
    (props: SummaryProps) => {
        const { t } = useI18n();
        const { resource } = useResource(getSiril, true);
        const status = shallowRef<SoftwareStatus>();
        const error = ref<string>();
        let running: AbortController | undefined;
        const busy = ref(false);
        onUnmounted(() => running?.abort());

        async function toggle(enabled: boolean) {
            if (busy.value) return;
            const controller = new AbortController();
            running = controller;
            busy.value = true;
            error.value = undefined;
            try {
                const next = await setSirilEnabled(enabled, controller.signal);
                if (!controller.signal.aborted) status.value = next;
            } catch (err) {
                if (!controller.signal.aborted) error.value = err instanceof ApiError ? err.code : 'network';
            } finally {
                if (!controller.signal.aborted) {
                    busy.value = false;
                    running = undefined;
                }
            }
        }

        return () => {
            const current =
                status.value ?? (resource.value.state === 'ready' ? resource.value.data : undefined);
            return (
                <>
                    <div class="ap-software-item">
                        <button type="button" class="ap-software-open" onClick={props.onOpen}>
                            <span class="ap-software-item-icon" aria-hidden="true">
                                ▣
                            </span>
                            <span class="ap-software-item-copy">
                                <strong>Siril</strong>
                                <small>{t('siril.purpose')}</small>
                                <small class="ap-software-status">
                                    <span
                                        class="ap-software-dot"
                                        data-state={
                                            !current
                                                ? 'unknown'
                                                : current.state === 'ready'
                                                  ? 'ready'
                                                  : 'error'
                                        }
                                    />
                                    {!current
                                        ? t(
                                              resource.value.state === 'error'
                                                  ? 'siril.states.network'
                                                  : 'states.loading',
                                          )
                                        : current.state === 'ready'
                                          ? t('software.ready')
                                          : t('siril.states.' + current.state, current.state)}
                                </small>
                            </span>
                        </button>
                        <label class="ap-software-switch">
                            <span class="ap-software-switch-label">{t('software.enabled')}</span>
                            <input
                                type="checkbox"
                                role="switch"
                                aria-label={t('software.enableNamed', { name: 'Siril' })}
                                checked={Boolean(current?.enabled)}
                                disabled={
                                    busy.value || !current || (current.state !== 'ready' && !current.enabled)
                                }
                                onChange={(event) =>
                                    void toggle((event.currentTarget as HTMLInputElement).checked)
                                }
                            />
                            <span class="ap-software-switch-track" aria-hidden="true">
                                <span />
                            </span>
                        </label>
                    </div>
                    {error.value && (
                        <p role="alert">{t('siril.states.' + error.value, t('errors.unknown'))}</p>
                    )}
                </>
            );
        };
    },
    { props: ['onOpen'] },
);

export const SirilSettings = defineComponent(() => {
    const { t } = useI18n();
    const { resource, refresh } = useResource(getSiril, true);
    const saved = shallowRef<SoftwareStatus>();
    const showCommands = ref(false);
    const path = ref('');
    const candidates = shallowRef<Candidate[]>();
    const busy = ref(false);
    const error = shallowRef<{ code: string; detected?: string }>();
    let running: AbortController | undefined;
    onUnmounted(() => running?.abort());
    const stateText = (state: string) => t('siril.states.' + state, state);
    async function perform(action: (signal: AbortSignal) => Promise<void>) {
        running?.abort();
        const controller = new AbortController();
        running = controller;
        error.value = undefined;
        busy.value = true;
        try {
            await action(controller.signal);
        } catch (err) {
            if (!controller.signal.aborted) {
                const detected = err instanceof ApiError ? err.details?.detected : undefined;
                error.value = {
                    code: err instanceof ApiError ? err.code : 'network',
                    detected: typeof detected === 'string' ? detected : undefined,
                };
            }
        } finally {
            if (running === controller) {
                running = undefined;
                busy.value = false;
            }
        }
    }
    return () => {
        const status = saved.value ?? (resource.value.state === 'ready' ? resource.value.data : undefined);
        return (
            <>
                <div class="ap-software-title">
                    <div>
                        <h3>Siril</h3>
                        <small>{t('siril.purpose')}</small>
                    </div>
                    <span class="ap-software-version">1.4.5</span>
                </div>
                <section class="ap-software-section">
                    <p class="ap-software-status" role="status">
                        <span class="ap-software-dot" data-ready={status?.state === 'ready'} />
                        {status
                            ? stateText(status.state)
                            : t(resource.value.state === 'error' ? 'siril.states.network' : 'states.loading')}
                    </p>
                    {status?.path && (
                        <dl class="ap-software-metadata">
                            <dt>{t('siril.activePath')}</dt>
                            <dd>{status.path}</dd>
                            <dt>{t('siril.version')}</dt>
                            <dd>{status.version}</dd>
                            <dt>{t('siril.verified')}</dt>
                            <dd>
                                {status.verified_at ? new Date(status.verified_at).toLocaleString() : '—'}
                            </dd>
                        </dl>
                    )}
                </section>
                <section class="ap-software-section">
                    <button type="button" class="ap-storage-button" aria-expanded={showCommands.value}
                        onClick={() => { showCommands.value = !showCommands.value; }}>
                        {t('siril.catalogue.title')}
                    </button>
                    {showCommands.value && <SirilCommands />}
                </section>
                <section class="ap-software-section ap-software-guide">
                    <h3>{t('siril.install')}</h3>
                    <p>
                        {t(
                            'siril.install' +
                                (status?.os === 'Windows'
                                    ? 'Windows'
                                    : status?.os === 'Darwin'
                                      ? 'Mac'
                                      : 'Linux'),
                        )}
                    </p>
                    <a href="https://siril.org/download/" target="_blank" rel="noreferrer">
                        {t('siril.download')}
                    </a>
                    {' · '}
                    <a
                        href="https://siril.org/download/2026-10-28-siril-1-4-5/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('siril.release')}
                    </a>
                </section>
                <section class="ap-software-section">
                    <div class="ap-siril-actions">
                        <button
                            class="ap-storage-button"
                            type="button"
                            disabled={busy.value}
                            onClick={() =>
                                void perform(async (signal) => {
                                    candidates.value = await discoverSiril(signal);
                                })
                            }
                        >
                            {t('siril.detect')}
                        </button>
                        <button
                            class="ap-storage-button"
                            type="button"
                            disabled={busy.value}
                            onClick={() => {
                                saved.value = undefined;
                                candidates.value = undefined;
                                refresh();
                            }}
                        >
                            {t('actions.refresh')}
                        </button>
                    </div>
                    {candidates.value &&
                        (candidates.value.length ? (
                            <ul class="ap-software-candidates">
                                {candidates.value.map((row) => (
                                    <li key={row.path}>
                                        <button
                                            class="ap-storage-button"
                                            type="button"
                                            disabled={busy.value || row.state !== 'ready'}
                                            onClick={() => {
                                                path.value = row.path;
                                            }}
                                        >
                                            {t('siril.select')}
                                        </button>{' '}
                                        <code>{row.path}</code> · {row.origin} · {row.version ?? row.detected}{' '}
                                        · {stateText(row.state)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p class="ap-software-muted">{t('software.noCandidates')}</p>
                        ))}
                </section>
                <section class="ap-software-section">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            void perform(async (signal) => {
                                saved.value = await saveSiril(
                                    path.value.trim() || status?.path || '',
                                    signal,
                                );
                            });
                        }}
                    >
                        <label>
                            {t('siril.path')}
                            <input
                                value={path.value}
                                onInput={(event) => {
                                    path.value = (event.currentTarget as HTMLInputElement).value;
                                }}
                                placeholder={status?.path}
                                disabled={busy.value}
                            />
                        </label>
                        <small>{t('siril.pathHelp')}</small>
                        <div class="ap-siril-actions">
                            <button
                                class="ap-storage-button"
                                data-variant="primary"
                                disabled={busy.value || !(path.value.trim() || status?.path)}
                            >
                                {t('siril.save')}
                            </button>
                            {status?.path && (
                                <button
                                    class="ap-storage-button"
                                    type="button"
                                    disabled={busy.value}
                                    onClick={() =>
                                        void perform(async (signal) => {
                                            saved.value = await clearSiril(signal);
                                            path.value = '';
                                        })
                                    }
                                >
                                    {t('siril.clear')}
                                </button>
                            )}
                        </div>
                    </form>
                    {busy.value && <p role="status">{t('siril.verifying')}</p>}
                    {error.value && (
                        <p role="alert">
                            {stateText(error.value.code)}
                            {error.value.detected && ` · ${t('siril.version')} ${error.value.detected}`}
                        </p>
                    )}
                </section>
            </>
        );
    };
});
