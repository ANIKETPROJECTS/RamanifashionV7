import OccasionCard from '../OccasionCard';
import occasionImage from '@assets/generated_images/Festive_collection_banner_7a822710.png';

export default function OccasionCardExample() {
  return (
    <div className="p-8 max-w-md">
      <OccasionCard
        title="Weddings"
        image={occasionImage}
        description="Exquisite sarees for your special day"
        onClick={() => console.log('Occasion clicked')}
      />
    </div>
  );
}
