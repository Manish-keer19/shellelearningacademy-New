import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
    return (
        <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
            {/* Welcome Section Skeleton */}
            <div className="mb-12">
                <Skeleton className="h-12 w-96 mb-2" />
                <Skeleton className="h-6 w-64" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-6 bg-card/90 backdrop-blur-sm border border-border/70">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <Skeleton className="w-12 h-12 rounded-xl" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <div className="mb-12">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="bg-card/90 backdrop-blur-sm border border-border/70">
                            <div className="p-6 text-center">
                                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                                <Skeleton className="h-4 w-40 mx-auto" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Continue Learning Skeleton */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden bg-card/90 backdrop-blur-sm border border-border/70">
                            <Skeleton className="aspect-video w-full" />
                            <div className="p-5">
                                <Skeleton className="h-6 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4 mb-4" />
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recommended Courses Skeleton */}
            <div className="mb-12">
                <Skeleton className="h-8 w-56 mb-6" />
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="bg-card/90 backdrop-blur-sm border-border/70">
                            <Skeleton className="aspect-video w-full rounded-t-lg" />
                            <div className="p-4">
                                <Skeleton className="h-5 w-full mb-2" />
                                <Skeleton className="h-3 w-3/4 mb-3" />
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-12" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const StudentDashboardSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
            {/* Welcome Section Skeleton */}
            <div className="mb-12">
                <Skeleton className="h-10 w-80 mb-2" />
                <Skeleton className="h-6 w-96" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-6 bg-card/90 backdrop-blur-sm border border-border/70">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <Skeleton className="w-12 h-12 rounded-xl" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Search Section Skeleton */}
            <div className="mb-12">
                <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="h-7 w-56" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Continue Learning Skeleton */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden bg-card/90 backdrop-blur-lg border-border/70">
                            <Skeleton className="aspect-video w-full rounded-t-lg" />
                            <div className="p-5">
                                <Skeleton className="h-6 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4 mb-4" />
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recommended Courses Skeleton */}
            <div>
                <Skeleton className="h-8 w-56 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="bg-card/90 backdrop-blur-lg border-border/70">
                            <Skeleton className="aspect-video w-full rounded-t-lg" />
                            <div className="p-4">
                                <Skeleton className="h-5 w-full mb-2" />
                                <Skeleton className="h-3 w-3/4 mb-3" />
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-12" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const EnrolledCourseViewSkeleton = () => {
    return (
        <main className="flex-1 container mx-auto px-4 py-8 pt-24 max-w-6xl">
            {/* Back Button Skeleton */}
            <Skeleton className="h-10 w-40 mb-6" />

            {/* Header Section Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6 mb-6" />

                {/* Progress Bar Skeleton */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4 max-w-md">
                    <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full mb-2" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area Skeleton */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Classes Section Skeleton */}
                    <div>
                        <div className="mb-6">
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <Card key={i} className="overflow-hidden border border-border">
                                    <div className="h-1.5 bg-gradient-to-r from-primary to-primary/60" />
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Skeleton className="h-6 w-24" />
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <Skeleton className="h-6 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4 mb-5" />
                                        <div className="flex gap-3">
                                            <Skeleton className="h-10 w-32" />
                                            <Skeleton className="h-10 w-36" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Previous Classes Section Skeleton */}
                    <div>
                        <div className="mb-6">
                            <Skeleton className="h-8 w-56 mb-2" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                        <Card className="border-dashed border-2">
                            <div className="p-12 text-center">
                                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                                <Skeleton className="h-4 w-64 mx-auto" />
                            </div>
                        </Card>
                    </div>

                    {/* Course Curriculum Skeleton */}
                    <div>
                        <Skeleton className="h-8 w-56 mb-4" />
                        <div className="border border-border/60 rounded-xl overflow-hidden">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border-b border-border/60 last:border-0">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                            <div>
                                                <Skeleton className="h-5 w-48 mb-1" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-6">
                    <Card className="border-primary/30">
                        <div className="p-6">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="bg-background/50 rounded-lg p-4 border border-primary/20">
                                <Skeleton className="h-6 w-32 mb-2" />
                                <Skeleton className="h-4 w-28 mb-1" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-primary/20">
                        <div className="p-6">
                            <Skeleton className="h-6 w-32 mb-3" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <div className="space-y-3">
                                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                                    <Skeleton className="h-3 w-12 mb-1" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                                    <Skeleton className="h-3 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
};

export const WorkshopsSkeleton = () => {
    return (
        <div className="min-h-screen font-sans">
            {/* Hero Section Skeleton */}
            <div className="pt-32 pb-20 bg-gradient-to-r from-green-600 to-green-800">
                <div className="container mx-auto px-4 text-center">
                    <Skeleton className="h-14 w-3/4 mx-auto mb-4 bg-green-200/20" />
                    <Skeleton className="h-6 w-2/3 mx-auto bg-green-200/20" />
                </div>
            </div>

            {/* Workshops Grid Skeleton */}
            <div className="container mx-auto px-4 py-16 max-w-7xl">
                <Skeleton className="h-10 w-72 mb-10" />

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="flex flex-col overflow-hidden shadow-lg border-t-4 border-green-600">
                            {/* Thumbnail Skeleton */}
                            <Skeleton className="aspect-video w-full" />

                            {/* Card Content Skeleton */}
                            <div className="pt-6 pb-3 px-6">
                                <Skeleton className="h-6 w-24 mb-2" />
                                <Skeleton className="h-7 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>

                            {/* Metadata Skeleton */}
                            <div className="flex-grow space-y-3 px-6 pt-0 pb-4">
                                <div className="flex items-center">
                                    <Skeleton className="w-4 h-4 mr-3" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="flex items-center">
                                    <Skeleton className="w-4 h-4 mr-3" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex items-center">
                                    <Skeleton className="w-4 h-4 mr-3" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                            </div>

                            {/* Button Skeleton */}
                            <div className="px-6 pt-4 pb-6">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const WorkshopApplicationsSkeleton = () => {
    return (
        <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
            {/* Header Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-12 w-96 mb-2" />
                <Skeleton className="h-6 w-80" />
            </div>

            {/* Stats Card Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                    <div className="p-6 pb-3">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-xl" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Filter Skeleton */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg mb-6">
                <div className="p-6">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </Card>

            {/* Table Skeleton */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                <div className="p-6">
                    <Skeleton className="h-8 w-56 mb-6" />
                    <div className="space-y-4">
                        {/* Table Header */}
                        <div className="grid grid-cols-7 gap-4 pb-3 border-b">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        {/* Table Rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="grid grid-cols-7 gap-4 py-4 border-b">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

