import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, GraduationCap } from "lucide-react";
import { workshopService } from "@/service/workshop.service";
import toast from "react-hot-toast";

interface WorkshopRegistrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workshopId: string;
    workshopTitle: string;
    workshopType: 'Free' | 'Paid';
    workshopPrice: number;
    accessToken?: string; // Made optional to allow registration without login
    onSuccess?: () => void;
}

export const WorkshopRegistrationModal: React.FC<WorkshopRegistrationModalProps> = ({
    open,
    onOpenChange,
    workshopId,
    workshopTitle,
    workshopType,
    workshopPrice,
    accessToken,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        year: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.college || !formData.year) {
            toast.error("Please fill in all fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        setSubmitting(true);
        try {
            const response = await workshopService.registerForWorkshop(
                {
                    workshopId,
                    ...formData
                },
                accessToken
            );

            toast.success(response.message || "Registration successful! Our team will contact you shortly.");

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                college: '',
                year: ''
            });

            onOpenChange(false);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error("Registration failed:", error);
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-primary" />
                        Register for Workshop
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        <span className="font-semibold text-foreground">{workshopTitle}</span>
                        <br />
                        Fill in your details to register for this workshop.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">
                            Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            maxLength={10}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="college" className="text-sm font-semibold">
                            College/University <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="college"
                            placeholder="Enter your college name"
                            value={formData.college}
                            onChange={(e) => handleChange('college', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="year" className="text-sm font-semibold">
                            Year of Study <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.year} onValueChange={(value) => handleChange('year', value)}>
                            <SelectTrigger id="year">
                                <SelectValue placeholder="Select your year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem>
                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                <SelectItem value="4th Year">4th Year</SelectItem>
                                <SelectItem value="Graduate">Graduate</SelectItem>
                                <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>



                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary/90"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Registration'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
