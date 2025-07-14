import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
