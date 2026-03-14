'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, X, MessageCircle } from 'lucide-react';
import styles from './QuokkaChat.module.css';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function QuokkaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: '뀱! 안녕! 🐾 나는 엔카페의 나이스 쿼카야! 궁금한 게 있으면 뭐든지 물어봐! ㅋㅋㅋ' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          stream: true
        }),
      });

      if (!response.ok) throw new Error('서버 연결 실패 ㅠㅠ');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      // AI 메시지 자리를 미리 만듦
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              aiContent += parsed.content;
              
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content = aiContent;
                return updated;
              });
            } catch (e) {
              // 중간에 끊긴 JSON 무시
            }
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: '미안해! 지금 쿼카가 와플 먹느라 바빠서 연결이 끊겼어 ㅠㅠ 조금 있다 다시 말해줘! 🐾' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* 챗봇 버튼 */}
      <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X color="#5a3d29" size={32} /> : (
          <Image src="/theme/quokka_mascot.png" alt="Quokka Bot" width={60} height={60} />
        )}
      </button>

      {/* 채팅창 */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerIcon}>
              <Image src="/theme/quokka_mascot.png" alt="Icon" width={26} height={26} />
            </div>
            <h3>나이스 쿼카 챗봇</h3>
          </div>

          <div className={styles.messageArea} ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'model' ? styles.quokkaMessage : styles.userMessage}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && messages[messages.length-1].content === '' && (
              <div className={`${styles.message} ${styles.quokkaMessage}`}>생각 중... 🐾</div>
            )}
          </div>

          <div className={styles.inputArea}>
            <input 
              type="text" 
              placeholder="쿼카에게 말해보기..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className={styles.sendButton} onClick={handleSend} disabled={isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
