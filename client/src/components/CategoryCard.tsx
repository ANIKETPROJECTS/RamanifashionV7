import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  image: string;
  itemCount?: number;
  onClick?: () => void;
}

export default function CategoryCard({ name, image, itemCount, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group"
      onClick={onClick}
      data-testid={`card-category-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold" data-testid={`text-category-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            {name}
          </h3>
          {itemCount !== undefined && (
            <p className="text-sm text-white/80" data-testid={`text-category-count-${name.toLowerCase().replace(/\s+/g, '-')}`}>
              {itemCount} items
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
