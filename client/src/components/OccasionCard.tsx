import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OccasionCardProps {
  title: string;
  image: string;
  description: string;
  onClick?: () => void;
}

export default function OccasionCard({ title, image, description, onClick }: OccasionCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2" data-testid={`text-occasion-title-${title.toLowerCase()}`}>
            {title}
          </h3>
          <p className="text-sm text-white/80 mb-4" data-testid={`text-occasion-description-${title.toLowerCase()}`}>
            {description}
          </p>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            onClick={onClick}
            data-testid={`button-occasion-${title.toLowerCase()}`}
          >
            Shop Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
