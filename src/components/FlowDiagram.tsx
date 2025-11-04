import { Camera, CheckCircle2, Share2, Download, ArrowRight } from 'lucide-react';

export default function FlowDiagram() {
  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[#111111] mb-12 text-center">
          BeMember Flow Diagram
        </h1>

        <div className="space-y-16">
          {/* Flow 1: Create Card */}
          <div>
            <h2 className="text-[#111111] mb-6">
              Flow 1: Create Onchain Card
            </h2>
            <div className="flex items-center gap-6">
              <FlowStep
                number={1}
                title="Connect Wallet"
                description="Connect your wallet using Coinbase Smart Wallet"
                icon={<CheckCircle2 className="w-6 h-6" />}
              />
              <Arrow />
              <FlowStep
                number={2}
                title="Fill Profile"
                description="Enter your name, tagline, and social links"
                icon={<Share2 className="w-6 h-6" />}
              />
              <Arrow />
              <FlowStep
                number={3}
                title="Mint Card"
                description="Create onchain card on Base Sepolia"
                icon={<CheckCircle2 className="w-6 h-6" />}
              />
              <Arrow />
              <FlowStep
                number={4}
                title="Share"
                description="Share your card with QR code"
                icon={<Share2 className="w-6 h-6" />}
              />
            </div>
          </div>

          {/* Flow 2: Scan & Import */}
          <div>
            <h2 className="text-[#111111] mb-6">
              Flow 2: Scan Business Card
            </h2>
            <div className="flex items-center gap-6">
              <FlowStep
                number={1}
                title="Scan Card"
                description="Upload or capture business card photo"
                icon={<Camera className="w-6 h-6" />}
              />
              <Arrow />
              <FlowStep
                number={2}
                title="OCR Extract"
                description="Auto-extract name, email, phone, company"
                icon={<CheckCircle2 className="w-6 h-6" />}
              />
              <Arrow />
              <FlowStep
                number={3}
                title="Download vCard"
                description="Save as .vcf file or IPFS"
                icon={<Download className="w-6 h-6" />}
              />
              <Arrow />
              <FlowStep
                number={4}
                title="Add to BeMember"
                description="Import to create onchain card"
                highlight
                icon={<ArrowRight className="w-6 h-6" />}
              />
            </div>
          </div>

          {/* Combined Flow */}
          <div className="border-t-2 border-[#E6E8EB] pt-16">
            <h2 className="text-[#111111] mb-6">
              Complete Flow: Scan → BeMember Card
            </h2>
            <div className="flex items-center gap-4">
              <MiniStep title="Scan Card" />
              <TinyArrow />
              <MiniStep title="OCR Extract" />
              <TinyArrow />
              <MiniStep title="Download vCard" highlight />
              <TinyArrow />
              <MiniStep title="Add to BeMember" highlight />
              <TinyArrow />
              <MiniStep title="Pre-filled Form" highlight />
              <TinyArrow />
              <MiniStep title="Review & Edit" />
              <TinyArrow />
              <MiniStep title="Mint Onchain" />
              <TinyArrow />
              <MiniStep title="Share QR" />
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-[#3366FF]/5 border border-[#3366FF]/20 rounded-lg p-8">
            <h3 className="text-[#111111] mb-4">
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Feature
                title="'Add to BeMember' Button"
                description="After scanning a business card, this button auto-fills the create form with extracted data"
              />
              <Feature
                title="Pre-filled Form"
                description="Name, role, company from OCR → name, tagline, organization in BeMember"
              />
              <Feature
                title="Wallet Auto-Connect"
                description="If not connected, automatically prompts wallet connection"
              />
              <Feature
                title="Seamless Transition"
                description="Toast notification → Navigate to create page → Show imported data banner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ 
  number, 
  title, 
  description, 
  icon, 
  highlight 
}: { 
  number: number; 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  highlight?: boolean;
}) {
  return (
    <div className={`flex-1 p-6 border rounded-lg ${
      highlight 
        ? 'border-[#3366FF] bg-[#3366FF]/5' 
        : 'border-[#E6E8EB]'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          highlight 
            ? 'bg-[#3366FF] text-white' 
            : 'bg-[#E6E8EB] text-[#1A1A1A]'
        }`}>
          {number}
        </div>
        <div className={`${highlight ? 'text-[#3366FF]' : 'text-[#1A1A1A]/40'}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-[#111111] mb-2">{title}</h3>
      <p className="text-sm text-[#1A1A1A]/60">{description}</p>
    </div>
  );
}

function Arrow() {
  return (
    <ArrowRight className="w-6 h-6 text-[#1A1A1A]/20 flex-shrink-0" />
  );
}

function MiniStep({ title, highlight }: { title: string; highlight?: boolean }) {
  return (
    <div className={`px-4 py-2 rounded-lg border text-sm ${
      highlight
        ? 'border-[#3366FF] bg-[#3366FF]/5 text-[#3366FF]'
        : 'border-[#E6E8EB] text-[#1A1A1A]'
    }`}>
      {title}
    </div>
  );
}

function TinyArrow() {
  return <ArrowRight className="w-4 h-4 text-[#1A1A1A]/20 flex-shrink-0" />;
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="w-5 h-5 text-[#3366FF] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[#111111]">{title}</h4>
          <p className="text-sm text-[#1A1A1A]/60 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
