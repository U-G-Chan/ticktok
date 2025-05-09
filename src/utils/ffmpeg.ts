import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class FFmpegService {
  private ffmpeg: FFmpeg;
  private loaded: boolean = false;

  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  async load() {
    if (this.loaded) return;

    // 加载FFmpeg核心文件
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`/ffmpeg/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`/ffmpeg/ffmpeg-core.wasm`, 'application/wasm'),
    });

    this.loaded = true;
  }

  // 视频转码
  async transcode(inputFile: File, outputFormat: string): Promise<Blob> {
    if (!this.loaded) await this.load();

    const inputFileName = 'input.' + inputFile.name.split('.').pop();
    const outputFileName = 'output.' + outputFormat;

    // 写入输入文件
    await this.ffmpeg.writeFile(inputFileName, await fetchFile(inputFile));

    // 执行转码命令
    await this.ffmpeg.exec([
      '-i', inputFileName,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      outputFileName
    ]);

    // 读取输出文件
    const data = await this.ffmpeg.readFile(outputFileName);
    return new Blob([data], { type: `video/${outputFormat}` });
  }

  // 视频压缩
  async compress(inputFile: File, quality: number = 23): Promise<Blob> {
    if (!this.loaded) await this.load();

    const inputFileName = 'input.' + inputFile.name.split('.').pop();
    const outputFileName = 'output.mp4';

    await this.ffmpeg.writeFile(inputFileName, await fetchFile(inputFile));

    await this.ffmpeg.exec([
      '-i', inputFileName,
      '-c:v', 'libx264',
      '-crf', quality.toString(),
      '-c:a', 'aac',
      outputFileName
    ]);

    const data = await this.ffmpeg.readFile(outputFileName);
    return new Blob([data], { type: 'video/mp4' });
  }

  // 视频剪切
  async trim(inputFile: File, startTime: string, duration: string): Promise<Blob> {
    if (!this.loaded) await this.load();

    const inputFileName = 'input.' + inputFile.name.split('.').pop();
    const outputFileName = 'output.mp4';

    await this.ffmpeg.writeFile(inputFileName, await fetchFile(inputFile));

    await this.ffmpeg.exec([
      '-i', inputFileName,
      '-ss', startTime,
      '-t', duration,
      '-c', 'copy',
      outputFileName
    ]);

    const data = await this.ffmpeg.readFile(outputFileName);
    return new Blob([data], { type: 'video/mp4' });
  }

  // 视频截图
  async takeScreenshot(inputFile: File, time: string): Promise<Blob> {
    if (!this.loaded) await this.load();

    const inputFileName = 'input.' + inputFile.name.split('.').pop();
    const outputFileName = 'screenshot.jpg';

    await this.ffmpeg.writeFile(inputFileName, await fetchFile(inputFile));

    await this.ffmpeg.exec([
      '-i', inputFileName,
      '-ss', time,
      '-vframes', '1',
      outputFileName
    ]);

    const data = await this.ffmpeg.readFile(outputFileName);
    return new Blob([data], { type: 'image/jpeg' });
  }
}

export const ffmpegService = new FFmpegService(); 