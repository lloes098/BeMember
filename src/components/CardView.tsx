import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, QrCode, Share2, Download, CheckCircle2, Globe, Github, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import QRCode from 'qrcode';
import { ethers } from 'ethers';
import { connectWallet, BUSINESS_CARD_CONTRACT_ADDRESS } from '../services/web3';
import { BUSINESS_CARD_ABI } from '../contracts/BusinessCard';
import { generateRandomCardData, DEMO_CID } from '../constants/demo';
import { BusinessCard } from '../models/BusinessCard';
import { toast } from 'sonner';

interface CardViewProps {
  address: string;
  cardData?: any; // 선택적 - 없으면 스마트 계약에서 조회
  onBack: () => void;
}

export default function CardView({ address, cardData: initialCardData, onBack }: CardViewProps) {
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [cardData, setCardData] = useState<any>(initialCardData);
  const [isLoading, setIsLoading] = useState(!initialCardData);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cardUrl = `https://bemember.app/card/${address}`;

  // 스마트 계약에서 CID 조회하고 랜덤 명함 데이터 표시 (데모 버전)
  useEffect(() => {
    if (initialCardData) {
      // 이미 데이터가 있으면 스킵
      return;
    }

    const fetchCardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. 지갑 연결 (읽기 전용이므로 provider만 필요)
        const provider = await connectWallet();
        
        if (!BUSINESS_CARD_CONTRACT_ADDRESS) {
          throw new Error('스마트 계약 주소가 설정되지 않았습니다.');
        }

        // 2. 스마트 계약에서 CID 조회
        const contract = new ethers.Contract(
          BUSINESS_CARD_CONTRACT_ADDRESS,
          BUSINESS_CARD_ABI,
          provider
        );

        const cid = await contract.getCardCID(address);
        
        if (!cid || cid === '') {
          throw new Error('이 주소에는 등록된 명함이 없습니다.');
        }

        // 3. 데모 버전: CID 확인 후 랜덤 명함 데이터 생성
        console.log('조회된 CID:', cid);
        console.log('예상 CID:', DEMO_CID);
        
        if (cid === DEMO_CID) {
          toast.success('CID 확인 완료! 데모 모드: 랜덤 명함 정보를 표시합니다.');
        } else {
          toast.info(`CID 확인 완료: ${cid.slice(0, 10)}... (데모 모드: 랜덤 명함 정보 표시)`);
        }

        // 4. 랜덤 명함 데이터 생성
        const randomData = generateRandomCardData();
        const businessCard = BusinessCard.fromIPFSData(randomData);
        businessCard.cid = cid;
        businessCard.address = address;
        
        setCardData(businessCard);
      } catch (err: any) {
        console.error('명함 데이터 조회 실패:', err);
        setError(err.message || '명함 데이터를 불러올 수 없습니다.');
        toast.error(err.message || '명함 데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardData();
  }, [address, initialCardData]);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(cardUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#3366FF',
          light: '#FFFFFF',
        },
      });
      setQrUrl(url);
      setShowQR(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `bemember-card-${address.slice(0, 8)}.png`;
    link.href = qrUrl;
    link.click();
  };

  const shareToX = () => {
    const text = `Check out my onchain identity card on BeMember!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(cardUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFarcaster = () => {
    const text = `Check out my onchain identity card on BeMember! ${cardUrl}`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E6E8EB] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={generateQR}>
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm" onClick={shareToX}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#3366FF]" />
            <p className="text-[#1A1A1A]/60">명함 데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3366FF] to-[#2952CC] p-8 text-white shadow-xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white mb-1">
                    {cardData?.name || 'Anonymous'}
                  </h2>
                  <p className="text-white/80">
                    {cardData?.tagline || 'Onchain identity member'}
                  </p>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  VERIFIED
                </Badge>
              </div>

              {/* Role & Organization */}
              {(cardData?.role || cardData?.organization) && (
                <div className="space-y-1">
                  {cardData?.role && (
                    <p className="text-white/90">{cardData.role}</p>
                  )}
                  {cardData?.organization && (
                    <p className="text-white/80 text-sm">{cardData.organization}</p>
                  )}
                </div>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {cardData?.ens && (
                  <div className="px-3 py-1.5 bg-white/10 rounded-lg text-sm">
                    {cardData.ens}
                  </div>
                )}
                {cardData?.farcaster && (
                  <div className="px-3 py-1.5 bg-white/10 rounded-lg text-sm">
                    {cardData.farcaster}
                  </div>
                )}
                {cardData?.twitter && (
                  <div className="px-3 py-1.5 bg-white/10 rounded-lg text-sm">
                    {cardData.twitter}
                  </div>
                )}
              </div>

              {/* Additional Links */}
              {(cardData?.website || cardData?.github) && (
                <div className="flex gap-3 pt-2 border-t border-white/20">
                  {cardData?.website && (
                    <a
                      href={cardData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/90 hover:text-white"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {cardData?.github && (
                    <a
                      href={`https://github.com/${cardData.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/90 hover:text-white"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Monad Chain</span>
                  <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          {/* QR Code Section */}
          {showQR && (
            <div className="space-y-4 p-6 border border-[#E6E8EB] rounded-lg text-center">
              <h3 className="text-[#111111]">Share Your Card</h3>
              <div className="flex justify-center">
                <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={downloadQR}>
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
                <Button variant="outline" onClick={shareToFarcaster}>
                  Share to Farcaster
                </Button>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4 p-6 border border-[#E6E8EB] rounded-lg">
            <h3 className="text-[#111111]">Token Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Network</span>
                <span className="text-[#1A1A1A]">Monad Chain</span>
              </div>
              {cardData?.cid && (
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">IPFS CID</span>
                  <span className="text-[#1A1A1A] font-mono text-xs">{cardData.cid.slice(0, 20)}...</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Token Type</span>
                <span className="text-[#1A1A1A]">
                  {cardData?.isTransferable ? 'ERC-721' : 'SBT (Non-Transferable)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Contract</span>
                <span className="text-[#1A1A1A]">{address.slice(0, 10)}...{address.slice(-8)}</span>
              </div>
              {cardData?.createdAt && (
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Created</span>
                  <span className="text-[#1A1A1A]">
                    {new Date(cardData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          </div>
        )}
      </main>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
