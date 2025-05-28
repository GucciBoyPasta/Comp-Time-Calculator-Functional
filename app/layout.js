
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><title>Comp Time Calculator</title></head>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
        {children}
      </body>
    </html>
  );
}
