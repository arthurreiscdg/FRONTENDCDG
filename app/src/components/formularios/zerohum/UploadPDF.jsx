import { useRef, useState } from 'react';

function UploadPDF({ formData, updateFormData, onNext, onBack }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [previewPdf, setPreviewPdf] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter(file => file.type === 'application/pdf');
    
    if (newFiles.length === 0) {
      setError('Por favor, selecione apenas arquivos PDF');
      return;
    }
    
    const fileObjects = newFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      id: Date.now() + Math.random().toString(36).substring(2, 9)
    }));
    
    updateFormData('pdfs', [...formData.pdfs, ...fileObjects]);
    setError('');
  };
  
  const removeFile = (id) => {
    const updatedFiles = formData.pdfs.filter(pdf => pdf.id !== id);
    updateFormData('pdfs', updatedFiles);
    
    if (previewPdf?.id === id) {
      setPreviewPdf(null);
    }
  };
  
  const handlePreview = (pdf) => {
    setPreviewPdf(pdf);
  };
  
  const closePreview = () => {
    setPreviewPdf(null);
  };
  
  const handleContinue = () => {
    if (formData.pdfs.length === 0) {
      setError('Por favor, faça upload de pelo menos um PDF');
      return;
    }
    
    setError('');
    onNext();
  };
  
  // Formatação do tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Upload de PDF</h2>
      <p className="text-gray-400">
        Faça upload dos PDFs que deseja imprimir
      </p>
      
      {/* Área de drop */}
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
          ${dragActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-gray-700 hover:border-gray-500'}
        `}
        onClick={() => fileInputRef.current.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <svg 
          className={`w-12 h-12 mb-4 ${dragActive ? 'text-[var(--color-primary)]' : 'text-gray-500'}`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-center mb-2">
          Arraste os PDFs para cá ou <span className="text-[var(--color-primary)] font-medium">clique para selecionar</span>
        </p>
        <p className="text-sm text-gray-500">Apenas arquivos PDF são aceitos</p>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="application/pdf" 
          multiple 
          onChange={handleFileChange}
        />
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      
      {/* Lista de arquivos */}
      {formData.pdfs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">PDFs selecionados ({formData.pdfs.length})</h3>
          <div className="space-y-2">
            {formData.pdfs.map((pdf) => (
              <div 
                key={pdf.id} 
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pdf.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(pdf.size)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={(e) => {e.stopPropagation(); handlePreview(pdf)}}
                    className="text-gray-400 hover:text-[var(--color-primary)] p-2"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {e.stopPropagation(); removeFile(pdf.id)}}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Modal de visualização */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="bg-app-card rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="font-medium text-lg truncate">{previewPdf.name}</h3>
              <button 
                onClick={closePreview}
                className="p-2 rounded-full hover:bg-gray-800"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-2">
              <iframe 
                src={URL.createObjectURL(previewPdf.file)} 
                title={previewPdf.name}
                className="w-full h-full rounded"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Botões de navegação */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-[var(--color-primary)] text-black font-medium rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default UploadPDF;
