import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, TextInput as RNTextInput, View } from 'react-native';

import { NOOP } from '@sendbird/uikit-utils';

import createStyleSheet from '../../styles/createStyleSheet';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Button from '../Button';
import DialogBox from '../Dialog/DialogBox';
import Modal from '../Modal';
import Text from '../Text';
import TextInput from '../TextInput';

export type PromptItem = {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit?: (text: string) => void;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

type Props = {
  visible: boolean;
  onHide: () => void;
  onDismiss?: () => void;
  autoFocus?: boolean;
} & PromptItem;
const Prompt: React.FC<Props> = ({
  onDismiss,
  visible,
  onHide,
  autoFocus = true,
  title,
  defaultValue = '',
  placeholder = 'Enter',
  onSubmit = NOOP,
  onCancel = NOOP,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const inputRef = useRef<RNTextInput>(null);

  const buttons = [
    { text: cancelLabel, onPress: onCancel },
    { text: submitLabel, onPress: () => onSubmit(text) },
  ];

  const [text, setText] = useState(defaultValue);

  useEffect(() => {
    autoFocus && visible && setTimeout(() => inputRef.current?.focus(), 250);
  }, [autoFocus, visible]);

  return (
    <Modal
      enableKeyboardAvoid
      disableBackgroundClose
      onClose={onHide}
      onDismiss={() => {
        setText('');
        onDismiss?.();
      }}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <DialogBox style={styles.container}>
        {Boolean(title) && (
          <View style={styles.titleContainer}>
            <Text h1 color={colors.ui.dialog.default.none.text} numberOfLines={1} style={{ flex: 1 }}>
              {title}
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            placeholder={placeholder}
            variant={'underline'}
            value={text}
            onChangeText={setText}
            style={{ paddingHorizontal: 0, paddingVertical: 10 }}
          />
        </View>

        <View style={styles.buttonContainer}>
          {buttons.map(({ text, onPress }, index) => {
            return (
              <Button
                key={text + index}
                variant={'text'}
                style={styles.button}
                contentColor={colors.ui.dialog.default.none.highlight}
                onPress={() => {
                  Keyboard.dismiss();
                  try {
                    onPress?.();
                  } finally {
                    onHide();
                  }
                }}
              >
                {text}
              </Button>
            );
          })}
        </View>
      </DialogBox>
    </Modal>
  );
};

const styles = createStyleSheet({
  container: {
    paddingTop: 8,
  },
  titleContainer: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
  },
  button: {
    marginLeft: 8,
  },
});

export default Prompt;