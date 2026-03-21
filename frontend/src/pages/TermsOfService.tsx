import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="mb-8 text-4xl font-bold text-foreground">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Course Access</h2>
            <p className="text-muted-foreground mb-4">
              Access to purchased courses is only for the registered user. Sharing credentials or materials is prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Payments and Refunds</h2>
            <p className="text-muted-foreground mb-4">
              All fees are in INR. Payments are via secure gateways. Refunds available within 7 days for valid cases.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Certification</h2>
            <p className="text-muted-foreground mb-4">
              Certificates are awarded after successful completion of all requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All materials are the intellectual property of Shell E-Learning Academy and cannot be reproduced or resold.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              Users must not use the site for illegal purposes or share harmful content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              We are not liable for damages due to technical errors or reliance on course content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p className="text-muted-foreground mb-4">
              Terms may change without prior notice. Continued use indicates acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms are governed by Indian law. Disputes fall under the jurisdiction of Indore, Madhya Pradesh, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};