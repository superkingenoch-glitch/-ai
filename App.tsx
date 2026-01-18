
import React, { useState, useRef, useEffect } from 'react';
import { AIService } from './services/aiService';
import { AIModel, Message } from './types';
import { 
  ChatBubbleLeftRightIcon, 
  SparklesIcon, 
  PhotoIcon, 
  CommandLineIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to the OmniAI Hub. Access Gemini, GPT, Claude, and more from one interface.', type: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AIModel.GEMINI_PRO);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (selectedModel === AIModel.GEMINI_IMAGE || selectedModel === AIModel.GEMINI_IMAGE_PRO) {
        const imageUrl = await AIService.generateImage(input, selectedModel === AIModel.GEMINI_IMAGE_PRO);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Generated image for: ${input}`, 
          type: 'image', 
          imageUrl,
          modelLabel: selectedModel
        }]);
      } else {
        const response = await AIService.generateText(selectedModel, input);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response, 
          type: 'text',
          modelLabel: selectedModel
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing that request.", type: 'text' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const modelOptions = [
    { id: AIModel.GEMINI_PRO, name: 'Gemini 3 Pro', icon: SparklesIcon, desc: 'Advanced reasoning & coding' },
    { id: AIModel.GEMINI_FLASH, name: 'Gemini 3 Flash', icon: CpuChipIcon, desc: 'Fast, efficient tasks' },
    { id: AIModel.CHATGTP_SIM, name: 'ChatGPT-4o (Sim)', icon: ChatBubbleLeftRightIcon, desc: 'Balanced & professional' },
    { id: AIModel.CLAUDE_SIM, name: 'Claude 3.5 (Sim)', icon: CommandLineIcon, desc: 'Creative & intellectual' },
    { id: AIModel.GROK_SIM, name: 'Grok-2 (Sim)', icon: SparklesIcon, desc: 'Witty & direct' },
    { id: AIModel.META_SIM, name: 'Llama 3.1 (Sim)', icon: CommandLineIcon, desc: 'Open-weights feel' },
    { id: AIModel.GEMINI_IMAGE, name: 'Image Gen', icon: PhotoIcon, desc: 'Fast visuals' },
    { id: AIModel.GEMINI_IMAGE_PRO, name: 'Image Gen Pro', icon: PhotoIcon, desc: 'High quality 1K/2K' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`glass z-50 fixed lg:static inset-y-0 left-0 w-72 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full lg:w-0'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h1 className="text-xl font-bold gradient-text tracking-tight uppercase">OmniAI Infinity</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-800 rounded">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Engines</p>
            {modelOptions.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all ${selectedModel === model.id ? 'bg-blue-600/20 border border-blue-500 text-white' : 'hover:bg-white/5 border border-transparent text-gray-400'}`}
              >
                <model.icon className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium">{model.name}</div>
                  <div className="text-[10px] opacity-60">{model.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/10 text-xs text-gray-500 px-2">
            Powered by Google Gemini 3
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-[#030712]">
        {/* Header */}
        <header className="glass h-16 flex items-center px-6 sticky top-0 z-40">
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="mr-4 p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Bars3Icon className="w-6 h-6" />
            </button>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{modelOptions.find(m => m.id === selectedModel)?.name}</span>
            <span className="text-[10px] text-green-500 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
              Operational · Infinite Access
            </span>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'glass text-gray-100 rounded-bl-none'
              }`}>
                {msg.modelLabel && (
                  <div className="text-[10px] uppercase font-bold opacity-50 mb-1 tracking-wider">
                    {msg.modelLabel.replace('-simulated', '').toUpperCase()}
                  </div>
                )}
                {msg.type === 'text' && <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>}
                {msg.type === 'system' && <div className="italic text-blue-300">{msg.content}</div>}
                {msg.type === 'image' && msg.imageUrl && (
                  <div className="space-y-3">
                    <img src={msg.imageUrl} alt="AI Generated" className="rounded-lg w-full h-auto shadow-2xl border border-white/10" />
                    <p className="text-xs text-gray-400">{msg.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl p-4 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-400 font-medium">Processing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-[#030712] to-transparent">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-2 flex items-center border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask ${modelOptions.find(m => m.id === selectedModel)?.name}...`}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-2 placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-500 mt-3">
            Free high-speed access to next-gen AI models. All features unlocked.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
