import type { VNodeChild } from 'vue';
import type { Resource } from '../../../shared/useResource';
import { Feedback } from '../../../shared/Feedback';

export function ResourceContent<T>({ resource, loadingLabel, retry, renderContent, renderError }: {
  resource: Resource<T>;
  loadingLabel: string;
  retry: () => void;
  renderContent: (data: T) => VNodeChild;
  renderError?: (error: unknown, retry: () => void) => VNodeChild;
}) {
  if (resource.state === 'loading') return <p role="status">{loadingLabel}</p>;
  if (resource.state === 'error') return renderError
    ? <>{renderError(resource.error, retry)}</>
    : <Feedback error={resource.error} retry={retry} />;
  return <>{renderContent(resource.data)}</>;
}
ResourceContent.props = ['resource', 'loadingLabel', 'retry', 'renderContent', 'renderError'];
