/**
 * Web适配器，用于在Web环境中模拟Capacitor功能
 * 这使得我们可以在浏览器中测试应用而无需部署到实际设备
 */

// 模拟Camera
export const WebCamera = {
  async getPhoto(options: any) {
    return new Promise<any>((resolve, reject) => {
      // 创建input元素
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      
      if (options.source === 'CAMERA') {
        input.capture = 'environment' // 尝试使用相机
      }
      
      // 监听文件选择
      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement
        if (target.files && target.files[0]) {
          const file = target.files[0]
          
          // 根据请求的结果类型返回不同格式
          if (options.resultType === 'uri' || options.resultType === 'Uri') {
            const webPath = URL.createObjectURL(file)
            resolve({ webPath, path: webPath, format: 'jpeg' })
          } else if (options.resultType === 'base64' || options.resultType === 'Base64') {
            const reader = new FileReader()
            reader.onload = () => {
              const base64String = reader.result?.toString().split(',')[1]
              resolve({ base64String, format: 'jpeg' })
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
          } else if (options.resultType === 'dataUrl' || options.resultType === 'DataUrl') {
            const reader = new FileReader()
            reader.onload = () => {
              resolve({ dataUrl: reader.result, format: 'jpeg' })
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
          }
        } else {
          reject(new Error('No image selected'))
        }
      }
      
      // 触发文件选择
      input.click()
    })
  }
}

// IndexedDB 数据库管理
const DB_NAME = 'ticktok_album';
const DB_VERSION = 1;
const STORE_NAME = 'files';

// 初始化数据库
const initDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    };
  });
};

// 模拟Filesystem
export const WebFilesystem = {
  async writeFile(options: any) {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // 保存文件数据
      await store.put({
        path: options.path,
        data: options.data,
        timestamp: Date.now()
      });
      
      return { uri: options.path };
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  },

  async readdir(options: any) {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const files = request.result
            .filter(file => file.path.startsWith(options.path))
            .map(file => ({
              name: file.path.split('/').pop(),
              type: 'file',
              size: file.data.length,
              uri: file.path,
              mtime: file.timestamp
            }));
          resolve({ files });
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error reading directory:', error);
      throw error;
    }
  },

  async readFile(options: any) {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(options.path);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          if (!request.result) {
            reject(new Error('File not found'));
            return;
          }
          resolve({ data: request.result.data });
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  },

  async deleteFile(options: any) {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.delete(options.path);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async mkdir(options: any) {
    // IndexedDB 不需要显式创建目录
    console.log(`IndexedDB: 创建目录 ${options.path}`);
    return { success: true };
  }
}

// 检测是否在Capacitor环境中
export const isCapacitorAvailable = () => {
  return typeof (window as any).Capacitor !== 'undefined'
}

// 获取适当的Camera实现
export const getCamera = async () => {
  if (isCapacitorAvailable()) {
    // 在Capacitor环境中，使用真实的Camera API
    try {
      const { Camera } = await import('@capacitor/camera')
      return Camera
    } catch (error) {
      console.warn('Capacitor Camera not available, falling back to web implementation')
      return WebCamera
    }
  }
  
  // 在Web环境中，使用WebCamera
  return WebCamera
}

// 获取适当的Filesystem实现
export const getFilesystem = async () => {
  if (isCapacitorAvailable()) {
    try {
      const { Filesystem } = await import('@capacitor/filesystem')
      return Filesystem
    } catch (error) {
      console.warn('Capacitor Filesystem not available, falling back to web implementation')
      return WebFilesystem
    }
  }
  
  return WebFilesystem
}

// 导出常量
export const CameraResultType = {
  Uri: 'uri',
  Base64: 'base64',
  DataUrl: 'dataUrl'
}

export const CameraSource = {
  Prompt: 'PROMPT',
  Camera: 'CAMERA',
  Photos: 'PHOTOS'
}

export const CameraDirection = {
  Rear: 'REAR',
  Front: 'FRONT'
}

export const Directory = {
  Documents: 'DOCUMENTS',
  Data: 'DATA',
  Cache: 'CACHE',
  External: 'EXTERNAL',
  ExternalStorage: 'EXTERNAL_STORAGE'
}

// localStorage 管理工具
export const StorageManager = {
  // 获取已使用的存储空间（字节）
  getUsedSpace(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    }
    return total;
  },

  // 获取剩余可用空间（字节）
  getRemainingSpace(): number {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return Math.max(0, maxSize - this.getUsedSpace());
  },

  // 检查是否有足够空间存储数据
  hasEnoughSpace(dataSize: number): boolean {
    return this.getRemainingSpace() >= dataSize;
  },

  // 获取所有存储的键
  getAllKeys(): string[] {
    return Object.keys(localStorage);
  },

  // 获取指定前缀的所有键
  getKeysByPrefix(prefix: string): string[] {
    return this.getAllKeys().filter(key => key.startsWith(prefix));
  },

  // 删除指定前缀的所有数据
  removeByPrefix(prefix: string): void {
    this.getKeysByPrefix(prefix).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // 获取存储使用情况
  getStorageInfo() {
    const used = this.getUsedSpace();
    const total = 5 * 1024 * 1024; // 5MB
    const remaining = this.getRemainingSpace();
    const usedPercentage = (used / total * 100).toFixed(2);

    return {
      used,
      total,
      remaining,
      usedPercentage: `${usedPercentage}%`,
      itemCount: localStorage.length
    };
  }
}; 