import { GarbageLevel, VehicleType } from '../types';

export interface AnalysisResult {
  garbageLevel: GarbageLevel;
  vehicle: VehicleType;
  confidence: number;
}

/**
 * Mock AI image analysis using canvas to detect "dark pixels"
 * Simulates garbage level detection based on pixel intensity
 */
export const analyzeGarbageImage = (imageFile: File): Promise<AnalysisResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Create canvas for pixel analysis
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Canvas context not available');
          }
          
          // Set canvas size (use smaller size for faster processing)
          const maxSize = 200;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Get pixel data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          let darkPixelCount = 0;
          let totalPixels = pixels.length / 4;
          let totalBrightness = 0;
          
          // Analyze pixels
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // Calculate brightness (0-255)
            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;
            
            // Count dark pixels (threshold: 100)
            if (brightness < 100) {
              darkPixelCount++;
            }
          }
          
          // Calculate metrics
          const darkPixelRatio = darkPixelCount / totalPixels;
          const avgBrightness = totalBrightness / totalPixels;
          
          // Determine garbage level based on dark pixel ratio and brightness
          // More dark pixels and lower brightness = more garbage
          let garbageLevel: GarbageLevel;
          let confidence: number;
          
          if (darkPixelRatio > 0.4 || avgBrightness < 80) {
            garbageLevel = 'high';
            confidence = 0.85 + Math.random() * 0.1;
          } else if (darkPixelRatio > 0.25 || avgBrightness < 120) {
            garbageLevel = 'medium';
            confidence = 0.75 + Math.random() * 0.15;
          } else {
            garbageLevel = 'low';
            confidence = 0.70 + Math.random() * 0.2;
          }
          
          // Add some randomness for realism
          const random = Math.random();
          if (random < 0.15) {
            // 15% chance to adjust level
            if (garbageLevel === 'low') garbageLevel = 'medium';
            else if (garbageLevel === 'high') garbageLevel = 'medium';
          }
          
          resolve({
            garbageLevel,
            vehicle: garbageLevel === 'high' ? 'large' : 'small',
            confidence: Math.round(confidence * 100) / 100
          });
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(imageFile);
  });
};

/**
 * Convert file to base64 for storage
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
