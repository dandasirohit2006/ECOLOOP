import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Conversation, Message } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Send,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Tag,
  DollarSign,
} from 'lucide-react';

export const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get('recipient');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isNegotiation, setIsNegotiation] = useState(false);
  const [proposedPrice, setProposedPrice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async (autoSelectId?: string) => {
    try {
      const res = await api.messages.getConversations();
      setConversations(res.conversations);

      if (autoSelectId) {
        selectConversation(autoSelectId);
      } else if (res.conversations.length > 0 && !activeConv) {
        selectConversation(res.conversations[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (convId: string) => {
    try {
      const res = await api.messages.getConversation(convId);
      setActiveConv(res.conversation);
      setMessages(res.messages);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to load messages for conversation:', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const payload: any = {
        conversationId: activeConv?.id,
        receiverId: activeConv?.otherUser?.id || recipientId,
        content: newMessage.trim(),
        isNegotiation,
        proposedPrice: isNegotiation && proposedPrice ? parseFloat(proposedPrice) : undefined,
      };

      const res = await api.messages.send(payload);
      setMessages((prev) => [...prev, res.message]);
      setNewMessage('');
      setIsNegotiation(false);
      setProposedPrice('');
      scrollToBottom();
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Real-time Logistics & Price Negotiation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Buyer-Seller Communications
          </h1>
        </div>

        {/* Messaging Two-Panel Card */}
        <div className="bg-white rounded-3xl shadow-card border border-emerald-100/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px] max-h-[750px]">
          {/* Left Panel: Conversations List (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="font-extrabold text-sm text-slate-800">Direct Dialogues</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {conversations.length} Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No active conversations yet.</p>
                  <p className="text-[11px]">Inquire from any marketplace listing to begin chat.</p>
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                      activeConv?.id === c.id ? 'bg-emerald-50/80 border-r-4 border-emerald-700' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-forest-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {c.otherUser?.businessName?.charAt(0) || 'B'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {c.otherUser?.businessName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(c.lastMessageAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate mt-1 leading-snug">
                        {c.lastMessage}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-1.5 py-0.2 rounded">
                          {c.otherUser?.city}
                        </span>
                        {c.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ml-auto">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Chat Window (8 cols) */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {activeConv ? (
              <>
                {/* Chat Top Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest-900 text-white font-bold text-sm flex items-center justify-center">
                      {activeConv.otherUser?.businessName?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                        <span>{activeConv.otherUser?.businessName}</span>
                        {activeConv.otherUser?.isVerified && (
                          <span title="Verified">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {activeConv.otherUser?.city} • {activeConv.otherUser?.category}
                      </span>
                    </div>
                  </div>

                  {activeConv.request?.material && (
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Discussing Material
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {activeConv.request.material.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
                  {messages.map((m) => {
                    const isMe = m.senderId === user?.id;

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                          <span>{isMe ? 'You' : m.sender?.businessName || 'Counterparty'}</span>
                          <span>•</span>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-forest-900 text-white rounded-tr-xs shadow-sm'
                              : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                          }`}
                        >
                          {/* If Negotiation message */}
                          {m.isNegotiation && (
                            <div className={`mb-2 p-2 rounded-xl flex items-center justify-between text-xs font-bold ${
                              isMe ? 'bg-white/10 text-emerald-300' : 'bg-purple-50 text-purple-800 border border-purple-100'
                            }`}>
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                Rate Proposal:
                              </span>
                              <span>₹{m.proposedPrice}</span>
                            </div>
                          )}

                          <p className="whitespace-pre-line">{m.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input & Negotiation Bar */}
                <div className="p-4 border-t border-slate-100 bg-white space-y-3">
                  {/* Negotiation toggle chip */}
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setIsNegotiation(!isNegotiation)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all ${
                        isNegotiation
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isNegotiation ? 'Rate Proposal Active' : '+ Propose Special Rate'}</span>
                    </button>

                    {isNegotiation && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">Offer (₹):</span>
                        <input
                          type="number"
                          step="any"
                          placeholder="e.g. 14.20"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                          className="w-24 px-2 py-1 text-xs font-bold border border-purple-300 rounded-lg focus:outline-none text-purple-900"
                        />
                      </div>
                    )}
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isNegotiation ? "Add terms for your rate proposal..." : "Type your message or shipping question..."}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="font-bold text-base text-slate-700">Select a dialogue from the list</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Coordinate pickup timings, discuss bulk discounting, or negotiate secondary feedstock pricing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
