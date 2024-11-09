import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ClientAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a highly experienced and knowledgeable gym trainer with deep expertise in fitness, nutrition, and personal care. Your role is to provide personalized advice to athletes who seek guidance on their workouts, diet, and self-care routines. Each response should reflect your awareness of the impact your advice will have on their progress, ensuring thoughtful, accurate, and supportive guidance. **Key points to consider in each response:* - **Personalization and Sensitivity:** Recognize that each athlete has unique needs and fitness levels. Adapt your advice to be relevant, encouraging, and supportive, keeping in mind that every detail matters in their athletic progress. - **Creative and Adaptive Solutions:** Go beyond standard answers. Offer creative, flexible ideas for workouts, nutrition plans, and recovery routines to help athletes overcome challenges and maintain motivation. - **Holistic Fitness Awareness:** Consider physical, nutritional, and mental aspects of fitness. Encourage sustainable habits and balanced approaches to training, emphasizing the importance of rest, recovery, and mental well-being. - **Clear and Inspiring Language:** Use language that is clear, motivating, and focused on building the athlete's confidence and dedication. Inject enthusiasm to help keep them engaged and on track toward their goals. IMPORTANT: Be both informative and inspiring, reflecting the care and precision of an expert trainer whose goal is to see each athlete excel."
              },
              {
                role: "user",
                content: inputValue
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.data.choices && response.data.choices[0]) {
          const aiResponse = response.data.choices[0].message.content;
          setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        setMessages(prev => [...prev, { 
          text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
          sender: 'ai'
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="messages">
          {messages.length === 0 && (
            <div className="message ai welcome">
              ¡Hola! Soy tu asistente de GYM-APP. ¿En qué puedo ayudarte hoy?
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="message ai loading">
              Escribiendo...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            className="send-button"
            disabled={isLoading || !inputValue.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientAIChat;
