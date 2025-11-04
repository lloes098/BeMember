import { Wallet, QrCode, Share2, CheckCircle2, Library } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface LandingProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onCreateCard: () => void;
  onScanCard: () => void;
  onViewCollection: () => void;
  collectionCount: number;
}

export default function Landing({
  walletAddress,
  onConnect,
  onDisconnect,
  onCreateCard,
  onScanCard,
  onViewCollection,
  collectionCount,
}: LandingProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#E6E8EB] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3366FF] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#111111]">BeMember</span>
          </div>
          <div className="flex items-center gap-3">
            {collectionCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewCollection}
                className="relative"
              >
                <Library className="w-4 h-4 mr-2" />
                My BeMember
                {collectionCount > 0 && (
                  <Badge className="ml-2 bg-[#3366FF] hover:bg-[#3366FF] text-white px-2 py-0.5 text-xs">
                    {collectionCount}
                  </Badge>
                )}
              </Button>
            )}
            {walletAddress ? (
              <>
                <span className="text-sm text-[#1A1A1A]">
                  {formatAddress(walletAddress)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDisconnect}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={onConnect} className="bg-[#3366FF] hover:bg-[#2952CC]">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-[#111111]">
            Your Onchain Identity Card
          </h1>
          <p className="text-[#1A1A1A] max-w-2xl mx-auto">
            Create a verifiable, permanent identity card on Base blockchain.
            Share your professional profile with a simple QR code.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              onClick={onCreateCard}
              disabled={!walletAddress}
              className="bg-[#3366FF] hover:bg-[#2952CC] px-8 py-6"
            >
              Create My Onchain Card
            </Button>
            <Button
              onClick={onScanCard}
              variant="outline"
              className="px-8 py-6"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Scan Card
            </Button>
          </div>

          {!walletAddress && (
            <p className="text-sm text-[#1A1A1A]/60">
              Connect your wallet to get started
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#3366FF]/10 flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6 text-[#3366FF]" />
            </div>
            <h3 className="text-[#111111]">Step 1</h3>
            <p className="text-sm text-[#1A1A1A]/80">
              Connect your wallet
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#3366FF]/10 flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6 text-[#3366FF]" />
            </div>
            <h3 className="text-[#111111]">Step 2</h3>
            <p className="text-sm text-[#1A1A1A]/80">
              Create your profile card
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#3366FF]/10 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6 text-[#3366FF]" />
            </div>
            <h3 className="text-[#111111]">Step 3</h3>
            <p className="text-sm text-[#1A1A1A]/80">
              Share with QR code
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E8EB] px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-[#1A1A1A]/60">
          Powered by Base Sepolia
        </div>
      </footer>
    </div>
  );
}
