import CategoryCard from '../CategoryCard';
import sareeImage from '@assets/generated_images/Bridal_saree_product_shot_3a9642d4.png';

export default function CategoryCardExample() {
  return (
    <div className="p-8 max-w-xs">
      <CategoryCard 
        name="Silk Sarees" 
        image={sareeImage} 
        itemCount={156}
        onClick={() => console.log('Category clicked')}
      />
    </div>
  );
}
