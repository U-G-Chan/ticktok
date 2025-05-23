# 用户内容管理 API 使用示例

## 概述

本模块提供了完整的用户内容管理功能，包括：
- 查询内容列表
- 创建新内容
- 更新现有内容
- 删除内容
- 切换喜欢状态

## API 接口

### 1. 获取内容列表

```typescript
import { getUserContentList } from '@/api/modules/userContent'

const params = {
  userId: '123456',
  listType: 'works', // 'works' | 'recommend' | 'collection' | 'likes'
  page: 1,
  pageSize: 12
}

const result = await getUserContentList(params)
console.log(result) // { items: [], total: 0, page: 1, pageSize: 12, hasMore: false }
```

### 2. 创建内容

```typescript
import { createContentItem } from '@/api/modules/userContent'

const params = {
  userId: '123456',
  listType: 'works',
  thumbnail: 'https://example.com/image.jpg',
  title: '我的新作品',
  description: '这是一个很棒的作品',
  workType: 'published', // 'draft' | 'published' | 'private'
  duration: 60,
  isPublic: true,
  tags: ['生活', '美食'],
  other: {
    customField: 'custom value'
  }
}

const newItem = await createContentItem(params)
console.log('创建成功:', newItem)
```

### 3. 更新内容

```typescript
import { updateContentItem } from '@/api/modules/userContent'

const params = {
  itemId: 'work_12345',
  userId: '123456',
  title: '更新后的标题',
  description: '更新后的描述',
  workType: 'published',
  isPublic: false
}

const updatedItem = await updateContentItem(params)
console.log('更新成功:', updatedItem)
```

### 4. 删除内容

```typescript
import { deleteContentItem } from '@/api/modules/userContent'

const result = await deleteContentItem('work_12345', '123456')
console.log('删除结果:', result) // { success: true, message: '删除成功' }
```

### 5. 切换喜欢状态

```typescript
import { toggleContentLike } from '@/api/modules/userContent'

const result = await toggleContentLike('work_12345', '123456', true)
console.log('点赞结果:', result) // { likes: 1001, isLiked: true }
```

## 使用 Hook

推荐使用 `useUserContent` Hook 来管理状态：

```typescript
import { useUserContent } from '@/pages/me/components/UserSpace/hooks/useUserContent'

export default defineComponent({
  setup() {
    const userId = '123456'
    const {
      currentTab,
      currentState,
      switchTab,
      createContent,
      updateContent,
      deleteContent,
      toggleLike,
      init
    } = useUserContent(userId)

    // 初始化
    onMounted(() => {
      init()
    })

    // 创建内容示例
    const handleCreate = async () => {
      try {
        const newItem = await createContent({
          userId,
          listType: 'works',
          thumbnail: 'https://example.com/image.jpg',
          title: '新作品',
          description: '作品描述',
          workType: 'published'
        })
        console.log('创建成功:', newItem)
      } catch (error) {
        console.error('创建失败:', error)
      }
    }

    // 删除内容示例
    const handleDelete = async (itemId: string) => {
      try {
        await deleteContent(itemId)
        console.log('删除成功')
      } catch (error) {
        console.error('删除失败:', error)
      }
    }

    return {
      currentTab,
      currentState,
      switchTab,
      handleCreate,
      handleDelete
    }
  }
})
```

## 类型定义

### CreateContentParams

```typescript
interface CreateContentParams {
  userId: string;           // 用户ID
  listType: ListType;       // 列表类型
  thumbnail: string;        // 封面图片URL
  title?: string;          // 标题
  description?: string;     // 描述
  workType?: WorkType;     // 作品类型（仅限作品）
  duration?: number;       // 时长（秒）
  tags?: string[];         // 标签
  isPublic?: boolean;      // 是否公开
  other?: object;          // 其他自定义字段
}
```

### UpdateContentParams

```typescript
interface UpdateContentParams {
  itemId: string;          // 内容项ID
  userId: string;          // 用户ID
  title?: string;          // 标题
  description?: string;     // 描述
  thumbnail?: string;       // 封面图片URL
  workType?: WorkType;     // 作品类型
  isPublic?: boolean;      // 是否公开
  tags?: string[];         // 标签
  other?: object;          // 其他自定义字段
}
```

## Mock 数据

在开发环境下，所有API都会返回Mock数据，方便开发和测试。Mock数据会模拟真实的网络延迟和数据结构。

## 错误处理

所有API都会抛出错误，建议使用 try-catch 进行错误处理：

```typescript
try {
  const result = await createContentItem(params)
  // 处理成功结果
} catch (error) {
  // 处理错误
  console.error('操作失败:', error)
  // 显示错误提示给用户
}
``` 