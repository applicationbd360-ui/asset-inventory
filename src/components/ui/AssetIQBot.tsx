import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { aiApi } from '../../api/ai.api';
import './AssetIQBot.css';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  payload?: any;
  type?: string;
}

export default function AssetIQBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'bot',
      text: 'Hello! I am AssetIQ, your smart maintenance assistant. Ask me about "missing parts", "budget alerts", or "work orders".'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { id: Date.now().toString(), sender: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await aiApi.sendChatMessage(userMsg);
      setMessages([...newMessages, { 
        id: (Date.now() + 1).toString(), 
        sender: 'bot', 
        text: response.text,
        payload: response.payload,
        type: response.type
      }]);
    } catch (error) {
      setMessages([...newMessages, { 
        id: (Date.now() + 1).toString(), 
        sender: 'bot', 
        text: 'Sorry, I am having trouble connecting to my neural network right now.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPayload = (msg: Message) => {
    if (!msg.payload) return null;

    if (msg.type === 'missing_parts') {
      return (
        <div className="assetiq-payload-card">
          <table>
            <thead>
              <tr>
                <th>Maintenance</th>
                <th>Part Description</th>
                <th>Week</th>
              </tr>
            </thead>
            <tbody>
              {msg.payload.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item.maintenance}</td>
                  <td><span className="badge badge-warning">{item.partDescription}</span></td>
                  <td>{item.week}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (msg.type === 'budget_alerts') {
      return (
        <div className="assetiq-payload-card">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Month</th>
                <th>Projected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {msg.payload.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item.location}</td>
                  <td>{item.month}</td>
                  <td className="font-semibold">{item.projectedCost}</td>
                  <td className={item.status === 'Critical' ? 'text-red-500' : 'text-amber-500'}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (msg.type === 'work_order_status') {
      return (
        <div className="assetiq-payload-card p-2">
          {msg.payload.map((wo: any, i: number) => (
            <div key={i} className="mb-2 p-2 border border-subtle rounded bg-surface-2 flex justify-between items-center">
              <div>
                <div className="font-semibold text-primary">{wo.id}</div>
                <div className="text-xs text-muted">{wo.title}</div>
              </div>
              <span className={`badge ${wo.status === 'COMPLETED' ? 'badge-success' : 'badge-neutral'}`}>
                {wo.status}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="assetiq-bot-wrapper">
      {isOpen && (
        <div className="assetiq-chat-window">
          <div className="assetiq-chat-header">
            <h3><Sparkles size={18} /> AssetIQ Assistant</h3>
            <button className="assetiq-close-btn" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>
          
          <div className="assetiq-chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`assetiq-msg ${msg.sender}`}>
                <div className="assetiq-bubble">{msg.text}</div>
                {renderPayload(msg)}
              </div>
            ))}
            {isLoading && (
              <div className="assetiq-msg bot">
                <div className="assetiq-bubble animate-pulse">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="assetiq-chat-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="assetiq-send-btn" disabled={!input.trim() || isLoading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="assetiq-bot-toggle" onClick={() => setIsOpen(true)}>
          <Bot size={28} />
        </button>
      )}
    </div>
  );
}
