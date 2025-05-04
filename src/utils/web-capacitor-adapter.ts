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

// 模拟Filesystem
export const WebFilesystem = {
  async writeFile(options: any) {
    // 在Web环境中，我们可以将文件保存到localStorage或IndexedDB
    // 这里我们简单地将Base64数据保存到localStorage
    try {
      const key = `file_${options.path.replace(/\//g, '_')}`
      localStorage.setItem(key, options.data)
      return { uri: key }
    } catch (error) {
      console.error('Error saving file:', error)
      throw error
    }
  },

  async readdir(options: any) {
    // 在Web环境中，模拟目录读取功能
    try {
      const prefix = `file_${options.path.replace(/\//g, '_')}`
      const files = []
      
      // 遍历localStorage，查找指定前缀的项
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          // 提取文件名
          const fileName = key.substring(prefix.length + 1) // +1 是为了跳过下划线
          files.push({
            name: fileName || `file_${i}.jpeg`, // 提供默认文件名
            type: 'file',
            size: localStorage.getItem(key)?.length || 0,
            uri: key,
            mtime: Date.now()
          })
        }
      }
      
      return { files }
    } catch (error) {
      console.error('Error reading directory:', error)
      throw error
    }
  },

  async readFile(options: any) {
    // 从localStorage读取文件
    try {
      const key = `file_${options.path.replace(/\//g, '_')}`
      const data = localStorage.getItem(key)
      
      if (data === null) {
        throw new Error('File not found')
      }
      
      return { data }
    } catch (error) {
      console.error('Error reading file:', error)
      throw error
    }
  },

  async deleteFile(options: any) {
    // 从localStorage删除文件
    try {
      const key = `file_${options.path.replace(/\//g, '_')}`
      localStorage.removeItem(key)
      return { success: true }
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  },

  async mkdir(options: any) {
    // 在Web环境中，目录创建是隐式的，不需要实际操作
    // 记录尝试创建的目录信息
    console.log(`Web模拟: 创建目录 ${options.path} 在 ${options.directory}`);
    return { success: true }
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