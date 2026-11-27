import { defineComponent, onUnmounted, ref, shallowRef, watch } from 'vue';
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
import { notifyHost } from '../../../frontend/src/host/notify';
import { nativePicker } from '../../../frontend/src/api/nativePicker';
import { useResource } from '../../../frontend/src/shared/useResource';
import { DetailAccordion } from '../../../frontend/src/features/library/components/DetailAccordion';

type SummaryProps = { onOpen: () => void };

export const SirilSummary = defineComponent(
    (props: SummaryProps) => {
        const { t } = useI18n();
        const { resource } = useResource(getSiril, true);
        watch(resource, value => { if (value.state === 'error') notifyHost('error', t('siril.states.network')); });
        const status = shallowRef<SoftwareStatus>();
        const error = ref<string>();
        watch(error, code => { if (code) notifyHost('error', t('siril.states.' + code, t('errors.unknown'))); });
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
    const { t, locale } = useI18n();
    const { resource, refresh } = useResource(getSiril, true);
    watch(resource, value => { if (value.state === 'error') notifyHost('error', t('siril.states.network')); });
    const saved = shallowRef<SoftwareStatus>();
    const editing = ref(false);
    const manual = ref(false);
    const path = ref('');
    const candidates = shallowRef<Candidate[]>();
    const busy = ref(false);
    const activity = ref<'detect' | 'save' | 'picker' | 'clear'>();
    const pickerMessage = ref('');
    const error = shallowRef<{ code: string; detected?: string }>();
    let running: AbortController | undefined;
    onUnmounted(() => running?.abort());
    const stateText = (state: string) => t('siril.states.' + state, state);
    watch(error, value => { if (value) notifyHost('error', stateText(value.code)); });
    async function perform(kind: 'detect' | 'save' | 'picker' | 'clear', action: (signal: AbortSignal) => Promise<void>) {
        if (busy.value) return;
        const controller = new AbortController();
        running = controller;
        error.value = undefined;
        pickerMessage.value = '';
        busy.value = true;
        activity.value = kind;
        try { await action(controller.signal); }
        catch (err) {
            if (!controller.signal.aborted) {
                if (kind === 'picker') pickerMessage.value = t('siril.pickerUnavailable');
                else {
                    const detected = err instanceof ApiError ? err.details?.detected : undefined;
                    error.value = { code: err instanceof ApiError ? err.code : 'network',
                        detected: typeof detected === 'string' ? detected : undefined };
                }
            }
        } finally {
            if (running === controller) { running = undefined; busy.value = false; activity.value = undefined; }
        }
    }
    async function connect(value: string, signal: AbortSignal) {
        const result = await saveSiril(value, signal);
        if (signal.aborted) return;
        saved.value = result;
        path.value = result.path ?? value;
        editing.value = false;
        manual.value = false;
        candidates.value = undefined;
    }
    return () => {
        const status = saved.value ?? (resource.value.state === 'ready' ? resource.value.data : undefined);
        const configured = Boolean(status?.path);
        const formVisible = !configured || editing.value;
        const installKey = status?.os === 'Windows' ? 'siril.installWindows' : status?.os === 'Darwin'
            ? 'siril.installMac' : status?.os === 'Linux' ? 'siril.installLinux' : 'siril.installUnknown';
        return <>
            <div class="ap-software-title">
                <div><h3>Siril</h3><small>{t('siril.purpose')}</small></div>
                <span class="ap-software-version">{t('siril.targetVersion', { version: status?.target_version ?? '1.4.5' })}</span>
            </div>
            <section class="ap-software-section">
                <p class="ap-software-status" role="status">
                    <span class="ap-software-dot" data-ready={status?.state === 'ready'} />
                    {status ? stateText(status.state === 'ready' && !status.enabled ? 'SIRIL_DISABLED' : status.state) : t(resource.value.state === 'error' ? 'siril.states.network' : 'states.loading')}
                </p>
            </section>
            <section class="ap-software-section ap-siril-connect">
                <h3>{t('siril.connect')}</h3>
                {configured && <>
                    <dl class="ap-software-metadata">
                        <dt>{t('siril.activePath')}</dt><dd>{status?.path}</dd>
                        {status?.version && <><dt>{t('siril.version')}</dt><dd>{status.version}</dd></>}
                        {status?.verified_at && <><dt>{t('siril.verified')}</dt><dd>{new Date(status.verified_at).toLocaleString()}</dd></>}
                    </dl>
                    {!editing.value && <div class="ap-siril-actions">
                        <button class="ap-storage-button" type="button" disabled={busy.value}
                            onClick={() => { path.value = status?.path ?? ''; editing.value = true; manual.value = false; }}>{t('siril.change')}</button>
                        <button class="ap-storage-button" type="button" disabled={busy.value}
                            onClick={() => void perform('clear', async signal => {
                                saved.value = await clearSiril(signal); path.value = ''; candidates.value = undefined; editing.value = false;
                            })}>{t('siril.clear')}</button>
                    </div>}
                </>}
                {formVisible && <>
                    <div class="ap-siril-actions">
                        <button class="ap-storage-button" type="button" disabled={busy.value}
                            onClick={() => void perform('detect', async signal => {
                                candidates.value = undefined;
                                const found = await discoverSiril(signal);
                                if (signal.aborted) return;
                                const usable = found.filter(row => row.state === 'ready');
                                if (usable.length === 1) {
                                    await connect(usable[0].path, signal);
                                } else {
                                    candidates.value = usable.length ? usable : found.filter(row => row.state !== 'SIRIL_GUI_ONLY');
                                    if (!usable.length) manual.value = true;
                                }
                            })}>
                            {t('siril.detect')}
                        </button>
                        {resource.value.state === 'error' && <button class="ap-storage-button" type="button" disabled={busy.value}
                            onClick={() => { saved.value = undefined; refresh(); }}>{t('actions.refresh')}</button>}
                    </div>
                    {candidates.value && (candidates.value.length ? <><p role="status">{t(candidates.value.some(row => row.state === 'ready') ? 'siril.chooseCandidate' : 'siril.noUsable')}</p><ul class="ap-software-candidates">
                        {candidates.value.map(row => <li key={row.path}>
                            <code>{row.path}</code> · {row.version ?? row.detected ?? '—'} · {row.state === 'ready' ? t('siril.candidateReady') : stateText(row.state)}{' '}
                            {row.state === 'ready' && <button class="ap-storage-button" type="button" disabled={busy.value}
                                onClick={() => void perform('save', async signal => { await connect(row.path, signal); })}>{t('siril.connectAction')}</button>}
                        </li>)}
                    </ul></> : <p class="ap-software-muted" role="status">{t('siril.noUsable')}</p>)}
                    {!manual.value && <button class="ap-storage-button" type="button" disabled={busy.value}
                        onClick={() => { manual.value = true; }}>{t('siril.manual')}</button>}
                    {manual.value && <form onSubmit={event => {
                        event.preventDefault();
                        void perform('save', async signal => {
                            await connect(path.value.trim(), signal);
                        });
                    }}>
                        <label for="ap-siril-path">{t('siril.path')}</label>
                        <div class="ap-siril-path-row">
                            <input id="ap-siril-path" value={path.value} onInput={event => { path.value = (event.currentTarget as HTMLInputElement).value; }} disabled={busy.value} />
                            <button class="ap-storage-button" type="button" disabled={busy.value}
                                onClick={() => void perform('picker', async signal => {
                                    const result = await nativePicker('file', signal, locale.value.startsWith('zh') ? 'zh' : 'en');
                                    if (result.status === 'selected' && result.path) path.value = result.path;
                                    else if (result.status === 'busy') pickerMessage.value = t('siril.pickerBusy');
                                    else if (result.status !== 'cancelled') pickerMessage.value = t('siril.pickerUnavailable');
                                })}>{t('siril.browse')}</button>
                        </div>
                        <small>{t('siril.pathHelp')}</small>
                        {pickerMessage.value && <p role="status">{pickerMessage.value}</p>}
                        <div class="ap-siril-actions">
                            <button class="ap-storage-button" data-variant="primary" disabled={busy.value || !path.value.trim()}>{t('siril.save')}</button>
                            {configured && <button class="ap-storage-button" type="button" disabled={busy.value}
                                onClick={() => { editing.value = false; error.value = undefined; }}>{t('siril.cancelChange')}</button>}
                        </div>
                    </form>}
                </>}
                {busy.value && activity.value !== 'picker' && <p role="status">{t(activity.value === 'detect' ? 'siril.detecting' : activity.value === 'clear' ? 'siril.clearing' : 'siril.verifying')}</p>}
                {error.value && <p role="alert">{stateText(error.value.code)}{error.value.detected && ` · ${t('siril.version')} ${error.value.detected}`}</p>}
            </section>
            <section class="ap-software-section ap-software-guide">
                <h3>{t('siril.getSiril')}</h3>
                <a href="https://siril.org/download/" target="_blank" rel="noreferrer">{t('siril.download')}</a>{' · '}
                <a href="https://siril.org/download/2026-10-28-siril-1-4-5/" target="_blank" rel="noreferrer">{t('siril.release')}</a>
                <DetailAccordion title={t('siril.install')} v-slots={{ default: () => <p>{t(installKey)}</p> }} />
            </section>
        </>;
    };
});
