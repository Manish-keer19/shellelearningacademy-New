import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Download, Share2 } from "lucide-react";
import certificate1 from "@/assets/certificate12.png";
import certificate2 from "@/assets/certificate13.png";

const Certificate = () => {
  const { courseId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-3 sm:mb-4" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-primary">
              Congratulations!
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              You've successfully completed the course
            </p>
          </div>

          {/* Certificate */}
          <div className="mb-6 sm:mb-8">
            <img
              src={certificate1}
              alt="Certificate of Completion"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg object-contain"
              style={{ maxHeight: '600px' }}
            />
          </div>

          {/* Certificate Gallery */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <img
                src={certificate1}
                alt="Certificate Template 1"
                className="w-full rounded-lg object-contain"
                style={{ maxHeight: '300px' }}
              />
              <p className="text-center mt-2 text-xs sm:text-sm text-muted-foreground">Professional Certificate</p>
            </Card>
            <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <img
                src={certificate2}
                alt="Certificate Template 2"
                className="w-full rounded-lg object-contain"
                style={{ maxHeight: '300px' }}
              />
              <p className="text-center mt-2 text-xs sm:text-sm text-muted-foreground">Achievement Certificate</p>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary-hover text-primary-foreground">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download Certificate
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Share on LinkedIn
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Certificate;