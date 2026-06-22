import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuthModal } from "../context/AuthModalContext";

export function LoginRedirect() {
    const { openLogin } = useAuthModal();

    useEffect(() => {
        openLogin();
    }, []);

    return <Navigate to="/profile" replace />;
}

export function RegisterRedirect() {
    const { openRegister } = useAuthModal();

    useEffect(() => {
        openRegister();
    }, []);

    return <Navigate to="/" replace />;
}