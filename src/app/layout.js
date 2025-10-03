

import '../app/globals.css';

export const metadata = {
  title: 'Boolean Converter',
  description: 'Expression → Truth Table → K-map → Circuit → Verilog (frontend only)'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
