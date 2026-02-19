import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon-lg"
      className="fixed bottom-8 left-8 z-50 h-14 w-14 rounded-full shadow-lg"
      aria-label="Create new try-on"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
