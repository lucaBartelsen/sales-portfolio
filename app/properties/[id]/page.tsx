// app/properties/[id]/page.tsx
'use client';

import { useState, use } from 'react';
import { sampleProperties } from '@/lib/sample-data';
import PropertyDetailView from '@/components/properties/property-detail-view';
import { Property } from '@/types/index';
import { notFound } from 'next/navigation';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = use(params);
  const property = sampleProperties.find(p => p.id === parseInt(id));

  if (!property) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <PropertyDetailView property={property} />
    </div>
  );
}