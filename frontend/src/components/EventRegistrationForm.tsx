import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const EventRegistrationForm = ({ event }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setIsRegistered(true);
  };

  if (isRegistered) {
    return (
      <div className="mt-8 text-center">
        <h3 className="mb-4 text-xl font-semibold">Registration Successful!</h3>
        <p className="text-muted-foreground">
          You will receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-semibold">Register for this event</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" placeholder="+1 234 567 890" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college">College/Company (optional)</Label>
            <Input id="college" placeholder="University of Example" />
          </div>
        </div>
        {event.price !== "Free" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="promo">Promo Code (optional)</Label>
              <Input id="promo" placeholder="PROMO2023" />
            </div>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox id="consent" />
          <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground">
            I consent to my data being processed according to the privacy policy.
          </Label>
        </div>
        {event.price !== "Free" && (
            <div>
                <Label>Payment</Label>
                <div className="p-4 border rounded-md">
                    Payment gateway integration would go here.
                </div>
            </div>
        )}
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
};
