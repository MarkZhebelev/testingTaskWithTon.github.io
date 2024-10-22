'use client';
import React from 'react';
import './globals.css';
import {TonConnectUIProvider, THEME} from '@tonconnect/ui-react';
import {AppProvider} from '@/context/AppContext';
import StyledJsxRegistry from '@/app/registry';

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <TonConnectUIProvider
            manifestUrl="https://MarkZhebelev.github.io/testingTaskWithTon.github.io/tonconnect-manifest.json"
            uiPreferences={{theme: THEME.DARK}}
        >
            <StyledJsxRegistry>
                <AppProvider>{children}</AppProvider>
            </StyledJsxRegistry>
        </TonConnectUIProvider>
        </body>
        </html>
    );
}