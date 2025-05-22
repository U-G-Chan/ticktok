<template>
    <div class="info-editor">
        <!-- 标题输入框 -->
        <div class="title-input">
            <input type="text" v-model="title" placeholder="添加标题" @input="updateTitle" />
        </div>

        <!-- 作品描述输入框 -->
        <div class="description-input">
            <div class="textarea-wrapper">
                <div v-html="formattedDescription" class="description-display"></div>
                <textarea 
                    v-model="description" 
                    placeholder="添加作品描述..." 
                    @input="updateDescription"
                    ref="descriptionTextarea"
                ></textarea>
            </div>
        </div>

        <!-- 标签选项按钮栏 -->
        <div class="tag-options">
            <div class="tag-buttons">
                <button class="tag-button" @click="showTopics = !showTopics">
                    #话题
                </button>
                <button class="tag-button" @click="showMentions = !showMentions">
                    @朋友
                </button>
            </div>
            <div class="expand-button">
                <icon-expand-text-input theme="two-tone" size="20" fill="#333333"/>
            </div>
        </div>

        <!-- 标签推荐栏 -->
        <div class="tag-recommendations">
            <div 
                v-for="tag in recommendedTags" 
                :key="tag" 
                class="tag-item" 
                :class="{ active: activeTopics.includes(tag) }"
                @click="addTopic(tag)"
            >
                #{{ tag }}
            </div>
        </div>

        <!-- 位置选项栏 -->
        <div class="location-option" @click="toggleLocationPicker">
            <icon-local-two theme="outline" size="25" fill="#000000"/>
            <span class="location-text">{{ location ? location.name : '你在哪里' }}</span>
            <icon-right theme="outline" size="25" fill="#9b9b9b"/>
        </div>

        <!-- 标签选项栏 -->
        <div class="tag-option" @click="toggleTagPicker">
            <icon-system theme="outline" size="25" fill="#000000"/>
            <span class="tag-text">添加标签</span>
            <icon-right theme="outline" size="25" fill="#9b9b9b"/>
        </div>

        <!-- 权限设置栏 -->
        <div class="visibility-option" @click="toggleVisibilityPicker">
            <icon-unlock theme="outline" size="25" fill="#000000"/>
            <span class="visibility-text">{{ visibilityText }}</span>
            <icon-right theme="outline" size="25" fill="#9b9b9b"/>
        </div>

        <!-- 高级设置栏 -->
        <div class="advanced-option" @click="toggleAdvancedSettings">
            <icon-setting-two theme="outline" size="25" fill="#000000"/>
            <span class="advanced-text">高级设置</span>
            <icon-right theme="outline" size="25" fill="#9b9b9b"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed, onMounted, nextTick } from 'vue';
import { getTopics } from '@/api/modules/publish';

// 位置信息类型
interface Location {
    name: string;
    address?: string;
    longitude?: number;
    latitude?: number;
}

export default defineComponent({
    name: 'InfoEditor',
    props: {
        initialTitle: {
            type: String,
            default: ''
        },
        initialDescription: {
            type: String,
            default: ''
        },
        initialTopics: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        initialMentions: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        initialLocation: {
            type: Object as PropType<Location>,
            default: null
        },
        initialTags: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        initialVisibility: {
            type: String as PropType<'public' | 'friends' | 'private'>,
            default: 'public'
        }
    },
    emits: ['update:title', 'update:description', 'update:topics', 'update:mentions',
        'update:location', 'update:tags', 'update:visibility'],
    setup(props, { emit }) {
        // 表单状态
        const title = ref(props.initialTitle);
        const description = ref(props.initialDescription);
        const topicsList = ref<string[]>(props.initialTopics);
        // const mentionsList = ref<string[]>(props.initialMentions);
        const location = ref<Location | null>(props.initialLocation);
        // const tagsList = ref<string[]>(props.initialTags);
        const visibility = ref<'public' | 'friends' | 'private'>(props.initialVisibility);

        // UI 状态
        const showTopics = ref(false);
        const showMentions = ref(false);
        
        // 推荐标签
        const recommendedTags = ref<string[]>([]);
        // 活跃标签列表
        const activeTopics = ref<string[]>([]);
        // 描述文本框
        const descriptionTextarea = ref<HTMLTextAreaElement | null>(null);

        // 加载话题列表
        onMounted(async () => {
            try {
                // 使用API获取推荐标签
                recommendedTags.value = await getTopics();
            } catch (error) {
                console.error('获取话题列表失败:', error);
                // 如果API获取失败，使用默认标签
                recommendedTags.value = [
                    '获取话题列表失败', 
                ];
            }
        });

        // 计算可见性文本
        const visibilityText = computed(() => {
            switch (visibility.value) {
                case 'public': return '公开·所有人可见';
                case 'friends': return '朋友可见';
                case 'private': return '仅自己可见';
                default: return '公开·所有人可见';
            }
        });

        // 计算属性：格式化描述文本，高亮标签
        const formattedDescription = computed(() => {
            if (!description.value) return '';
            
            // 使用正则表达式匹配标签并添加高亮样式
            // 匹配#开头的单词直到空格或标点符号
            return description.value.replace(/#[\u4e00-\u9fa5a-zA-Z0-9_]+/g, '<span class="highlight-tag">$&</span>');
        });

        // 更新标题
        const updateTitle = () => {
            emit('update:title', title.value);
        };

        // 更新描述
        const updateDescription = () => {
            emit('update:description', description.value);
            
            // 保存当前光标位置
            const textarea = descriptionTextarea.value;
            if (textarea) {
                const selectionStart = textarea.selectionStart;
                const selectionEnd = textarea.selectionEnd;
                
                // 等待DOM更新后恢复光标位置
                nextTick(() => {
                    if (textarea) {
                        textarea.selectionStart = selectionStart;
                        textarea.selectionEnd = selectionEnd;
                    }
                });
            }
        };

        // 添加话题
        const addTopic = (topic: string) => {
            // 如果标签已经存在，则删除它
            if (topicsList.value.includes(topic)) {
                topicsList.value = topicsList.value.filter(t => t !== topic);
                activeTopics.value = activeTopics.value.filter(t => t !== topic);
                
                // 从描述中删除对应的标签
                description.value = description.value.replace(new RegExp(`\\s?#${topic}\\s?`), ' ');
                emit('update:topics', topicsList.value);
                emit('update:description', description.value);
            } else {
                // 否则添加标签
                topicsList.value.push(topic);
                activeTopics.value.push(topic);
                emit('update:topics', topicsList.value);

                // 在描述中添加话题标签
                description.value += ` #${topic} `;
                emit('update:description', description.value);
                
                // 获取焦点
                nextTick(() => {
                    if (descriptionTextarea.value) {
                        descriptionTextarea.value.focus();
                    }
                });
            }
        };

        // 切换位置选择器
        const toggleLocationPicker = () => {
            console.log('打开位置选择器');
            // 实际实现需要一个位置选择器组件
        };

        // 切换标签选择器
        const toggleTagPicker = () => {
            console.log('打开标签选择器');
            // 实际实现需要一个标签选择器组件
        };

        // 切换可见性选择器
        const toggleVisibilityPicker = () => {
            console.log('打开可见性选择器');
            // 实际实现可以是一个弹出菜单或对话框
        };

        // 切换高级设置
        const toggleAdvancedSettings = () => {
            console.log('打开高级设置');
            // 实际实现可以是一个弹出对话框
        };

        return {
            title,
            description,
            location,
            showTopics,
            showMentions,
            topicsList,
            recommendedTags,
            visibilityText,
            formattedDescription,
            updateTitle,
            updateDescription,
            addTopic,
            toggleLocationPicker,
            toggleTagPicker,
            toggleVisibilityPicker,
            toggleAdvancedSettings,
            descriptionTextarea,
            activeTopics
        };
    }
});
</script>

<style scoped>
.info-editor {
    width: 100%;
    padding: 15px;
}

/* 全局 span 样式设置 */
.info-editor span {
    font-style: normal;
    font-size: 18px;
    color: #222222;
}

.title-input {
    padding-top: 15px;
    padding-bottom: 15px;
}

.title-input input {
    width: 100%;
    border: none;
    font-size: 18px;
    font-weight: bold;
    outline: none;
}

.description-input {
    padding-top: 15px;
    padding-bottom: 15px;
}

.textarea-wrapper {
    position: relative;
}

.description-input textarea {
    width: 100%;
    min-height: 80px;
    border: none;
    font-size: 16px;
    outline: none;
    resize: none;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    line-height: 1.5;
    background-color: transparent;
    color: transparent;
    caret-color: #333; /* 让光标可见 */
}

.description-input .description-display {
    width: 100%;
    min-height: 80px;
    border: none;
    font-size: 16px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    line-height: 1.5;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    color: #333;
    z-index: 1;
    padding: 0;
}

.tag-options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.tag-buttons {
    display: flex;
}

.tag-button {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.expand-button {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color:#f5f5f5;
    border-radius: 10%;
}

.tag-recommendations {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 15px;
    padding: 10px 0;
    gap: 10px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    -webkit-overflow-scrolling: touch; /* 平滑滚动 */
}

.tag-recommendations::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

.tag-item {
    display: inline-block;
    flex-shrink: 0;
    margin-right: 8px;
    margin-bottom: 0;
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    background-color: #f5f5f5;
    color: #333;
    border: none;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.tag-item:hover {
    background-color: #e6f7ff;
    color: #1890ff;
}

.tag-item.active {
    background-color: #e6f7ff;
    color: #1890ff;
}

/* 定义标签高亮样式 */
:deep(.highlight-tag) {
    color: #1890ff;
    font-weight: 500;
}

.location-option,
.tag-option,
.visibility-option,
.advanced-option {
    font-size: 18px;
    display: flex;
    align-items: center;
    padding: 15px 0;
    cursor: pointer;

}

.location-icon,
.tag-icon,
.visibility-icon,
.advanced-icon {
    margin-right: 10px;
}

.location-text,
.tag-text,
.visibility-text,
.advanced-text {
    flex: 1;
    color: #666;
    padding-left: 10px;
}

.arrow-icon {
    color: #999;
    font-size: 18px;
}

/* 单独对textarea中的#标签应用样式 */
.description-input textarea::selection {
    background-color: rgba(24, 144, 255, 0.1);
}
</style>