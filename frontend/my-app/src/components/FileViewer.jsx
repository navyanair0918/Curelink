import React, { useState, useEffect } from 'react';
import './FileViewer.css';

const FileViewer = ({ recordId, fileName, fileType, onClose }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch file as blob with authentication
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/records/${recordId}/file`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load file');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (err) {
        setError('Failed to load file. Please try again.');
        console.error('File fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    // Cleanup: revoke object URL when component unmounts
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [recordId]);

  const isImage = fileType && fileType.startsWith('image/');
  const isPDF = fileType && fileType === 'application/pdf';

  if (loading) {
    return (
      <div className="file-viewer-overlay" onClick={onClose}>
        <div className="file-viewer-container" onClick={(e) => e.stopPropagation()}>
          <div className="file-viewer-loading">Loading file...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-viewer-overlay" onClick={onClose}>
        <div className="file-viewer-container" onClick={(e) => e.stopPropagation()}>
          <div className="file-viewer-error">
            <p>{error}</p>
            <button onClick={onClose} className="btn-close-viewer">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="file-viewer-overlay" onClick={onClose}>
      <div className="file-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="file-viewer-header">
          <h3>{fileName}</h3>
          <button onClick={onClose} className="btn-close-viewer">×</button>
        </div>
        <div className="file-viewer-content">
          {isImage && (
            <img src={fileUrl} alt={fileName} className="file-viewer-image" />
          )}
          {isPDF && (
            <iframe 
              src={fileUrl} 
              title={fileName}
              className="file-viewer-iframe"
            />
          )}
          {!isImage && !isPDF && (
            <div className="file-viewer-unsupported">
              <p>Preview not available for this file type.</p>
              <a 
                href={fileUrl} 
                download={fileName}
                className="btn-download"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
