import "./globals.css";
export const metadata = {
  title: "MERN-blog",
  description: "MERN-blog",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
