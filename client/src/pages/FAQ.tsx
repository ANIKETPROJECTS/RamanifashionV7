import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [expandedId, setExpandedId] = useState<number | null>(0);

  const faqs = [
    {
      id: 1,
      question: "What materials do you use for your sarees?",
      answer: "We use premium natural materials including Jamdani, Paithani, Khadi Cotton, Mul Mul Cotton, Pure Linen, and Ajrakh Modal. Each saree is carefully selected to ensure authentic handloom quality and comfort."
    },
    {
      id: 2,
      question: "How do I choose the right size?",
      answer: "Most sarees are one size fits all as they can be draped to suit different body types. However, we provide a detailed Size Guide on our website. For specific concerns, please contact our customer service team via WhatsApp or email."
    },
    {
      id: 3,
      question: "Do you ship internationally?",
      answer: "Currently, we primarily ship within India. International shipping is available on request for select items. Please contact us directly to inquire about international orders."
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy from the date of delivery. Items must be unused, in original condition, and all tags must be intact. See our Returns & Exchange page for detailed information."
    },
    {
      id: 5,
      question: "How do I care for my saree?",
      answer: "Handloom sarees require gentle care. Dry clean or hand wash in cold water with mild detergent. Avoid bleach and harsh chemicals. Iron on low heat or use a steamer. Store in a cool, dry place away from direct sunlight."
    },
    {
      id: 6,
      question: "How long does delivery usually take?",
      answer: "Standard delivery takes 3-7 business days from the date of dispatch. Orders are processed within 1-2 business days. We offer free shipping on orders above ₹500."
    },
    {
      id: 7,
      question: "Can I track my order?",
      answer: "Yes! You'll receive a tracking link via email once your order is dispatched. You can also track your order through your account on our website. We send SMS and WhatsApp updates as well."
    },
    {
      id: 8,
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit cards, debit cards, UPI, digital wallets, and bank transfers. All transactions are processed securely through PhonePe gateway."
    },
    {
      id: 9,
      question: "Are your products authentic handloom?",
      answer: "Yes, all our sarees are 100% authentic handloom products sourced directly from trusted weavers. We work closely with artisans to ensure quality and authenticity."
    },
    {
      id: 10,
      question: "Do you offer bulk orders or wholesale?",
      answer: "Yes, we accommodate bulk orders and wholesale inquiries. Please contact our team directly via email at support@ramanifashion.com with your requirements."
    },
    {
      id: 11,
      question: "What should I do if I receive a damaged item?",
      answer: "If your item arrives damaged, please report within 24 hours with photos. We'll provide a free return label and either send a replacement or process a full refund."
    },
    {
      id: 12,
      question: "Can I exchange my item for a different size or color?",
      answer: "Absolutely! We offer free exchanges within 30 days for different sizes or colors of the same product, or for different products of similar value."
    },
    {
      id: 13,
      question: "How can I stay updated with new collections?",
      answer: "Subscribe to our newsletter from the footer of our website. You'll receive updates on new arrivals, sales, and exclusive offers directly in your email."
    },
    {
      id: 14,
      question: "Do you have a physical store?",
      answer: "We operate online, but you can connect with us via WhatsApp group to interact with other customers and see our products in detail. Visit our WhatsApp link in the footer."
    },
    {
      id: 15,
      question: "What is your customer service response time?",
      answer: "We aim to respond to all inquiries within 24 hours on business days. For urgent issues, you can reach us via WhatsApp for faster response."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-pink-100">Find answers to common questions about our products and services</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-white p-8">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-pink-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-pink-50 transition-colors text-left"
                  data-testid={`button-faq-${faq.id}`}
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {expandedId === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-pink-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedId === faq.id && (
                  <div className="border-t border-pink-100 p-4 bg-pink-50">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-pink-200">
            <p className="text-gray-700 mb-4">
              Didn't find your answer? We're here to help! Contact our customer service team via WhatsApp or email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                data-testid="button-contact-support"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
