import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { createApplication } from "@/service/application.service";
import toast from "react-hot-toast";

export const ApplicationForm = ({ job }) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    formData.append("position", job.title);
    try {
      await createApplication(formData);
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mt-8 text-center">
        <h3 className="mb-4 text-xl font-semibold">Application Submitted!</h3>
        <p className="text-muted-foreground">
          Thank you for your interest. HR will contact shortlisted candidates.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-semibold">Apply for this position</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" name="mobile" placeholder="+1 234 567 890" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position Applying For</Label>
            <Input id="position" name="position" value={job.title} readOnly />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="experience">Experience (years)</Label>
            <Input id="experience" name="experience" type="number" placeholder="5" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Input id="location" name="location" placeholder="New York, NY" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume">Resume (PDF/DOC)</Label>
          <Input id="resume" name="resume" type="file" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverMessage">Short Cover Message (optional)</Label>
          <Textarea id="coverMessage" name="coverMessage" placeholder="Tell us a bit about yourself..." />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="consent" required />
          <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground">
            I consent to my data being processed according to the privacy policy.
          </Label>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        HR will contact shortlisted candidates.
      </p>
    </div>
  );
};
