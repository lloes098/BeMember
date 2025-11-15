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

  // 실제 지갑 연결
  const connectWallet = async () => {
    try {
      const { connectWallet: connect } = await import('./services/web3');
      const provider = await connect();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      toast.success('지갑이 연결되었습니다!');
    } catch (error: any) {
      console.error('지갑 연결 실패:', error);
      toast.error(error.message || '지갑 연결에 실패했습니다.');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  const navigateToCreate = () => {
    if (walletAddress) {
      setScannedData(null); // 스캔 데이터 초기화 - 직접 생성할 때는 빈 폼
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

  // CID 조회 테스트 함수
  const testCID = async () => {
    if (!walletAddress) {
      toast.error('지갑을 먼저 연결해주세요.');
      return;
    }

    try {
      toast.info('CID 조회 테스트 시작...');
      
      const { connectWallet, BUSINESS_CARD_CONTRACT_ADDRESS } = await import('./services/web3');
      const { BUSINESS_CARD_ABI } = await import('./contracts/BusinessCard');
      const { DEMO_CID } = await import('./constants/demo');
      const { ethers } = await import('ethers');

      // 1. 지갑 연결
      const provider = await connectWallet();
      const signer = await provider.getSigner();
      const currentAddress = await signer.getAddress();
      
      if (!BUSINESS_CARD_CONTRACT_ADDRESS) {
        throw new Error('스마트 계약 주소가 설정되지 않았습니다.');
      }

      // 2. 스마트 계약 인스턴스 생성
      const contract = new ethers.Contract(
        BUSINESS_CARD_CONTRACT_ADDRESS,
        BUSINESS_CARD_ABI,
        provider
      );

      // 3. 내 주소로 CID 조회 테스트
      console.log('=== CID 조회 테스트 시작 ===');
      console.log('내 주소:', currentAddress);
      console.log('컨트랙트 주소:', BUSINESS_CARD_CONTRACT_ADDRESS);

      // 방법 1: myCardCID() 사용
      console.log('\n[테스트 1] myCardCID() 사용');
      const contractWithSigner = new ethers.Contract(
        BUSINESS_CARD_CONTRACT_ADDRESS,
        BUSINESS_CARD_ABI,
        signer
      );
      const myCID = await contractWithSigner.myCardCID();
      console.log('myCardCID() 결과:', myCID);

      // 방법 2: getCardCID(address) 사용
      console.log('\n[테스트 2] getCardCID(address) 사용');
      const getCID = await contract.getCardCID(currentAddress);
      console.log('getCardCID() 결과:', getCID);

      // 결과 비교
      console.log('\n=== 결과 비교 ===');
      console.log('myCardCID():', myCID || '(빈 값)');
      console.log('getCardCID():', getCID || '(빈 값)');
      console.log('예상 CID:', DEMO_CID);
      console.log('일치 여부:', myCID === DEMO_CID || getCID === DEMO_CID);

      if (myCID && myCID !== '') {
        toast.success(`✅ myCardCID() 성공! CID: ${myCID.slice(0, 10)}...`);
      } else if (getCID && getCID !== '') {
        toast.success(`✅ getCardCID() 성공! CID: ${getCID.slice(0, 10)}...`);
      } else {
        toast.warning('⚠️ 등록된 CID가 없습니다. 먼저 명함을 생성해주세요.');
      }
    } catch (error: any) {
      console.error('CID 조회 테스트 실패:', error);
      toast.error(error.message || 'CID 조회 테스트에 실패했습니다.');
    }
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
          onTestCID={testCID}
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
