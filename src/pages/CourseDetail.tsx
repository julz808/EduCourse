
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  BookOpen, 
  FileText, 
  Target, 
  BarChart3, 
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { courses, faqs } from '@/data/courses';
import { Course } from '@/types';
import { toast } from '@/components/ui/use-toast';

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  
  useEffect(() => {
    const foundCourse = courses.find(c => c.slug === slug);
    if (foundCourse) {
      setCourse(foundCourse);
      document.title = `${foundCourse.title} | EduCourse`;
    }
  }, [slug]);

  const handleBuyNow = () => {
    toast({
      title: "Checkout initiated",
      description: "This would normally redirect to Stripe Checkout. Feature coming soon!",
    });
  };

  const handleFreePreview = () => {
    toast({
      title: "Free Preview",
      description: "Starting your free preview experience...",
    });
    // Navigate to a demo or free preview section
  };

  if (!course) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-80px)] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-edu-light-blue">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-8">{course.shortDescription}</p>
            <p className="text-2xl font-semibold mb-6">${course.price}</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={handleBuyNow}>Buy Now</Button>
              <Button size="lg" variant="outline" onClick={handleFreePreview}>Start Free Preview</Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">Target: {course.target}</p>
          </div>
        </div>
      </div>

      {/* What's Included Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <IncludedItem 
                icon={<Target className="h-6 w-6" />}
                title="Diagnostic Test" 
                description="Personalized assessment to identify strengths and weaknesses" 
              />
              <IncludedItem 
                icon={<FileText className="h-6 w-6" />}
                title="5 Practice Tests" 
                description="Full-length tests that mimic the real exam format" 
              />
              <IncludedItem 
                icon={<BookOpen className="h-6 w-6" />}
                title="Skill-by-Skill Drills" 
                description="Targeted practice for mastering specific concepts" 
              />
              <IncludedItem 
                icon={<BarChart3 className="h-6 w-6" />}
                title="AI Insights Dashboard" 
                description="Data-driven recommendations for study focus" 
              />
              <IncludedItem 
                icon={<TrendingUp className="h-6 w-6" />}
                title="Progress Tracking" 
                description="Monitor improvement across all skills and topics" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {course.skills.map((skill, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Course Overview</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-lg">{course.fullDescription}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Guarantee</h2>
            <p className="text-lg mb-8">
              We're confident in the quality of our courses. If you're not completely satisfied, 
              we offer a money-back guarantee within 7 days of purchase. 
              Email support@educourse.com.au anytime for assistance.
            </p>
            <Button size="lg" onClick={handleBuyNow}>Get Started Today</Button>
            <p className="mt-4 text-sm text-gray-500">No credit card required for free preview</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const IncludedItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-primary">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default CourseDetail;
