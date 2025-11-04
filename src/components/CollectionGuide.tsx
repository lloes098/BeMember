import { Library, Camera, Plus, Download, Share2, CheckCircle2 } from 'lucide-react';

export default function CollectionGuide() {
  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-[#111111]">My BeMember Collection</h1>
          <p className="text-[#1A1A1A]/80 max-w-2xl mx-auto">
            Your personal library of scanned business cards and contacts
          </p>
        </div>

        {/* What is My BeMember */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Library className="w-8 h-8 text-[#3366FF]" />
            <h2 className="text-[#111111]">What is My BeMember?</h2>
          </div>
          <div className="p-6 bg-[#3366FF]/5 border border-[#3366FF]/20 rounded-lg">
            <p className="text-[#1A1A1A]/80">
              My BeMember is your central hub for managing all the business cards you've scanned. 
              Every card you scan and add is automatically saved here, allowing you to:
            </p>
            <ul className="mt-4 space-y-2 text-[#1A1A1A]/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3366FF] flex-shrink-0 mt-0.5" />
                <span>Browse and search through your collected contacts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3366FF] flex-shrink-0 mt-0.5" />
                <span>Create onchain identity cards from any saved contact</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3366FF] flex-shrink-0 mt-0.5" />
                <span>Download contacts as vCard (.vcf) files</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3366FF] flex-shrink-0 mt-0.5" />
                <span>Organize and manage your professional network</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <h2 className="text-[#111111]">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Step
              number={1}
              icon={<Camera className="w-6 h-6" />}
              title="Scan a Card"
              description="Upload or capture a business card photo using the 'Scan Card' button"
            />
            <Step
              number={2}
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Auto-Save"
              description="After OCR extraction, clicking 'Add to BeMember' saves the card to your collection"
            />
            <Step
              number={3}
              icon={<Library className="w-6 h-6" />}
              title="View Collection"
              description="Access 'My BeMember' from the header to see all your saved cards"
            />
            <Step
              number={4}
              icon={<Plus className="w-6 h-6" />}
              title="Create Onchain"
              description="Convert any saved card into a permanent onchain identity card"
            />
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-[#111111]">Collection Features</h2>
          <div className="space-y-4">
            <FeatureCard
              icon={<Search className="w-5 h-5 text-[#3366FF]" />}
              title="Smart Search"
              description="Quickly find cards by searching name, email, company, or job title"
            />
            <FeatureCard
              icon={<ViewToggle className="w-5 h-5 text-[#3366FF]" />}
              title="View Modes"
              description="Switch between grid and list view to browse your collection"
            />
            <FeatureCard
              icon={<Download className="w-5 h-5 text-[#3366FF]" />}
              title="Export Options"
              description="Download any card as a vCard file to add to your phone contacts"
            />
            <FeatureCard
              icon={<Share2 className="w-5 h-5 text-[#3366FF]" />}
              title="One-Click Onchain"
              description="Create verified onchain cards from your saved contacts with pre-filled data"
            />
          </div>
        </section>

        {/* Access Collection */}
        <section className="p-8 bg-[#E6E8EB]/30 rounded-lg text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#3366FF] flex items-center justify-center">
              <Library className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-[#111111]">Access Your Collection</h3>
            <p className="text-[#1A1A1A]/60 mt-2">
              Look for the "My BeMember" button in the header with your collection count badge
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Step({ 
  number, 
  icon, 
  title, 
  description 
}: { 
  number: number; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="border border-[#E6E8EB] rounded-lg p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#3366FF] text-white flex items-center justify-center">
          {number}
        </div>
        <div className="text-[#3366FF]">{icon}</div>
      </div>
      <h3 className="text-[#111111]">{title}</h3>
      <p className="text-sm text-[#1A1A1A]/60">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 border border-[#E6E8EB] rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-[#3366FF]/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-[#111111] mb-1">{title}</h4>
        <p className="text-sm text-[#1A1A1A]/60">{description}</p>
      </div>
    </div>
  );
}

function Search({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ViewToggle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
