import Resizer from 'react-image-file-resizer';
import axios from 'axios';

export const resizeImage = (file, maxWidth, maxHeight) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG',
      100,
      0,
      (uri) => resolve(uri),
      'file'
    );
  });

export const handleImageUpload = async (file, width, height) => {
  try {
    const resizedFile = await resizeImage(file, width, height);
    const formData = new FormData();
    formData.append('image', resizedFile);

    const response = await axios.post('/Uploads/editor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    return `\n\n![Uploaded image](${response.data})`;
  } catch (error) {
    console.error('Image upload failed:', error);
    alert('Failed to upload image. Please try again.');
    return null;
  }
};