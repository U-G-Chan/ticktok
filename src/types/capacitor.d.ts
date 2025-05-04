declare module '@capacitor/camera' {
  export interface CameraPhoto {
    base64String?: string;
    dataUrl?: string;
    path?: string;
    webPath?: string;
    exif?: any;
    format?: string;
    saved?: boolean;
  }

  export enum CameraResultType {
    Uri = 'uri',
    Base64 = 'base64',
    DataUrl = 'dataUrl'
  }

  export enum CameraSource {
    Prompt = 'PROMPT',
    Camera = 'CAMERA',
    Photos = 'PHOTOS'
  }

  export enum CameraDirection {
    Rear = 'REAR',
    Front = 'FRONT'
  }

  export interface CameraOptions {
    quality?: number;
    allowEditing?: boolean;
    resultType?: CameraResultType;
    saveToGallery?: boolean;
    width?: number;
    height?: number;
    correctOrientation?: boolean;
    source?: CameraSource;
    direction?: CameraDirection;
    presentationStyle?: 'fullscreen' | 'popover';
    webUseInput?: boolean;
    promptLabelHeader?: string;
    promptLabelCancel?: string;
    promptLabelPhoto?: string;
    promptLabelPicture?: string;
  }

  export interface Camera {
    getPhoto(options: CameraOptions): Promise<CameraPhoto>;
  }

  export const Camera: Camera;
}

declare module '@capacitor/filesystem' {
  export enum Directory {
    Documents = 'DOCUMENTS',
    Data = 'DATA',
    Cache = 'CACHE',
    External = 'EXTERNAL',
    ExternalStorage = 'EXTERNAL_STORAGE'
  }

  export interface FileWriteOptions {
    path: string;
    data: string;
    directory?: Directory;
    encoding?: string;
    recursive?: boolean;
  }

  export interface FileWriteResult {
    uri: string;
  }

  export interface Filesystem {
    writeFile(options: FileWriteOptions): Promise<FileWriteResult>;
  }

  export const Filesystem: Filesystem;
} 