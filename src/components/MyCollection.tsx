import React, { useState } from 'react';
import { ArrowLeft, Plus, Download, Trash2, QrCode, Search, Grid3x3, List } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface MyCollectionProps {
  walletAddress: string | null;
  collection: any[];
  onBack: () => void;
  onCreateFromCard: (cardData: any) => void;
  onDeleteCard: (index: number) => void;
  onScanMore: () => void;
}

export default function MyCollection({
  walletAddress,
  collection,
  onBack,
  onCreateFromCard,
  onDeleteCard,
  onScanMore,
}: MyCollectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const filteredCollection = collection.filter((card) => {
    const query = searchQuery.toLowerCase();
    return (
      card.name?.toLowerCase().includes(query) ||
      card.email?.toLowerCase().includes(query) ||
      card.company?.toLowerCase().includes(query) ||
      card.title?.toLowerCase().includes(query)
    );
  });

  const downloadVCard = (card: any) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name || ''}
EMAIL:${card.email || ''}
TEL:${card.phone || ''}
TITLE:${card.title || ''}
ORG:${card.company || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(card.name || 'contact').replace(/\s+/g, '_')}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      onDeleteCard(deleteIndex);
      setDeleteIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E6E8EB] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-[#111111]">My BeMember</h2>
              <p className="text-sm text-[#1A1A1A]/60">
                {collection.length} {collection.length === 1 ? 'card' : 'cards'} collected
              </p>
            </div>
          </div>
          {walletAddress && (
            <span className="text-sm text-[#1A1A1A]/60">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {collection.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#E6E8EB] flex items-center justify-center">
                <QrCode className="w-10 h-10 text-[#1A1A1A]/40" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-[#111111]">No Cards Yet</h3>
              <p className="text-[#1A1A1A]/60 max-w-md mx-auto">
                Start building your collection by scanning business cards
              </p>
            </div>
            <Button onClick={onScanMore} className="bg-[#3366FF] hover:bg-[#2952CC]">
              <Plus className="w-4 h-4 mr-2" />
              Scan Your First Card
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search & Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#3366FF] hover:bg-[#2952CC]' : ''}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#3366FF] hover:bg-[#2952CC]' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button onClick={onScanMore} className="bg-[#3366FF] hover:bg-[#2952CC]">
                  <Plus className="w-4 h-4 mr-2" />
                  Scan More
                </Button>
              </div>
            </div>

            {/* Cards Grid/List */}
            {filteredCollection.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#1A1A1A]/60">No cards match your search</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollection.map((card, index) => (
                  <CardGridItem
                    key={index}
                    card={card}
                    onCreateCard={() => onCreateFromCard(card)}
                    onDownload={() => downloadVCard(card)}
                    onDelete={() => setDeleteIndex(collection.indexOf(card))}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCollection.map((card, index) => (
                  <CardListItem
                    key={index}
                    card={card}
                    onCreateCard={() => onCreateFromCard(card)}
                    onDownload={() => downloadVCard(card)}
                    onDelete={() => setDeleteIndex(collection.indexOf(card))}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this card from your collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CardGridItem({
  card,
  onCreateCard,
  onDownload,
  onDelete,
}: {
  card: any;
  onCreateCard: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border border-[#E6E8EB] rounded-lg p-6 space-y-4 hover:border-[#3366FF]/30 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-[#111111]">{card.name || 'Unknown'}</h3>
            {card.title && (
              <p className="text-sm text-[#1A1A1A]/70 mt-1">{card.title}</p>
            )}
          </div>
          {card.addedDate && (
            <Badge variant="outline" className="text-xs">
              New
            </Badge>
          )}
        </div>

        {card.company && (
          <p className="text-sm text-[#1A1A1A]/60">{card.company}</p>
        )}

        <div className="space-y-1">
          {card.email && (
            <p className="text-sm text-[#1A1A1A]/70">{card.email}</p>
          )}
          {card.phone && (
            <p className="text-sm text-[#1A1A1A]/70">{card.phone}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-[#E6E8EB]">
        <Button
          onClick={onCreateCard}
          size="sm"
          className="flex-1 bg-[#3366FF] hover:bg-[#2952CC]"
        >
          Create Card
        </Button>
        <Button onClick={onDownload} variant="outline" size="sm">
          <Download className="w-4 h-4" />
        </Button>
        <Button onClick={onDelete} variant="outline" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function CardListItem({
  card,
  onCreateCard,
  onDownload,
  onDelete,
}: {
  card: any;
  onCreateCard: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border border-[#E6E8EB] rounded-lg p-6 hover:border-[#3366FF]/30 transition-colors">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-[#111111]">{card.name || 'Unknown'}</h3>
            {card.addedDate && (
              <Badge variant="outline" className="text-xs">
                New
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#1A1A1A]/70">
            {card.title && <span>{card.title}</span>}
            {card.company && <span>{card.company}</span>}
            {card.email && <span>{card.email}</span>}
            {card.phone && <span>{card.phone}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onCreateCard}
            size="sm"
            className="bg-[#3366FF] hover:bg-[#2952CC]"
          >
            Create Card
          </Button>
          <Button onClick={onDownload} variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={onDelete} variant="outline" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
