import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Dosya tiplerini kontrol et
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Dosya boyutları (MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const validateFile = (fileData, fileType) => {
  if (!fileData) return { valid: false, error: 'Dosya verisi bulunamadı' };

  // Base64 formatını kontrol et
  const matches = fileData.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return { valid: false, error: 'Geçersiz dosya formatı' };

  const mimeType = matches[1];
  const base64Data = matches[2];
  const fileSize = Buffer.byteLength(base64Data, 'base64');

  // MIME type kontrolü
  let allowedTypes = [];
  let maxSize = 0;

  switch (fileType) {
    case 'image':
      allowedTypes = ALLOWED_IMAGE_TYPES;
      maxSize = MAX_IMAGE_SIZE;
      break;
    case 'audio':
      allowedTypes = ALLOWED_AUDIO_TYPES;
      maxSize = MAX_AUDIO_SIZE;
      break;
    case 'video':
      allowedTypes = ALLOWED_VIDEO_TYPES;
      maxSize = MAX_VIDEO_SIZE;
      break;
    default:
      return { valid: false, error: 'Desteklenmeyen dosya tipi' };
  }

  if (!allowedTypes.includes(mimeType)) {
    return { valid: false, error: `Desteklenmeyen dosya formatı: ${mimeType}` };
  }

  if (fileSize > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `Dosya boyutu ${maxSizeMB}MB'dan büyük olamaz` };
  }

  return { valid: true, mimeType, base64Data, fileSize };
};

export const saveFile = async (fileData, fileType, subFolder = '') => {
  try {
    // Önce temel kontrolleri yap
    if (!fileData) {
      throw new Error('Dosya verisi bulunamadı');
    }

    // Base64 formatını daha basit şekilde kontrol et - regex kullanma!
    if (!fileData.startsWith('data:') || !fileData.includes(';base64,')) {
      throw new Error('Geçersiz dosya formatı - Base64 bekleniyor');
    }

    // String split ile MIME type ve base64 data'yı ayır
    const parts = fileData.split(';base64,');
    if (parts.length !== 2) {
      throw new Error('Geçersiz base64 formatı');
    }

    const mimeType = parts[0].replace('data:', '');
    const base64Data = parts[1];
    
    // Dosya boyutunu kontrol et (base64'ten gerçek boyut)
    const estimatedSize = (base64Data.length * 0.75);
    console.log(`📏 Dosya boyutu tahmini: ${Math.round(estimatedSize / 1024 / 1024 * 100) / 100}MB`);
    
    // Çok büyük dosyaları reddet
    const maxSizes = {
      'image': 5 * 1024 * 1024,   // 5MB
      'audio': 20 * 1024 * 1024,  // 20MB  
      'video': 50 * 1024 * 1024   // 50MB
    };
    
    if (estimatedSize > maxSizes[fileType]) {
      const maxMB = Math.round(maxSizes[fileType] / 1024 / 1024);
      throw new Error(`Dosya boyutu ${maxMB}MB'dan büyük olamaz`);
    }

    // MIME type kontrolü
    const allowedTypes = {
      'image': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      'audio': ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
      'video': ['video/mp4', 'video/webm', 'video/quicktime']
    };

    if (!allowedTypes[fileType]?.includes(mimeType)) {
      throw new Error(`Desteklenmeyen dosya formatı: ${mimeType}`);
    }
    
    // Dosya uzantısını belirle
    const extension = getFileExtension(mimeType);
    const fileName = `${uuidv4()}.${extension}`;
    
    // Klasör yapısını oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileType, subFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Buffer'ı chunked olarak oluştur (memory overflow'u önlemek için)
    const filePath = path.join(uploadDir, fileName);
    
    try {
      // Büyük dosyalar için stream kullan
      if (base64Data.length > 1000000) { // 1MB'dan büyükse
        console.log('🔄 Büyük dosya, stream ile işleniyor...');
        
        const writeStream = fs.createWriteStream(filePath);
        
        // Base64'ü parçalara böl ve parça parça buffer'a çevir
        const chunkSize = 50000; // 50KB chunks - daha küçük
        
        for (let i = 0; i < base64Data.length; i += chunkSize) {
          const chunk = base64Data.slice(i, i + chunkSize);
          try {
            const buffer = Buffer.from(chunk, 'base64');
            writeStream.write(buffer);
          } catch (bufferError) {
            console.warn(`Chunk ${i} buffer error, skipping:`, bufferError.message);
          }
        }
        
        writeStream.end();
        
        // Stream'in bitmesini bekle
        await new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
        
        console.log('✅ Büyük dosya stream ile başarıyla kaydedildi');
      } else {
        // Küçük dosyalar için normal işlem
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);
      }
    } catch (writeError) {
      console.error('Dosya yazma hatası:', writeError);
      throw new Error(`Dosya yazma hatası: ${writeError.message}`);
    }

    // Public URL'i döndür
    const publicPath = `/uploads/${fileType}/${subFolder ? subFolder + '/' : ''}${fileName}`;
    
    return {
      success: true,
      filePath: publicPath,
      fileName,
      fileSize: estimatedSize
    };

  } catch (error) {
    console.error('Dosya kaydetme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const getFileExtension = (mimeType) => {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov'
  };
  
  return extensions[mimeType] || 'bin';
};

export const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true };
    }
    return { success: false, error: 'Dosya bulunamadı' };
  } catch (error) {
    console.error('Dosya silme hatası:', error);
    return { success: false, error: error.message };
  }
};
