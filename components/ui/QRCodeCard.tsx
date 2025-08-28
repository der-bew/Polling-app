import React from 'react';
import Card from './Card';

export default function QRCodeCard({ code }: { code?: string }) {
  return (
    <Card>
      <h4 className="font-medium">QR Code (placeholder)</h4>
      <div className="mt-2 bg-gray-100 h-32 w-32 flex items-center justify-center">{code ?? 'QR'}</div>
    </Card>
  );
}
