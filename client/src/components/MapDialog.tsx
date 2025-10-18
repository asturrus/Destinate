import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InteractiveMap } from "./InteractiveMap";

interface MapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MapDialog({ open, onOpenChange }: MapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Explore Destinations</DialogTitle>
          <DialogDescription>
            Click on any marker to discover amazing destinations around the world
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full flex-1 rounded-lg overflow-hidden border">
          <InteractiveMap />
        </div>
      </DialogContent>
    </Dialog>
  );
}
