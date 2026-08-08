import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface GGUFFileSelectorProps {
  onFileSelected: (file: File) => Promise<void>;
  loading?: boolean;
  selectedFileName?: string;
  placeholder?: string;
}

const GGUFFileSelector: React.FC<GGUFFileSelectorProps> = ({
  onFileSelected,
  loading = false,
  selectedFileName,
  placeholder = 'Select a GGUF file from your storage',
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.gguf')) {
      setErrorMessage('Please select a valid GGUF file (*.gguf)');
      event.target.value = '';
      return;
    }

    const maxSize = 10 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('File size exceeds 10GB limit');
      event.target.value = '';
      return;
    }

    setErrorMessage(null);

    try {
      await onFileSelected(file);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to load model');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        type="file"
        accept=".gguf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={loading}
      />
      <Button
        variant="contained"
        component="label"
        disabled={loading}
        startIcon={<UploadFileIcon />}
        sx={{ width: '100%', justifyContent: 'flex-start' }}
      >
        {loading ? (
          <>
            <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
            Loading Model...
          </>
        ) : (
          'Choose GGUF File'
        )}
        <input
          type="file"
          accept=".gguf"
          hidden
          onChange={handleFileChange}
          disabled={loading}
        />
      </Button>

      {selectedFileName && !loading && (
        <Typography color="success.main" sx={{ mt: 1, display: 'block' }}>
          ✓ Loaded: {selectedFileName}
        </Typography>
      )}

      {errorMessage && (
        <Typography color="error" sx={{ mt: 1, display: 'block' }}>
          {errorMessage}
        </Typography>
      )}

      <Typography color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: 12 }}>
        {placeholder}
      </Typography>
    </Box>
  );
};

export default GGUFFileSelector;
