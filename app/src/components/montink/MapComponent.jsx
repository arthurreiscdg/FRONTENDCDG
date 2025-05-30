import React, { useState, useEffect } from 'react';

/**
 * Componente para exibir um mapa do Google Maps com o endereço de entrega usando iframe embed
 * @param {Object} props - Propriedades do componente
 * @param {string} props.endereco - Endereço
 * @param {string} props.numero - Número do endereço
 * @param {string} props.bairro - Bairro
 * @param {string} props.cidade - Cidade
 * @param {string} props.uf - Estado
 * @param {string} props.cep - CEP
 */
function MapComponent({ endereco, numero, cidade, uf, cep, bairro }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constrói o endereço completo para a query do mapa
  const enderecoCompleto = `${endereco || ''}${numero ? `, ${numero}` : ''}, ${bairro || ''}, ${cidade || ''} - ${uf || ''}, ${cep || ''}, Brasil`;
  
  // Codifica o endereço para uso na URL
  const query = encodeURIComponent(enderecoCompleto);
  
  // URL do mapa embed do Google Maps
  const mapUrl = `https://www.google.com/maps?q=${query}&output=embed`;

  useEffect(() => {
    // Simula um pequeno delay de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Erro ao carregar o mapa');
  };

  return (
    <div className="relative h-64 bg-app-dark rounded-lg border border-app-border overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-app-dark">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-app-primary mb-2"></div>
            <span className="text-gray-300 text-sm">Carregando mapa...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-app-dark">
          <div className="text-red-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      )}

      {/* Google Maps Iframe */}
      {!error && (
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa do endereço de entrega"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="w-full h-full"
        />
      )}

      {/* Address Info Overlay */}
      {!isLoading && !error && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded max-w-xs">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span className="truncate">{cidade} - {uf}</span>
          </div>
        </div>
      )}

      {/* Open in Google Maps Button */}
      {!isLoading && !error && (
        <div className="absolute top-2 right-2">
          <a
            href={`https://www.google.com/maps?q=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-800 text-xs px-2 py-1 rounded shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            title="Abrir no Google Maps"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Abrir</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default MapComponent;
