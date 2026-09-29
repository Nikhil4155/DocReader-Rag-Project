import axiosClient from './axiosClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

export const chatApi = {
  query: async ({ question, documentId, topK, minSimilarity, conversationId }) => {
    const payload = { question };
    if (documentId) payload.documentId = documentId;
    if (topK !== undefined && topK !== null) payload.topK = topK;
    if (minSimilarity !== undefined && minSimilarity !== null) payload.minSimilarity = minSimilarity;
    if (conversationId) payload.conversationId = conversationId;

    const response = await axiosClient.post('/chat/query', payload);
    return response.data?.data;
  },

  searchSimilarity: async ({ query, documentId, topK, similaritySearch }) => {
    const payload = { query };
    if (documentId) payload.documentId = documentId;
    if (topK !== undefined && topK !== null) payload.topK = topK;
    if (similaritySearch !== undefined && similaritySearch !== null) payload.similaritySearch = similaritySearch;

    const response = await axiosClient.post('/chat/search/similarity', payload);
    return response.data?.data;
  },

  streamQuery: async ({ question, documentId, topK, minSimilarity, conversationId, onChunk, signal }) => {
    const token = localStorage.getItem('token');
    const payload = { question };
    if (documentId) payload.documentId = documentId;
    if (topK !== undefined && topK !== null) payload.topK = topK;
    if (minSimilarity !== undefined && minSimilarity !== null) payload.minSimilarity = minSimilarity;
    if (conversationId) payload.conversationId = conversationId;

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      const errorText = await response.text().catch(() => '');
      throw new Error(`Stream request failed with status ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by browser or empty body response.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let chunk = decoder.decode(value, { stream: true });
        // Defensively strip SSE "data:" prefix if present (multiline safe)
        chunk = chunk.replace(/^data:\s*/gm, '');

        fullText += chunk;
        if (onChunk) {
          onChunk(chunk, fullText);
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Stream aborted by user
        return fullText;
      }
      throw err;
    }

    return fullText;
  },
};
