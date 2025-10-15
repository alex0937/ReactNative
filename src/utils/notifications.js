import { Alert } from 'react-native';

export const showSuccessNotification = (title, message) => {
  Alert.alert(
    title,
    message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};

export const showErrorNotification = (title, message) => {
  Alert.alert(
    title,
    message,
    [{ text: 'OK', style: 'destructive' }],
    { cancelable: true }
  );
};

export const showConfirmationDialog = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancelar', style: 'cancel', onPress: onCancel },
      { text: 'Confirmar', style: 'default', onPress: onConfirm }
    ],
    { cancelable: true }
  );
};

export const showWelcomeNotification = (nombreSocio) => {
  showSuccessNotification(
    '¡Bienvenido!',
    `${nombreSocio} ha sido registrado exitosamente en nuestro gimnasio. ¡Que comience su journey fitness! 💪`
  );
};