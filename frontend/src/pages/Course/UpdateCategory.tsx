import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tag, Send, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from '@/hooks/redux';
import { adminService } from '@/service/admin.service';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const UpdateCategory = () => {
    const { categoryId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const token = useAppSelector((state) => state.auth.accessToken);

    const [categoryData, setCategoryData] = useState({
        name: "",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state?.category) {
            setCategoryData({
                name: location.state.category.name,
                description: location.state.category.description || "",
            });
        }
        // If not in state, we could fetch by ID if we had a getCategoryById endpoint
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryData.name.trim()) {
            toast.error("Category name is required.");
            return;
        }
        if (!token) {
            toast.error("Authentication Error. Please login again.");
            return;
        }

        try {
            setIsLoading(true);
            const res = await adminService.updateCategory({
                categoryId,
                ...categoryData
            }, token);
            
            toast.success(res.message || "Category updated successfully!");
            navigate('/add-category');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update category");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
                <div className="max-w-2xl mx-auto">
                    
                    <div className="mb-6">
                        <Button 
                            variant="link" 
                            onClick={() => navigate('/add-category')} 
                            className="text-primary hover:text-primary/80 transition-colors pl-0"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Categories
                        </Button>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-foreground">
                        Update Course <span className="text-primary">Category</span>
                    </h1>

                    <Card className="p-6 sm:p-8 bg-card/90 backdrop-blur-lg border-border/70 shadow-2xl shadow-primary/10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Tag className="w-4 h-4 text-primary" />
                                        Category Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={categoryData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter category name"
                                        required
                                        disabled={isLoading}
                                        className="h-11 border-border focus-visible:ring-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={categoryData.description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description..."
                                        disabled={isLoading}
                                        className="border-border focus-visible:ring-primary"
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 text-base bg-primary hover:bg-primary/90 font-bold  shadow-lg shadow-primary/30 transition-all duration-300" 
                                disabled={isLoading}
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Updating Category...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Update Category
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UpdateCategory;
