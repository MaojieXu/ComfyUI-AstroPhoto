import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export const AssetsPlaceholder = defineComponent(() => {
  const { t } = useI18n();
  return () => <p class="ap-scroll">{t('assets.placeholder')}</p>;
});
