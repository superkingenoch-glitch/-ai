
export enum AIModel {
  GEMINI_FLASH = 'gemini-3-flash-preview',
  GEMINI_PRO = 'gemini-3-pro-preview',
  GEMINI_IMAGE = 'gemini-2.5-flash-image',
  GEMINI_IMAGE_PRO = 'gemini-3-pro-image-preview',
  CHATGTP_SIM = 'gpt-4o-simulated',
  CLAUDE_SIM = 'claude-3.5-simulated',
  GROK_SIM = 'grok-2-simulated',
  META_SIM = 'llama-3.1-simulated'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image' | 'system';
  imageUrl?: string;
  modelLabel?: string;
}

export interface AppState {
  currentModel: AIModel;
  messages: Message[];
  isLoading: boolean;
  isSidebarOpen: boolean;
}
