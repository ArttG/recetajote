import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import MainLayout from "@/components/MainLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider>
        <FavoritesProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </FavoritesProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
