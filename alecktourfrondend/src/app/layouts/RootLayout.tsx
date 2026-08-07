import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { AuthModalProvider } from "../context/AuthModalContext";

export default function RootLayout() {
    return (
        <AuthModalProvider>
            <Toaster position="top-center" richColors />
            <Outlet />
        </AuthModalProvider>
    );
}