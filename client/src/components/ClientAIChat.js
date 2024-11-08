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
                content: "You are a helpful fitness assistant that provides advice about workouts, nutrition, and general fitness topics."
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
