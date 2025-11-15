import React, { useState, useEffect } from 'react';
// Splash Screen Variants - Choose one:
import SplashScreen from './components/SplashScreen'; // Gradient with floating elements
// import SplashScreen from './components/SplashScreenMinimal'; // Clean minimal design
// import SplashScreen from './components/SplashScreenCard'; // 3D card reveal

import Landing from './components/Landing';
import CreateCard from './components/CreateCard';
import CardView from './components/CardView';
import Success from './components/Success';
import ScanCard from './components/ScanCard';
import MyCollection from './components/MyCollection';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<'landing' | 'create' | 'card' | 'success' | 'scan' | 'collection'>('landing');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [cardAddress, setCardAddress] = useState<string>('');
  const [cardData, setCardData] = useState<any>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [collection, setCollection] = useState<any[]>([]);

  // Mock wallet connection
  const connectWallet = async () => {
    // Simulate wallet connection
    const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
    setWalletAddress(mockAddress);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  const navigateToCreate = () => {
    if (walletAddress) {
      setCurrentPage('create');
    }
  };

  const handleCardCreated = (hash: string, address: string, data: any) => {
    setTxHash(hash);
    setCardAddress(address);
    setCardData(data);
    setScannedData(null); // Clear scanned data after creating card
    setCurrentPage('success');
  };

  const viewCard = (address?: string) => {
    if (address) {
      setCardAddress(address);
    }
    setCurrentPage('card');
  };

  const navigateToScan = () => {
    setCurrentPage('scan');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  const handleCardScanned = (data: any) => {
    // Add to collection
    const cardWithDate = {
      ...data,
      addedDate: new Date().toISOString(),
    };
    setCollection([...collection, cardWithDate]);
    
    setScannedData(data);
    // Auto-connect wallet if not connected
    if (!walletAddress) {
      connectWallet();
    }
    // Navigate to create page with pre-filled data
    setTimeout(() => {
      setCurrentPage('create');
    }, 100);
  };

  const navigateToCollection = () => {
    setCurrentPage('collection');
  };

  const handleCreateFromCollection = (cardData: any) => {
    setScannedData(cardData);
    // Auto-connect wallet if not connected
    if (!walletAddress) {
      connectWallet();
    }
    setTimeout(() => {
      setCurrentPage('create');
    }, 100);
  };

  const handleDeleteFromCollection = (index: number) => {
    const newCollection = collection.filter((_, i) => i !== index);
    setCollection(newCollection);
    toast.success('Card removed from collection');
  };

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      {currentPage === 'landing' && (
        <Landing
          walletAddress={walletAddress}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          onCreateCard={navigateToCreate}
          onScanCard={navigateToScan}
          onViewCollection={navigateToCollection}
          collectionCount={collection.length}
        />
      )}
      {currentPage === 'create' && (
        <CreateCard
          walletAddress={walletAddress!}
          onCardCreated={handleCardCreated}
          onBack={navigateToLanding}
          scannedData={scannedData}
        />
      )}
      {currentPage === 'card' && (
        <CardView
          address={cardAddress}
          cardData={cardData}
          onBack={navigateToLanding}
        />
      )}
      {currentPage === 'success' && (
        <Success
          txHash={txHash}
          onViewCard={() => viewCard()}
          onBack={navigateToLanding}
        />
      )}
      {currentPage === 'scan' && (
        <ScanCard
          onBack={navigateToLanding}
          onCardScanned={handleCardScanned}
        />
      )}
      {currentPage === 'collection' && (
        <MyCollection
          walletAddress={walletAddress}
          collection={collection}
          onBack={navigateToLanding}
          onCreateFromCard={handleCreateFromCollection}
          onDeleteCard={handleDeleteFromCollection}
          onScanMore={navigateToScan}
        />
      )}
    </div>
  );
}
