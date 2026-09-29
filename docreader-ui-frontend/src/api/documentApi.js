import axiosClient from './axiosClient';

export const documentApi = {
  getUserDocuments: async () => {
    const response = await axiosClient.get('/documents/user');
    return response.data?.data || [];
  },

  getDocumentById: async (id) => {
    const response = await axiosClient.get(`/documents/${id}`);
    return response.data?.data;
  },

  uploadDocument: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data?.data;
  },

  uploadMultipleDocuments: async (files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axiosClient.post('/documents/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data?.data;
  },

  deleteDocument: async (id) => {
    const response = await axiosClient.delete(`/documents/${id}`);
    return response.data?.data;
  },
};
