import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Calendar, Clock, Users, Star, Download, ExternalLink } from "lucide-react";

export const Certifications = () => {
  const [activeTab, setActiveTab] = useState("available");

  const availableCertifications = [
    {
      id: 1,
      title: "Full Stack Web Development Professional",
      description: "Comprehensive certification covering React, Node.js, MongoDB, and modern web development practices",
      provider: "Shell E-learning Academy",
      duration: "6 months",
      level: "Professional",
      price: "$299",
      rating: 4.8,
      studentsEnrolled: 1250,
      skills: ["React", "Node.js", "MongoDB", "JavaScript", "HTML/CSS", "REST APIs"],
      image: "/api/placeholder/400/250",
      validityPeriod: "3 years",
      examDuration: "3 hours",
      passingScore: "75%",
      prerequisites: "Basic programming knowledge",
      benefits: [
        "Industry-recognized certificate",
        "LinkedIn profile badge",
        "Career support",
        "Portfolio review"
      ]
    },
    {
      id: 2,
      title: "Data Science & Analytics Specialist",
      description: "Advanced certification in data analysis, machine learning, and statistical modeling using Python and R",
      provider: "Shell E-learning Academy",
      duration: "8 months",
      level: "Advanced",
      price: "$399",
      rating: 4.9,
      studentsEnrolled: 890,
      skills: ["Python", "R", "Machine Learning", "Statistics", "SQL", "Tableau"],
      image: "/api/placeholder/400/250",
      validityPeriod: "3 years",
      examDuration: "4 hours",
      passingScore: "80%",
      prerequisites: "Mathematics and basic programming",
      benefits: [
        "Industry-recognized certificate",
        "Project-based assessment",
        "Mentorship program",
        "Job placement assistance"
      ]
    }
  ];

  const earnedCertifications = [
    {
      id: 3,
      title: "JavaScript Fundamentals",
      issueDate: "2024-01-15",
      expiryDate: "2027-01-15",
      certificateId: "SHELL-JS-2024-001",
      grade: "A+",
      credentialUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Professional Certifications</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Advance your career with industry-recognized certifications from Shell E-learning Academy
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="available">Available Certifications</TabsTrigger>
            <TabsTrigger value="earned">My Certifications</TabsTrigger>
          </TabsList>

          {/* Available Certifications */}
          <TabsContent value="available">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {availableCertifications.map((cert) => (
                <Card key={cert.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 p-6 flex items-center justify-center">
                    <Award className="h-16 w-16 text-primary" />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{cert.title}</CardTitle>
                        <CardDescription className="mt-2">{cert.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{cert.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {cert.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {cert.studentsEnrolled} enrolled
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {cert.rating}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="mb-2 text-sm font-medium">Skills you'll gain:</p>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certification Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Exam Duration:</p>
                        <p className="text-muted-foreground">{cert.examDuration}</p>
                      </div>
                      <div>
                        <p className="font-medium">Passing Score:</p>
                        <p className="text-muted-foreground">{cert.passingScore}</p>
                      </div>
                      <div>
                        <p className="font-medium">Validity:</p>
                        <p className="text-muted-foreground">{cert.validityPeriod}</p>
                      </div>
                      <div>
                        <p className="font-medium">Prerequisites:</p>
                        <p className="text-muted-foreground">{cert.prerequisites}</p>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <p className="mb-2 text-sm font-medium">Certification Benefits:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {cert.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-primary">{cert.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">USD</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button size="sm">
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earned Certifications */}
          <TabsContent value="earned">
            {earnedCertifications.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {earnedCertifications.map((cert) => (
                  <Card key={cert.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{cert.title}</CardTitle>
                            <CardDescription>Certificate ID: {cert.certificateId}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {cert.grade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Issue Date:</p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Expiry Date:</p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(cert.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Verify Online
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Certifications Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your certification journey by enrolling in our professional programs
                </p>
                <Button onClick={() => setActiveTab("available")}>
                  Browse Certifications
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};