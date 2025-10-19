import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InteractiveMap } from "./InteractiveMap";

export function MapDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle>Explore Destinations</DialogTitle>
            <DialogDescription>
              Click on any marker to discover amazing destinations around the world
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-1 px-6 pb-6 min-h-0">
          <div className="w-full h-full rounded-lg overflow-hidden border">
            <InteractiveMap />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
