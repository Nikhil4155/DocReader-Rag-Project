import { useState, useEffect, useCallback } from 'react';
import { documentApi } from '../api/documentApi';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchDocuments = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setDocuments([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await documentApi.getUserDocuments();
      setDocuments(data || []);
    } catch (err) {
      if (err.response) {
        const msg = err.response?.data?.message || err.message || 'Failed to load documents';
        setError(msg);
        toast.error(msg);
      } else {
        setError('Backend unavailable');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let active = true;
    async function init() {
      if (!isAuthenticated) {
        if (active) {
          setLoading(false);
          setDocuments([]);
        }
        return;
      }
      try {
        const data = await documentApi.getUserDocuments();
        if (active) {
          setDocuments(data || []);
        }
      } catch (err) {
        if (active) {
          if (err.response) {
            const msg = err.response?.data?.message || err.message || 'Failed to load documents';
            setError(msg);
            toast.error(msg);
          } else {
            setError('Backend unavailable');
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const deleteDocument = async (id) => {
    try {
      await documentApi.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDocumentId === id) {
        setSelectedDocumentId(null);
      }
      toast.success('Document deleted');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete document';
      toast.error(msg);
      throw err;
    }
  };

  const selectedDocument = documents.find((d) => d.id === selectedDocumentId) || null;

  return {
    documents,
    loading,
    error,
    selectedDocumentId,
    selectedDocument,
    setSelectedDocumentId,
    deleteDocument,
    refreshDocuments: fetchDocuments,
  };
}
