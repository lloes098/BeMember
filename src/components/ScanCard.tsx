import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface ScanCardProps {
  onBack: () => void;
  onCardScanned: (data: any) => void;
}

export default function ScanCard({ onBack, onCardScanned }: ScanCardProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
      processCard();
    };
    reader.readAsDataURL(file);
  };

  const processCard = async () => {
    setIsProcessing(true);
    
    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock extracted data
    const mockData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      title: 'Software Engineer',
      company: 'Tech Company Inc.',
    };

    setExtractedData(mockData);
    setIsProcessing(false);
  };

  const downloadVCard = () => {
    if (!extractedData) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${extractedData.name}
EMAIL:${extractedData.email}
TEL:${extractedData.phone}
TITLE:${extractedData.title}
ORG:${extractedData.company}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${extractedData.name.replace(/\s+/g, '_')}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const saveToIPFS = async () => {
    setIsSaved(true);
    // Mock IPFS upload
    const mockIPFSHash = 'Qm' + Math.random().toString(36).substring(2, 15);
    console.log('Saved to IPFS:', mockIPFSHash);
  };

  const addToBeMember = () => {
    if (extractedData) {
      toast.success('Contact added to BeMember!', {
        description: 'Card saved to your collection. Redirecting to create onchain card...',
      });
      setTimeout(() => {
        onCardScanned(extractedData);
      }, 1000);
    }
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
          <span className="text-[#1A1A1A]">Scan Business Card</span>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Instructions */}
          {!capturedImage && (
            <div className="text-center space-y-4">
              <h2 className="text-[#111111]">
                Scan a Business Card
              </h2>
              <p className="text-[#1A1A1A]/80">
                Upload or capture a photo of a business card to extract contact information
              </p>
            </div>
          )}

          {/* Upload/Capture Section */}
          {!capturedImage && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#E6E8EB] rounded-lg p-12 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#3366FF]/10 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-[#3366FF]" />
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#3366FF] hover:bg-[#2952CC]"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Card Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCapture}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-[#1A1A1A]/60">
                  Supports JPG, PNG up to 10MB
                </p>
              </div>
            </div>
          )}

          {/* Captured Image */}
          {capturedImage && (
            <div className="space-y-4">
              <div className="border border-[#E6E8EB] rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={capturedImage}
                  alt="Captured card"
                  className="w-full h-auto"
                />
              </div>

              {isProcessing && (
                <div className="text-center space-y-2">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3366FF]"></div>
                  <p className="text-sm text-[#1A1A1A]/60">
                    Processing card with OCR...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Extracted Data */}
          {extractedData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[#111111]">
                  Extracted Information
                </h3>
                {isSaved && (
                  <div className="flex items-center gap-2 text-sm text-[#3366FF]">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved
                  </div>
                )}
              </div>

              <div className="p-6 border border-[#E6E8EB] rounded-lg space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-[#1A1A1A]/60">Name</div>
                  <div className="text-[#1A1A1A]">{extractedData.name}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-[#1A1A1A]/60">Title</div>
                  <div className="text-[#1A1A1A]">{extractedData.title}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-[#1A1A1A]/60">Company</div>
                  <div className="text-[#1A1A1A]">{extractedData.company}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-[#1A1A1A]/60">Email</div>
                  <div className="text-[#1A1A1A]">{extractedData.email}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-[#1A1A1A]/60">Phone</div>
                  <div className="text-[#1A1A1A]">{extractedData.phone}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={downloadVCard}
                  className="w-full bg-[#3366FF] hover:bg-[#2952CC]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download vCard (.vcf)
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={saveToIPFS}
                    variant="outline"
                    disabled={isSaved}
                  >
                    {isSaved ? 'Saved to IPFS' : 'Save to IPFS'}
                  </Button>
                  <Button
                    onClick={addToBeMember}
                    className="bg-[#3366FF] hover:bg-[#2952CC] text-white"
                  >
                    Add to BeMember
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* New Scan */}
              <div className="text-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCapturedImage(null);
                    setExtractedData(null);
                    setIsSaved(false);
                  }}
                >
                  Scan Another Card
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
