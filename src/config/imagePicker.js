import * as ImagePicker from 'expo-image-picker';

export async function pickImageAsync() {
  // Solicitar permisos
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Se requieren permisos para acceder a las imágenes.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.cancelled) return null;
  return result;
}

export async function takePhotoAsync() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('Se requieren permisos para usar la cámara.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  if (result.cancelled) return null;
  return result;
}

export default { pickImageAsync, takePhotoAsync };
