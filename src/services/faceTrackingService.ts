import * as faceMesh from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'

export interface FaceTrackingOptions {
    maxNumFaces?: number
    refineLandmarks?: boolean
    minDetectionConfidence?: number
    minTrackingConfidence?: number
}

export class FaceTrackingService {
    private faceMesh: faceMesh.FaceMesh | null = null
    private camera: Camera | null = null
    private videoElement: HTMLVideoElement | null = null
    private isInitialized = false
    private resultCallback: ((landmarks: faceMesh.NormalizedLandmark[], image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => void) | null = null

    constructor() {
        this.initializeFaceMesh()
    }

    /**
     * 初始化FaceMesh
     */
    private async initializeFaceMesh(options: FaceTrackingOptions = {}) {
        try {
            this.faceMesh = new faceMesh.FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`
            })
            
            this.faceMesh.setOptions({
                maxNumFaces: options.maxNumFaces || 1,
                refineLandmarks: options.refineLandmarks || false,
                minDetectionConfidence: options.minDetectionConfidence || 0.1,
                minTrackingConfidence: options.minTrackingConfidence || 0.1
            })
            
            this.faceMesh.onResults(this.onResults.bind(this))
            console.log('FaceMesh 初始化成功')
        } catch (error) {
            console.error('FaceMesh 初始化失败:', error)
        }
    }

    /**
     * 处理FaceMesh结果
     */
    private onResults(results: faceMesh.Results) {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            return
        }
        
        if (this.resultCallback) {
            this.resultCallback(results.multiFaceLandmarks[0], results.image as any)
        }
    }

    /**
     * 初始化摄像头并开始跟踪
     */
    public async initialize(videoElement: HTMLVideoElement, callback: (landmarks: faceMesh.NormalizedLandmark[], image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => void) {
        if (this.isInitialized) return

        this.resultCallback = callback
        this.videoElement = videoElement
        
        try {
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.faceMesh && this.videoElement) {
                        try {
                            await this.faceMesh.send({ image: this.videoElement })
                        } catch (error) {
                            console.error('发送视频帧到 FaceMesh 失败:', error)
                        }
                    }
                },
                width: 640,
                height: 480
            })
            
            await this.camera.start()
            this.isInitialized = true
            console.log('人脸跟踪服务初始化成功')
        } catch (error) {
            console.error('摄像头启动失败:', error)
            throw error
        }
    }

    /**
     * 停止人脸跟踪
     */
    public async stop() {
        if (this.camera) {
            await this.camera.stop()
        }
        this.isInitialized = false
        this.resultCallback = null
        console.log('人脸跟踪服务已停止')
    }
}

// 创建单例实例
export const faceTrackingService = new FaceTrackingService() 