import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tag, Send, Loader2, ArrowLeft, MessageSquare, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from '@/hooks/redux';
import { adminService } from '@/service/admin.service';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
    const navigate = useNavigate();
    const token  = useAppSelector((state) => state.auth.accessToken);

    const [categoryData, setCategoryData] = useState({
        name: "",
        description: "",
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Handler for basic text inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({ ...prev, [name]: value }));
    };

    // Fetch all categories
    const fetchCategories = async () => {
        if (!token) return;
        try {
            setIsLoadingCategories(true);
            const res = await adminService.getAllCatagory(token);
            setCategories(res.data || []);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleDeleteCategory = async (categoryId: string) => {
        if (!token) return;
        try {
            const res = await adminService.deleteCategory(categoryId, token);
            toast.success(res.message || "Category deleted successfully!");
            fetchCategories(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete category");
        }
    };

    // Submit handler
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
            // Assuming adminService.createCatagory expects { name, description }
            const res = await adminService.createCatagory(categoryData, token);
            
            toast.success(res.message || "Category created successfully!");
            setCategoryData({ name: '', description: '' });
            fetchCategories(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create category");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
                <div className="max-w-2xl mx-auto">
                    
                    {/* Back Button Header */}
                    <div className="mb-6">
                        <Button 
                            variant="link" 
                            onClick={() => navigate('/dashboard')} 
                            className="text-primary hover:text-primary/80 transition-colors pl-0"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-foreground">
                        Create Course <span className="text-primary">Category</span>
                    </h1>

                    <Card className="p-6 sm:p-8 bg-card/90 backdrop-blur-lg border-border/70 shadow-2xl shadow-primary/10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Category Information Section */}
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
                                        placeholder="Enter category name (e.g., Web Development, Data Science)"
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
                                        placeholder="Brief description of what courses in this category cover..."
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
                                        Creating Category...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Create Category
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Existing Categories Section */}
                        <div className="mt-10 pt-6 border-t border-border/70">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                                <Tag className="w-5 h-5 text-primary" />
                                Existing Categories
                            </h3>
                            <div className="space-y-3">
                                {isLoadingCategories ? (
                                    <div className="flex items-center gap-2 text-muted-foreground animate-pulse p-4">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading categories...
                                    </div>
                                ) : categories.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {categories.map((category: any) => (
                                            <div 
                                                key={category._id} 
                                                className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50 hover:bg-muted/30 transition-all group"
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-foreground">
                                                        {category.name}
                                                    </span>
                                                    {category.description && (
                                                        <span className="text-xs text-muted-foreground line-clamp-1">
                                                            {category.description}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="h-8 w-8 p-0 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                                                        onClick={() => navigate(`/edit-category/${category._id}`, { state: { category } })}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="h-8 w-8 p-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
                                                                handleDeleteCategory(category._id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground p-4">No categories created yet.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CreateCategory;