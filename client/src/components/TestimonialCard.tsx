import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  image?: string;
  rating: number;
  review: string;
  verified?: boolean;
}

export default function TestimonialCard({ name, image, rating, review, verified }: TestimonialCardProps) {
  return (
    <Card className="h-full" data-testid={`card-testimonial-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold" data-testid={`text-testimonial-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
                {name}
              </h4>
              {verified && (
                <span className="text-xs text-primary" data-testid={`badge-verified-${name.toLowerCase().replace(/\s+/g, '-')}`}>
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-review-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          {review}
        </p>
      </CardContent>
    </Card>
  );
}
