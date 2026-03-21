import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />
     
      <main className="container mx-auto px-4 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-gradient">
            Course Demo
          </h1>
         
          <Card className="p-6 sm:p-8 md:p-12">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-6 sm:mb-8">
              <div className="text-center text-muted-foreground">
                <Play className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
                  No Demo Available Right Now
                </h2>
                <p className="text-base sm:text-lg">
                  We're working on creating amazing demo content for you.
                </p>
                <p className="text-sm sm:text-base mt-2 opacity-75">
                  Check back soon for course previews and demonstrations!
                </p>
              </div>
            </div>
           
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/all-courses')}
                className="bg-primary hover:bg-primary/90"
              >
                Explore All Courses
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;