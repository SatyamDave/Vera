export interface BlueprintModel {
  name: string;
  fields: string[];
  relations?: string[];
}

export interface BlueprintAPI {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
}

export interface BlueprintAIBlock {
  name: string;
  type: 'summarizer' | 'chat' | 'classifier' | 'generator' | 'translator';
  description: string;
}

export interface ApplicationBlueprint {
  name: string;
  description: string;
  models: BlueprintModel[];
  apis: BlueprintAPI[];
  aiBlocks: BlueprintAIBlock[];
  features: string[];
}

// Predefined blueprints for common application types
const BLUEPRINTS: Record<string, ApplicationBlueprint> = {
  blog: {
    name: 'Blog Application',
    description: 'A full-featured blog with AI-powered content summarization',
    models: [
      {
        name: 'Post',
        fields: ['id', 'title', 'content', 'summary', 'authorId', 'publishedAt', 'tags'],
        relations: ['author', 'comments']
      },
      {
        name: 'User',
        fields: ['id', 'name', 'email', 'avatar', 'role'],
        relations: ['posts', 'comments']
      },
      {
        name: 'Comment',
        fields: ['id', 'content', 'authorId', 'postId', 'createdAt'],
        relations: ['author', 'post']
      }
    ],
    apis: [
      { name: 'getPosts', method: 'GET', path: '/api/posts', description: 'Get all blog posts' },
      { name: 'getPost', method: 'GET', path: '/api/posts/[id]', description: 'Get a specific post' },
      { name: 'createPost', method: 'POST', path: '/api/posts', description: 'Create a new post' },
      { name: 'updatePost', method: 'PUT', path: '/api/posts/[id]', description: 'Update a post' },
      { name: 'deletePost', method: 'DELETE', path: '/api/posts/[id]', description: 'Delete a post' }
    ],
    aiBlocks: [
      {
        name: 'summarizer',
        type: 'summarizer',
        description: 'AI-powered content summarization for blog posts'
      }
    ],
    features: ['User Authentication', 'Rich Text Editor', 'AI Summarization', 'Comments System', 'Tags & Categories']
  },
  chatbot: {
    name: 'Chatbot Application',
    description: 'An AI-powered chatbot with conversation history',
    models: [
      {
        name: 'Message',
        fields: ['id', 'content', 'role', 'conversationId', 'timestamp', 'metadata'],
        relations: ['conversation']
      },
      {
        name: 'Conversation',
        fields: ['id', 'title', 'userId', 'createdAt', 'updatedAt'],
        relations: ['messages', 'user']
      },
      {
        name: 'User',
        fields: ['id', 'name', 'email', 'preferences'],
        relations: ['conversations']
      }
    ],
    apis: [
      { name: 'getConversations', method: 'GET', path: '/api/conversations', description: 'Get user conversations' },
      { name: 'getMessages', method: 'GET', path: '/api/conversations/[id]/messages', description: 'Get conversation messages' },
      { name: 'sendMessage', method: 'POST', path: '/api/conversations/[id]/messages', description: 'Send a message' },
      { name: 'createConversation', method: 'POST', path: '/api/conversations', description: 'Create new conversation' }
    ],
    aiBlocks: [
      {
        name: 'chat',
        type: 'chat',
        description: 'AI chatbot with conversation memory and context'
      }
    ],
    features: ['Real-time Chat', 'Conversation History', 'AI Context Memory', 'User Authentication', 'Message Threading']
  },
  ecommerce: {
    name: 'E-commerce Store',
    description: 'A complete online store with product catalog and AI recommendations',
    models: [
      {
        name: 'Product',
        fields: ['id', 'name', 'description', 'price', 'categoryId', 'images', 'stock', 'sku'],
        relations: ['category', 'reviews', 'orderItems']
      },
      {
        name: 'Category',
        fields: ['id', 'name', 'description', 'parentId'],
        relations: ['products', 'parent', 'children']
      },
      {
        name: 'Order',
        fields: ['id', 'userId', 'status', 'total', 'shippingAddress', 'createdAt'],
        relations: ['user', 'items']
      },
      {
        name: 'User',
        fields: ['id', 'name', 'email', 'address', 'phone'],
        relations: ['orders', 'reviews']
      }
    ],
    apis: [
      { name: 'getProducts', method: 'GET', path: '/api/products', description: 'Get product catalog' },
      { name: 'getProduct', method: 'GET', path: '/api/products/[id]', description: 'Get specific product' },
      { name: 'createOrder', method: 'POST', path: '/api/orders', description: 'Create new order' },
      { name: 'getOrders', method: 'GET', path: '/api/orders', description: 'Get user orders' }
    ],
    aiBlocks: [
      {
        name: 'recommender',
        type: 'classifier',
        description: 'AI-powered product recommendations based on user behavior'
      }
    ],
    features: ['Product Catalog', 'Shopping Cart', 'User Authentication', 'Order Management', 'AI Recommendations', 'Payment Integration']
  },
  taskManager: {
    name: 'Task Management App',
    description: 'A Kanban-style task management application with AI task prioritization',
    models: [
      {
        name: 'Task',
        fields: ['id', 'title', 'description', 'status', 'priority', 'assigneeId', 'dueDate', 'projectId'],
        relations: ['assignee', 'project', 'comments']
      },
      {
        name: 'Project',
        fields: ['id', 'name', 'description', 'ownerId', 'createdAt'],
        relations: ['owner', 'tasks', 'members']
      },
      {
        name: 'User',
        fields: ['id', 'name', 'email', 'avatar'],
        relations: ['assignedTasks', 'ownedProjects', 'projectMemberships']
      }
    ],
    apis: [
      { name: 'getTasks', method: 'GET', path: '/api/tasks', description: 'Get all tasks' },
      { name: 'createTask', method: 'POST', path: '/api/tasks', description: 'Create new task' },
      { name: 'updateTask', method: 'PUT', path: '/api/tasks/[id]', description: 'Update task' },
      { name: 'getProjects', method: 'GET', path: '/api/projects', description: 'Get user projects' }
    ],
    aiBlocks: [
      {
        name: 'prioritizer',
        type: 'classifier',
        description: 'AI-powered task prioritization based on deadlines and importance'
      }
    ],
    features: ['Kanban Board', 'Task Assignment', 'Project Management', 'AI Prioritization', 'Team Collaboration', 'Due Date Tracking']
  }
};

export function promptToBlueprint(prompt: string): ApplicationBlueprint {
  const lowerPrompt = prompt.toLowerCase();
  
  // Check for exact matches first
  if (lowerPrompt.includes('blog') || lowerPrompt.includes('post') || lowerPrompt.includes('article')) {
    return BLUEPRINTS.blog;
  }
  
  if (lowerPrompt.includes('chat') || lowerPrompt.includes('bot') || lowerPrompt.includes('conversation')) {
    return BLUEPRINTS.chatbot;
  }
  
  if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('product')) {
    return BLUEPRINTS.ecommerce;
  }
  
  if (lowerPrompt.includes('task') || lowerPrompt.includes('todo') || lowerPrompt.includes('kanban') || lowerPrompt.includes('project')) {
    return BLUEPRINTS.taskManager;
  }
  
  // Check for AI features
  if (lowerPrompt.includes('ai') || lowerPrompt.includes('artificial intelligence')) {
    if (lowerPrompt.includes('summarize') || lowerPrompt.includes('summary')) {
      return BLUEPRINTS.blog;
    }
    if (lowerPrompt.includes('recommend') || lowerPrompt.includes('suggest')) {
      return BLUEPRINTS.ecommerce;
    }
  }
  
  // Default to blog if no specific match
  return BLUEPRINTS.blog;
}

export function getAllBlueprints(): ApplicationBlueprint[] {
  return Object.values(BLUEPRINTS);
}

export function getBlueprintByName(name: string): ApplicationBlueprint | null {
  return BLUEPRINTS[name] || null;
} 