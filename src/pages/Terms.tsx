/** @jsxImportSource react */
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 terms-of-service">
      <Helmet>
        <title>Terms of Service - MessyNotes.AI</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      {/* Add your terms of service content here */}
    </div>
  );
}