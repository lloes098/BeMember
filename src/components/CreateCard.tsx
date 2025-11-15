import React, { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle2, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { ethers } from 'ethers';
import { connectWallet, BUSINESS_CARD_CONTRACT_ADDRESS } from '../services/web3';
import { BUSINESS_CARD_ABI } from '../contracts/BusinessCard';
import { BusinessCard } from '../models/BusinessCard';
// Web2 방식: 로컬 스토리지에 이미지 저장
import { toast } from 'sonner';

interface CreateCardProps {
  walletAddress: string;
  onCardCreated: (txHash: string, address: string, data: any) => void;
  onBack: () => void;
  scannedData?: any;
}

export default function CreateCard({ walletAddress, onCardCreated, onBack, scannedData }: CreateCardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isTransferable, setIsTransferable] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // 스캔된 데이터가 있으면 BusinessCard 인스턴스 생성
  const initialCard = scannedData 
    ? BusinessCard.fromScannedData(scannedData)
    : new BusinessCard();
  
  const [formData, setFormData] = useState(initialCard.toCreateCardForm());

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      
      // 파일 크기 제한 (예: 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('이미지 크기는 10MB 이하여야 합니다.');
        return;
      }

      setSelectedImage(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // 1. 지갑 연결 확인
      const provider = await connectWallet();
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // 2. BusinessCard 인스턴스 생성
      const businessCard = BusinessCard.fromCreateCardForm({
        ...formData,
        isTransferable,
      });

      // 유효성 검사
      if (!businessCard.isValid()) {
        const missing = businessCard.getMissingFields();
        throw new Error(`필수 필드를 입력해주세요: ${missing.join(', ')}`);
      }

      // 3. 이미지 파일이 선택되었는지 확인
      if (!selectedImage) {
        throw new Error('명함 이미지를 업로드해주세요.');
      }

      // 4. 이미지를 Base64로 변환하고 로컬 스토리지에 저장 (Web2 방식)
      toast.info('이미지를 처리하는 중...');
      
      // 이미지를 Base64로 변환
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage);
      });

      // CID 생성: 파일명 + 타임스탬프 + 간단한 해시
      const timestamp = Date.now();
      const fileName = selectedImage.name.replace(/[^a-zA-Z0-9]/g, '_');
      const cid = `bafy_${fileName}_${timestamp}_${Math.random().toString(36).substring(2, 15)}`;
      
      // 로컬 스토리지에 이미지 저장 (key: CID)
      localStorage.setItem(`card_image_${cid}`, imageBase64);
      console.log('이미지 로컬 저장 완료, CID:', cid);
      toast.success('이미지 처리 완료!');

      // 5. 스마트 계약에 CID 기록
      if (!BUSINESS_CARD_CONTRACT_ADDRESS) {
        throw new Error('스마트 계약 주소가 설정되지 않았습니다.');
      }

      console.log('BUSINESS_CARD_CONTRACT_ADDRESS:', BUSINESS_CARD_CONTRACT_ADDRESS);
      console.log('BUSINESS_CARD_ABI:', BUSINESS_CARD_ABI);
      console.log('cid:', cid);

      const contract = new ethers.Contract(
        BUSINESS_CARD_CONTRACT_ADDRESS,
        BUSINESS_CARD_ABI,
        signer
      );

      toast.info('스마트 계약에 트랜잭션을 전송하는 중...');
      const tx = await contract.uploadCard(cid);
      toast.info('트랜잭션 전송 완료. 블록 확인 대기 중...');

      // 6. 트랜잭션 확인 대기
      const receipt = await tx.wait();
      toast.success('명함이 성공적으로 생성되었습니다!');

      // 7. BusinessCard에 블록체인 정보 및 이미지 추가
      businessCard.cid = cid;
      businessCard.address = userAddress;
      businessCard.txHash = receipt.hash;
      (businessCard as any).imageUrl = imageBase64; // 이미지 URL 추가

      // 8. 완료 콜백 호출
      onCardCreated(receipt.hash, userAddress, businessCard);
    } catch (error: any) {
      console.error('명함 생성 실패:', error);
      toast.error(error.message || '명함 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = formData.name && formData.tagline && selectedImage;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E6E8EB] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-[#1A1A1A]/60">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-[#111111]">Create Your Onchain Card</h1>
            <p className="text-[#1A1A1A]/80 mt-2">
              {scannedData 
                ? 'Review and edit the information from the scanned card, then mint your identity on Monad Chain'
                : 'Fill in your information to mint your identity card on Monad Chain'
              }
            </p>
          </div>

          {scannedData && (
            <div className="p-4 bg-[#3366FF]/5 border border-[#3366FF]/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3366FF] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-[#111111]">
                  Information imported from scanned card
                </p>
                <p className="text-sm text-[#1A1A1A]/60">
                  Review the pre-filled fields below and add any additional information
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4 p-6 border border-[#E6E8EB] rounded-lg">
              <h3 className="text-[#111111]">Business Card Image *</h3>
              <div className="space-y-2">
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-[#E6E8EB] rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-[#1A1A1A]/40" />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-[#3366FF] hover:underline">
                        Click to upload
                      </span>
                      {' '}or drag and drop
                    </Label>
                    <p className="text-sm text-[#1A1A1A]/60 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-contain rounded-lg border border-[#E6E8EB]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleImageRemove}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Required Fields */}
            <div className="space-y-4 p-6 border border-[#E6E8EB] rounded-lg">
              <h3 className="text-[#111111]">Required Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Dohae Lee"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline *</Label>
                <Textarea
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="One-line description about yourself"
                  required
                  rows={2}
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4 p-6 border border-[#E6E8EB] rounded-lg">
              <h3 className="text-[#111111]">Optional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role / Position</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="e.g., Student / Builder"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  placeholder="Company or university name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ens">ENS</Label>
                  <Input
                    id="ens"
                    value={formData.ens}
                    onChange={(e) => handleChange('ens', e.target.value)}
                    placeholder="yourname.eth"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farcaster">Farcaster</Label>
                  <Input
                    id="farcaster"
                    value={formData.farcaster}
                    onChange={(e) => handleChange('farcaster', e.target.value)}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">X (Twitter)</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => handleChange('github', e.target.value)}
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Token Options */}
            <div className="space-y-4 p-6 border border-[#E6E8EB] rounded-lg">
              <h3 className="text-[#111111]">Token Options</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Make Transferable</Label>
                  <p className="text-sm text-[#1A1A1A]/60">
                    Allow this card to be transferred to other wallets
                  </p>
                </div>
                <Switch
                  checked={isTransferable}
                  onCheckedChange={setIsTransferable}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isCreating}
              className="w-full bg-[#3366FF] hover:bg-[#2952CC] py-6"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Onchain Card...
                </>
              ) : (
                'Create My Onchain Card'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
