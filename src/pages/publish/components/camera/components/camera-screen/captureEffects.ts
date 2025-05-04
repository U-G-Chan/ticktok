// 拍照效果类型定义
export type CaptureEffectType = 'zoom' | 'flash' | 'shutter' | 'scan' | 'pulse';

// 不同效果的持续时间（毫秒）
export const effectDurations: Record<CaptureEffectType, number> = {
    zoom: 300,
    flash: 200,
    shutter: 400,
    scan: 600,
    pulse: 800
};

// 拍照效果的CSS类名映射
export const effectClassMap: Record<CaptureEffectType, string> = {
    zoom: 'capture-effect',
    flash: 'flash-effect',
    shutter: 'shutter-effect',
    scan: 'scan-effect',
    pulse: 'pulse-effect'
};

// 拍照效果列表（用于文档和类型提示）
export const availableEffects: Array<{
    type: CaptureEffectType;
    name: string;
    description: string;
}> = [
    {
        type: 'zoom',
        name: '缩放',
        description: '简单的缩小和透明度变化'
    },
    {
        type: 'flash',
        name: '闪光',
        description: '类似相机闪光灯的白色闪光'
    },
    {
        type: 'shutter',
        name: '快门',
        description: '模拟相机快门关闭和打开'
    },
    {
        type: 'scan',
        name: '扫描',
        description: '从上到下的扫描线'
    },
    {
        type: 'pulse',
        name: '脉冲',
        description: '相机边缘的脉冲动画'
    }
];

// 拍照效果CSS样式（用于文档参考）
export const effectStyles = `
/* 1. 基础缩放效果 */
.capture-effect {
    transform: scale(0.95);
    opacity: 0.9;
}

/* 2. 闪光灯效果 */
.flash-effect {
    position: relative;
}

.flash-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    animation: flash 0.2s ease-out;
    pointer-events: none;
    z-index: 3;
}

@keyframes flash {
    from { opacity: 1; }
    to { opacity: 0; }
}

/* 3. 快门效果 */
.shutter-effect {
    animation: shutter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@keyframes shutter {
    0% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(1);
    }
    15% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(0.97);
    }
    30% { 
        clip-path: inset(50% 0% 50% 0%);
        transform: scale(0.9);
    }
    50% { 
        clip-path: inset(50% 50% 50% 50%);
        transform: scale(0.9);
    }
    80% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(0.95);
    }
    100% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(1);
    }
}

/* 4. 扫描线效果 */
.scan-effect {
    position: relative;
}

.scan-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: rgba(0, 255, 255, 0.8);
    box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
    z-index: 5;
    animation: scanLine 0.6s linear;
    pointer-events: none;
}

@keyframes scanLine {
    from { top: 0; }
    to { top: 100%; }
}

/* 5. 脉冲边框效果 */
.pulse-effect {
    position: relative;
    transform: scale(0.98);
    transition: transform 0.2s;
}

.pulse-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid #fe2c55;
    z-index: 5;
    animation: pulseBorder 0.8s ease-out;
    pointer-events: none;
}

@keyframes pulseBorder {
    0% { 
        opacity: 1;
        transform: scale(0.95);
    }
    50% { 
        opacity: 0.5;
        transform: scale(1.02);
    }
    100% { 
        opacity: 0;
        transform: scale(1.05);
    }
}
`;

/**
 * 创建拍照效果的类绑定对象
 * @param effectType 当前效果类型
 * @param isActive 效果是否激活
 * @returns 绑定到组件class的对象
 */
export function createEffectClassBinding(
    effectType: CaptureEffectType,
    isActive: boolean
): Record<string, boolean> {
    const binding: Record<string, boolean> = {
        'capture-effect': isActive
    };
    
    // 添加特定效果的类
    if (isActive && effectType !== 'zoom') {
        binding[effectClassMap[effectType]] = true;
    }
    
    return binding;
}

/**
 * 获取效果持续时间
 * @param effectType 效果类型
 * @returns 持续时间（毫秒）
 */
export function getEffectDuration(effectType: CaptureEffectType): number {
    return effectDurations[effectType] || 300;
} 