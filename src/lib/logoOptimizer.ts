import html2canvas from 'html2canvas';

interface LogoOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
  backgroundColor?: string;
}

export class LogoOptimizer {
  private options: Required<LogoOptimizationOptions>;

  constructor(options: LogoOptimizationOptions = {}) {
    this.options = {
      maxWidth: options.maxWidth || 300,
      maxHeight: options.maxHeight || 150,
      quality: options.quality || 0.8,
      format: options.format || 'png',
      backgroundColor: options.backgroundColor || 'transparent',
    };
  }

  async optimizeFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const optimizedDataUrl = this.processImage(img);
          resolve(optimizedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  async optimizeFromUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const optimizedDataUrl = this.processImage(img);
          resolve(optimizedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image from URL'));
      img.src = url;
    });
  }

  async optimizeFromElement(element: HTMLElement): Promise<string> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: this.options.backgroundColor === 'transparent' ? null : this.options.backgroundColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      return this.processCanvas(canvas);
    } catch (error) {
      throw new Error('Failed to optimize element as image');
    }
  }

  private processImage(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Calculate optimal dimensions
    const { width, height } = this.calculateDimensions(img.naturalWidth, img.naturalHeight);
    canvas.width = width;
    canvas.height = height;

    // Set background if not transparent
    if (this.options.backgroundColor !== 'transparent') {
      ctx.fillStyle = this.options.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw image with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    return this.processCanvas(canvas);
  }

  private processCanvas(canvas: HTMLCanvasElement): string {
    const mimeType = this.getMimeType();
    return canvas.toDataURL(mimeType, this.options.quality);
  }

  private calculateDimensions(originalWidth: number, originalHeight: number): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Scale down if too large
    if (width > this.options.maxWidth) {
      height = (height * this.options.maxWidth) / width;
      width = this.options.maxWidth;
    }

    if (height > this.options.maxHeight) {
      width = (width * this.options.maxHeight) / height;
      height = this.options.maxHeight;
    }

    // Ensure dimensions are integers
    return {
      width: Math.floor(width),
      height: Math.floor(height),
    };
  }

  private getMimeType(): string {
    switch (this.options.format) {
      case 'jpeg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      case 'png':
      default:
        return 'image/png';
    }
  }

  // Static utility methods
  static async optimizeLogo(file: File, options?: LogoOptimizationOptions): Promise<string> {
    const optimizer = new LogoOptimizer(options);
    return optimizer.optimizeFromFile(file);
  }

  static async optimizeLogoFromUrl(url: string, options?: LogoOptimizationOptions): Promise<string> {
    const optimizer = new LogoOptimizer(options);
    return optimizer.optimizeFromUrl(url);
  }

  static async optimizeLogoElement(element: HTMLElement, options?: LogoOptimizationOptions): Promise<string> {
    const optimizer = new LogoOptimizer(options);
    return optimizer.optimizeFromElement(element);
  }
}

// Utility functions for common logo optimization tasks
export const optimizeCompanyLogo = async (file: File): Promise<string> => {
  return LogoOptimizer.optimizeLogo(file, {
    maxWidth: 300,
    maxHeight: 150,
    quality: 0.9,
    format: 'png',
    backgroundColor: 'transparent',
  });
};

export const createPrintReadyLogo = async (logoUrl: string): Promise<string> => {
  return LogoOptimizer.optimizeLogoFromUrl(logoUrl, {
    maxWidth: 200,
    maxHeight: 100,
    quality: 1.0,
    format: 'png',
    backgroundColor: 'white',
  });
};