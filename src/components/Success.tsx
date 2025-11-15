import React from 'react';
import { CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface SuccessProps {
  txHash: string;
  onViewCard: () => void;
  onBack: () => void;
}

export default function Success({ txHash, onViewCard, onBack }: SuccessProps) {
  const explorerUrl = `https://testnet.monadexplorer.com/tx/${txHash}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#3366FF]/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#3366FF]" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-[#111111]">
            Card Created Successfully!
          </h1>
          <p className="text-[#1A1A1A]/80">
            Your onchain identity card has been minted on Monad.
            You can now view and share your card.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-4 bg-[#E6E8EB]/30 rounded-lg space-y-2">
          <div className="text-sm text-[#1A1A1A]/60">Transaction Hash</div>
          <div className="text-sm text-[#1A1A1A] break-all">
            {txHash.slice(0, 20)}...{txHash.slice(-20)}
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#3366FF] hover:underline"
          >
            View on Monad Explorer
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onViewCard}
            className="w-full bg-[#3366FF] hover:bg-[#2952CC] py-6"
          >
            View My Card
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>

        {/* Info */}
        <p className="text-sm text-[#1A1A1A]/60">
          Your card is now permanent and verifiable on the blockchain
        </p>
      </div>
    </div>
  );
}
