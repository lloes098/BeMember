import React, { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

interface CreateCardProps {
  walletAddress: string;
  onCardCreated: (txHash: string, address: string, data: any) => void;
  onBack: () => void;
  scannedData?: any;
}

export default function CreateCard({ walletAddress, onCardCreated, onBack, scannedData }: CreateCardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isTransferable, setIsTransferable] = useState(false);
  const [formData, setFormData] = useState({
    name: scannedData?.name || '',
    tagline: scannedData?.title ? `${scannedData.title} at ${scannedData.company || ''}` : '',
    role: scannedData?.title || '',
    organization: scannedData?.company || '',
    ens: '',
    farcaster: '',
    twitter: '',
    website: scannedData?.website || '',
    github: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
    
    onCardCreated(mockTxHash, walletAddress, {
      ...formData,
      isTransferable,
      createdAt: new Date().toISOString(),
    });

    setIsCreating(false);
  };

  const isFormValid = formData.name && formData.tagline;

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
                ? 'Review and edit the information from the scanned card, then mint your identity on Base Sepolia'
                : 'Fill in your information to mint your identity card on Base Sepolia'
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
