import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Ruler } from "lucide-react";

export default function SizeGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Size Guide</h1>
          <p className="text-pink-100">Find Your Perfect Fit</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-white p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Ruler className="h-6 w-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-900">Saree Dimensions</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Most traditional sarees come in standard dimensions that can be adjusted to fit different body types through draping techniques.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-pink-200">
                <thead>
                  <tr className="bg-pink-100">
                    <th className="text-left py-3 px-4 border-b border-pink-200">Dimension</th>
                    <th className="text-left py-3 px-4 border-b border-pink-200">Measurement</th>
                    <th className="text-left py-3 px-4 border-b border-pink-200">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">Saree Length</td>
                    <td className="py-3 px-4">5.5 - 6 meters</td>
                    <td className="py-3 px-4">Enough for draping with pallu</td>
                  </tr>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">Saree Width</td>
                    <td className="py-3 px-4">42 - 45 inches</td>
                    <td className="py-3 px-4">Standard width for traditional draping</td>
                  </tr>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">Blouse Piece</td>
                    <td className="py-3 px-4">0.8 - 1 meter</td>
                    <td className="py-3 px-4">For tailoring your blouse</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Pallu Length</td>
                    <td className="py-3 px-4">2 - 2.5 meters</td>
                    <td className="py-3 px-4">Decorative end piece</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Measure Yourself</h2>
            <p className="text-gray-700 mb-4">
              While sarees are versatile and adjustable, knowing your measurements helps with blouse tailoring:
            </p>
            
            <div className="space-y-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Bust Measurement</h3>
                <p className="text-gray-700 text-sm">Measure around the fullest part of your bust with arms at your sides</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Waist Measurement</h3>
                <p className="text-gray-700 text-sm">Measure at your natural waist level, keeping the tape measure relaxed</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Hip Measurement</h3>
                <p className="text-gray-700 text-sm">Measure around the fullest part of your hips</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Height</h3>
                <p className="text-gray-700 text-sm">Useful for determining how the saree will drape on your body</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Blouse Length</h3>
                <p className="text-gray-700 text-sm">From shoulder to the point you want your blouse to end (usually at waist or hip)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Standard Blouse Sizes</h2>
            <p className="text-gray-700 mb-4">
              Blouse pieces can be tailored to fit your exact measurements. Here are standard sizes:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-pink-200">
                <thead>
                  <tr className="bg-pink-100">
                    <th className="text-left py-3 px-4 border-b border-pink-200">Size</th>
                    <th className="text-left py-3 px-4 border-b border-pink-200">Bust (inches)</th>
                    <th className="text-left py-3 px-4 border-b border-pink-200">Waist (inches)</th>
                    <th className="text-left py-3 px-4 border-b border-pink-200">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">XS</td>
                    <td className="py-3 px-4">32-34</td>
                    <td className="py-3 px-4">26-28</td>
                    <td className="py-3 px-4">34-36</td>
                  </tr>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">S</td>
                    <td className="py-3 px-4">34-36</td>
                    <td className="py-3 px-4">28-30</td>
                    <td className="py-3 px-4">36-38</td>
                  </tr>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">M</td>
                    <td className="py-3 px-4">36-38</td>
                    <td className="py-3 px-4">30-32</td>
                    <td className="py-3 px-4">38-40</td>
                  </tr>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">L</td>
                    <td className="py-3 px-4">38-40</td>
                    <td className="py-3 px-4">32-34</td>
                    <td className="py-3 px-4">40-42</td>
                  </tr>
                  <tr className="border-b border-pink-100">
                    <td className="py-3 px-4 font-semibold">XL</td>
                    <td className="py-3 px-4">40-42</td>
                    <td className="py-3 px-4">34-36</td>
                    <td className="py-3 px-4">42-44</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">XXL</td>
                    <td className="py-3 px-4">42+</td>
                    <td className="py-3 px-4">36+</td>
                    <td className="py-3 px-4">44+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fabric & Drape Tips</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Handloom Sarees:</strong> Drape beautifully on all body types due to their weight and structure</li>
              <li><strong>Lightweight Fabrics:</strong> Cotton sarees are perfect for everyday wear and summer</li>
              <li><strong>Formal Occasions:</strong> Choose heavier materials like Paithani or Jamdani for special events</li>
              <li><strong>Comfort:</strong> All handloom materials are breathable and comfortable to wear all day</li>
              <li><strong>Adjustment:</strong> Sarees can be tucked higher or lower to suit your preference and body shape</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-3">
              Our team is here to help you find the perfect saree! If you need personalized size recommendations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Contact us via WhatsApp with your measurements</li>
              <li>Send photos of how you prefer to drape</li>
              <li>Ask about specific fabric recommendations for your body type</li>
              <li>We'll help you choose the right design and material</li>
            </ul>
          </section>

          <section className="bg-pink-50 p-6 rounded-lg">
            <p className="text-gray-900 font-semibold mb-2">Pro Tip:</p>
            <p className="text-gray-700">
              Traditional sarees are designed to be one size fits most. The beauty of a saree is in its versatility - the same saree can be worn differently by different people to suit their body type and personal style. Don't worry too much about exact sizing!
            </p>
          </section>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
