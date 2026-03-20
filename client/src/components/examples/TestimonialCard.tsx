import TestimonialCard from '../TestimonialCard';
import customerImage from '@assets/generated_images/Customer_testimonial_portrait_6ffe6534.png';

export default function TestimonialCardExample() {
  return (
    <div className="p-8 max-w-md">
      <TestimonialCard
        name="Priya Sharma"
        image={customerImage}
        rating={5}
        review="Absolutely stunning saree! The quality is exceptional and the colors are even more beautiful in person. Highly recommend Ramani Fashion!"
        verified={true}
      />
    </div>
  );
}
