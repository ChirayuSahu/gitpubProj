import React from 'react';

export default function NoMobile() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold">
        CodeClash is not available on screens smaller than 1024px. Please switch to a desktop or resize your window.
      </h1>
    </div>
  );
}
