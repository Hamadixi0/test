import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 600px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: 16px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser ? 
    `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})` : 
    props.theme.colors.surfaceLight
  };
  color: ${props => props.isUser ? props.theme.colors.background : props.theme.colors.text};
  border: 1px solid ${props => props.isUser ? 'transparent' : props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageContent = styled.div`
  line-height: 1.6;
  
  p {
    margin: 0 0 ${props => props.theme.spacing.sm} 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul, ol {
    margin: ${props => props.theme.spacing.sm} 0;
    padding-left: ${props => props.theme.spacing.lg};
  }

  li {
    margin-bottom: ${props => props.theme.spacing.xs};
  }

  code {
    background: ${props => props.theme.colors.surface};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.9em;
  }

  pre {
    background: ${props => props.theme.colors.surface};
    padding: ${props => props.theme.spacing.md};
    border-radius: 8px;
    overflow-x: auto;
    margin: ${props => props.theme.spacing.sm} 0;
    
    code {
      background: none;
      padding: 0;
    }
  }

  strong {
    color: ${props => props.theme.colors.primary};
  }

  em {
    color: ${props => props.theme.colors.accent};
  }
`;

const MessageTimestamp = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.isUser ? 
    `${props.theme.colors.background}80` : 
    props.theme.colors.textMuted
  };
  margin-top: ${props => props.theme.spacing.xs};
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const InputContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
`;

const InputForm = styled.form`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  resize: none;
  transition: all ${props => props.theme.animations.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const SendButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.disabled ? 
    props.theme.colors.border : 
    `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})`
  };
  color: ${props => props.disabled ? props.theme.colors.textMuted : props.theme.colors.background};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${props => props.theme.animations.fast};
  min-width: 80px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: 16px;
  align-self: flex-start;
  max-width: 120px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  
  .dot {
    width: 8px;
    height: 8px;
    background: ${props => props.theme.colors.textMuted};
    border-radius: 50%;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: ${props => props.theme.colors.textMuted};
  gap: ${props => props.theme.spacing.md};
`;

const EmptyIcon = styled.div`
  font-size: ${props => props.theme.fontSizes['4xl']};
  opacity: 0.5;
`;

const ChatInterface = forwardRef(({ messages, onSendMessage, isLoading }, ref) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current?.focus(),
    clearInput: () => setInputValue('')
  }));

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestionPrompts = [
    "I want to create a 2D platformer game",
    "Help me build an RPG with a fantasy setting",
    "I'd like to make a puzzle game for mobile",
    "Create a 3D action adventure game"
  ];

  const handleSuggestionClick = (prompt) => {
    if (!isLoading) {
      onSendMessage(prompt);
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🤖</EmptyIcon>
            <div>
              <h3>Ready to build your game!</h3>
              <p>Start by telling me what kind of game you want to create.</p>
            </div>
            <div>
              <p><strong>Try one of these:</strong></p>
              {suggestionPrompts.map((prompt, index) => (
                <MessageBubble 
                  key={index}
                  style={{ 
                    cursor: 'pointer', 
                    marginTop: '8px',
                    background: 'transparent',
                    border: `1px solid ${props => props.theme.colors.primary}40`,
                    color: props => props.theme.colors.primary,
                    alignSelf: 'center',
                    maxWidth: '100%'
                  }}
                  onClick={() => handleSuggestionClick(prompt)}
                >
                  {prompt}
                </MessageBubble>
              ))}
            </div>
          </EmptyState>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} isUser={message.type === 'user'}>
                <MessageContent>
                  {message.type === 'ai' ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </MessageContent>
                <MessageTimestamp isUser={message.type === 'user'}>
                  {formatTimestamp(message.timestamp)}
                </MessageTimestamp>
              </MessageBubble>
            ))}
            
            {isLoading && (
              <TypingIndicator>
                <TypingDots>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </TypingDots>
                <span>AI is thinking...</span>
              </TypingIndicator>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputForm onSubmit={handleSubmit}>
          <MessageInput
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your game idea or ask for suggestions..."
            disabled={isLoading}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '44px'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <SendButton type="submit" disabled={!inputValue.trim() || isLoading}>
            {isLoading ? '...' : 'Send'}
          </SendButton>
        </InputForm>
      </InputContainer>
    </ChatContainer>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;