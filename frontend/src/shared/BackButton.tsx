import Button from '@comfyorg/design-system/button/Button';
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';

export const BackButton = defineComponent({
  emits: ['back'],
  setup(_props, { emit }) {
    const { t } = useI18n();
    return () => {
      const label = t('actions.back').replace(/^←\s*/, '');
      return <Button class="ap-native-button" variant="muted-textonly" size="icon"
        aria-label={label} {...{ type: 'button', title: label, onClick: () => emit('back') }}>
        <i class="icon-[lucide--arrow-left] size-4" aria-hidden="true" />
      </Button>;
    };
  },
});
