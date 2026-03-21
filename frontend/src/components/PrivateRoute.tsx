import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from "@/hooks/redux";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { accessToken } = useAppSelector((state) => state.auth);

    if (accessToken !== null) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
