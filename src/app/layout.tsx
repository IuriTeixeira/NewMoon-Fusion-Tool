import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import HeaderComponent from "./Components/HeaderComponent";

export const metadata: Metadata = {
    title: "New Moon Fusion Tool",
    description: "Fusion Tool for the New Moon server",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider defaultColorScheme="auto">
                    <HeaderComponent/>
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
