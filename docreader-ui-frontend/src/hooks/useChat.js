import { useState, useEffect, useRef, useCallback } from 'react';
import { chatApi } from '../api/chatApi';
import { useAuth } from './useAuth';
import { getStoredSettings } from '../utils/settings';
import toast from 'react-hot-toast';

export function useChat(selectedDocumentId = null) {
  const { user } = useAuth();
  const [settings, setSettings] = useState(getStoredSettings);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const abortControllerRef = useRef(null);

  const scopeKey = selectedDocumentId ? `doc_${selectedDocumentId}` : 'all';
  const storageKey = user ? `docreader_chat_${user.id}_${scopeKey}` : null;

  // Load chat history from localStorage on scope change or user change
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      if (!storageKey) {
        setMessages([]);
        setConversationId(null);
        return;
      }
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.messages || []);
          setConversationId(parsed.conversationId || null);
        } else {
          setMessages([]);
          setConversationId(null);
        }
      } catch {
        setMessages([]);
        setConversationId(null);
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [storageKey]);

  // Persist messages when updated
  const saveMessages = useCallback(
    (newMessages, convId) => {
      if (!storageKey) return;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            messages: newMessages,
            conversationId: convId,
            updatedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore storage errors
      }
    },
    [storageKey]
  );

  const clearChat = () => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setConversationId(null);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    toast.success('Chat history cleared');
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      toast('Generation stopped');
    }
  };

  const sendMessage = async (question) => {
    if (!question.trim() || isStreaming) return;

    const userMsg = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    const assistantMsgPlaceholder = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: '',
      citations: [],
      responseTimeMs: null,
      noMatchesFound: false,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg, assistantMsgPlaceholder];
    setMessages(updatedMessages);
    setIsStreaming(true);

    const startTime = Date.now();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (settings.stream) {
      // Stream responses mode: parallel /chat/stream and /chat/search/similarity
      try {
        const similarityPromise = chatApi
          .searchSimilarity({
            query: question,
            documentId: selectedDocumentId || undefined,
            topK: settings.topK,
            similaritySearch: settings.minSimilarity,
          })
          .catch((err) => {
            console.error('Similarity search parallel call failed', err);
            return null;
          });

        let currentText = '';
        await chatApi.streamQuery({
          question,
          documentId: selectedDocumentId || undefined,
          topK: settings.topK,
          minSimilarity: settings.minSimilarity,
          conversationId,
          signal: abortController.signal,
          onChunk: (_chunk, fullText) => {
            currentText = fullText;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgPlaceholder.id ? { ...msg, content: fullText } : msg
              )
            );
          },
        });

        const timeTaken = Date.now() - startTime;
        const similarityRes = await similarityPromise;

        const matches = similarityRes?.matches || [];
        const noMatches = matches.length === 0;

        setMessages((prev) => {
          const finalMsgs = prev.map((msg) => {
            if (msg.id === assistantMsgPlaceholder.id) {
              return {
                ...msg,
                content: msg.content || currentText,
                citations: matches,
                noMatchesFound: noMatches,
                responseTimeMs: timeTaken,
              };
            }
            return msg;
          });
          saveMessages(finalMsgs, conversationId);
          return finalMsgs;
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          const errorMsg = err.message || 'Error generating streaming response';
          toast.error(errorMsg);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgPlaceholder.id
                ? { ...msg, content: `⚠️ *Error:* ${errorMsg}` }
                : msg
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    } else {
      // Non-streaming mode: call /chat/query directly
      try {
        const data = await chatApi.query({
          question,
          documentId: selectedDocumentId || undefined,
          topK: settings.topK,
          minSimilarity: settings.minSimilarity,
          conversationId,
        });

        const timeTaken = data.responseTimeMs || Date.now() - startTime;
        const citations = data.citations || [];
        const newConvId = data.conversationId || conversationId;
        if (newConvId) setConversationId(newConvId);

        setMessages((prev) => {
          const finalMsgs = prev.map((msg) => {
            if (msg.id === assistantMsgPlaceholder.id) {
              return {
                ...msg,
                content: data.answer || 'No response generated.',
                citations,
                noMatchesFound: citations.length === 0,
                responseTimeMs: timeTaken,
              };
            }
            return msg;
          });
          saveMessages(finalMsgs, newConvId);
          return finalMsgs;
        });
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Error processing request';
        toast.error(errorMsg);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgPlaceholder.id
              ? { ...msg, content: `⚠️ *Error:* ${errorMsg}` }
              : msg
          )
        );
      } finally {
        setIsStreaming(false);
      }
    }
  };

  return {
    messages,
    isStreaming,
    settings,
    setSettings,
    sendMessage,
    stopGeneration,
    clearChat,
  };
}
