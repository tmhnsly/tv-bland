import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <main>
          <nav>
            <Link href="/"> 📺 TV Bland</Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
