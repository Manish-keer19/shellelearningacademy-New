import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from "@/hooks/redux";
import { EmsDashboardSkeleton } from "@/ems/components/EmsDashboardSkeleton";

const EmsPrivateRoute = () => {
    const { accessToken, user, isLoading } = useAppSelector((state) => state.auth);
    const allowedRoles = ["Employee", "Manager", "Super Admin"];

    // Show loading skeleton while auth state is being rehydrated
    if (isLoading) {
        return <EmsDashboardSkeleton />;
    }

    // If not authenticated, redirect to login page
    if (!accessToken) {
        return <Navigate to="/auth" />;
    }

    // If authenticated but not authorized, redirect to dashboard
    if (user && !allowedRoles.includes(user.accountType)) {
        return <Navigate to="/dashboard" />;
    }

    // If authenticated and authorized, render child routes
    return <Outlet />;
};

export default EmsPrivateRoute;
