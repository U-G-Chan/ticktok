import { ref } from 'vue'

// 生成随机评论数据
function generateComments() {
  const commentCount = Math.floor(Math.random() * 5); // 0-4条评论
  const comments = [];
  
  for (let i = 0; i < commentCount; i++) {
    comments.push({
      id: `comment_${Date.now()}_${i}`,
      authorId: `user_${Math.floor(Math.random() * 1000)}`,
      authorName: ['小明', '阳光', '清风', '星辰', '大海', '山川', '云朵', '雨滴'][Math.floor(Math.random() * 8)],
      authorAvatar: `https://picsum.photos/seed/${Math.random()}/100/100`,
      content: [
        '太美了，很喜欢这种风格！',
        '分享一下拍摄的地点吧？',
        '颜色搭配很好看，喜欢！',
        '请问用的什么相机拍的呀？',
        '这个地方我也去过，真的很棒！',
        '旅行的意义就是遇见更美的风景！',
        '喜欢这种氛围感，拍得真好',
        '已经保存下来了，下次我也要去！'
      ][Math.floor(Math.random() * 8)],
      createdAt: `0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 20) + 10}`,
      location: ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '西安'][Math.floor(Math.random() * 8)],
      likes: Math.floor(Math.random() * 10)
    });
  }
  
  return comments;
}

// 生成50条博客数据
function generateBlogList() {
  const blogs = [];
  const tags = ['#旅行', '#摄影', '#美食', '#时尚', '#生活', '#音乐', '#电影', '#阅读', '#健身', '#宠物', '#护肤', '#彩妆', '#穿搭', '#家居', '#手工', '#咖啡', '#甜品', '#氛围感', '#阳光是最好的滤镜'];
  
  for (let i = 1; i <= 50; i++) {
    // 随机生成1-3个标签
    const blogTags = [];
    const tagCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < tagCount; j++) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      if (!blogTags.includes(randomTag)) {
        blogTags.push(randomTag);
      }
    }
    
    // 随机生成1-5张图片
    const imageCount = Math.floor(Math.random() * 5) + 1;
    const images = [];
    for (let k = 0; k < imageCount; k++) {
      images.push(`https://picsum.photos/seed/${i}_${k}/400/600`);
    }
    
    blogs.push({
      id: i,
      authorId: `user_${Math.floor(Math.random() * 100)}`,
      authorName: ['时光旅行者', '山野', '城市猎人', '咖啡师', '摄影师', '厨艺达人', '旅行家', '设计师', '音乐人', '文字控'][Math.floor(Math.random() * 10)],
      authorAvatar: `https://picsum.photos/seed/author_${i}/200/200`,
      title: [
        '今日份的氛围感',
        '城市的角落总有惊喜',
        '记录生活中的小确幸',
        '周末的咖啡馆时光',
        '旅行中遇见的风景',
        '这家店的美食绝了',
        '分享我的穿搭日记',
        '阳光正好的午后',
        '城市漫步的收获',
        '这个季节的专属色彩'
      ][Math.floor(Math.random() * 10)],
      coverImg: images[0], // 第一张图作为封面
      images: images,
      content: [
        '生活不止眼前的苟且，还有诗和远方。',
        '有时候，静静地发呆也是一种享受。',
        '记录生活中的每一个瞬间，珍惜当下的美好。',
        '城市的喧嚣中，找到属于自己的宁静角落。',
        '美好的事物总是令人心动，就像初见那般。',
        '光影交错间，定格最美的瞬间。',
        '慢下来，才能发现身边的美好。',
        '旅行的意义不在远方，而在于见识不同的风景。',
        '美食是治愈生活的良药，也是联结情感的纽带。',
        '在平凡的日子里，创造属于自己的小确幸。'
      ][Math.floor(Math.random() * 10)],
      tags: blogTags,
      createdAt: `0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 20) + 10}`,
      likes: Math.floor(Math.random() * 9999),
      comments: generateComments(),
      forwards: Math.floor(Math.random() * 99),
      stars: Math.floor(Math.random() * 999),
      isFollowing: Math.random() > 0.5
    });
  }
  
  return blogs;
}

// 模拟博客数据
const blogList = ref(generateBlogList());

// 分页获取博客数据
export const getBlogPosts = (page = 1, pageSize = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageBlogs = blogList.value.slice(start, end);
      
      resolve({
        list: pageBlogs,
        total: blogList.value.length,
        page,
        pageSize,
        hasMore: end < blogList.value.length
      });
    }, 300); // 模拟网络延迟
  });
};

// 获取单个博客详情
export const getBlogDetail = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const blog = blogList.value.find(item => item.id === Number(id));
      resolve(blog || null);
    }, 300);
  });
};

// 搜索博客
export const searchBlogs = (keyword, page = 1, pageSize = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = keyword 
        ? blogList.value.filter(blog => 
            blog.title.includes(keyword) || 
            blog.content.includes(keyword) ||
            blog.tags.some(tag => tag.includes(keyword)) ||
            blog.authorName.includes(keyword)
          )
        : blogList.value;
        
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageBlogs = filtered.slice(start, end);
      
      resolve({
        list: pageBlogs,
        total: filtered.length,
        page,
        pageSize,
        hasMore: end < filtered.length
      });
    }, 300);
  });
}; 