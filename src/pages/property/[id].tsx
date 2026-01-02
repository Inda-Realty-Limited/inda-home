import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Navbar } from '@/components';
import { PropertyDetail } from '@/views/property-details/PropertyDetail';
import apiClient from '@/api';
import LoadingScreen from '@/views/result/sections/LoadingScreen';
import NotFoundScreen from '@/views/result/sections/NotFoundScreen';
import { mapListingToPropertyDetail } from '@/views/property-details/utils';

const PropertyDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get('/listings', {
          params: { _id: id, limit: 1 }
        });
        const listings = response.data?.data?.items || response.data?.data?.listings || response.data?.listings || response.data?.data || [];
        const data = Array.isArray(listings) && listings.length > 0 ? listings[0] : null;
        
        if (!data) {
          setError('Listing not found');
          setLoading(false);
          return;
        }

        setListing(data);
      } catch (err: unknown) {
        console.error('Failed to fetch listing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [router.isReady, id]);

  if (loading) {
    return (
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <LoadingScreen currentStep={0} />
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <NotFoundScreen searchQuery={id as string} searchType="id" />
      </Container>
    );
  }

  const property = mapListingToPropertyDetail(listing);

  return (
    <Container noPadding className="min-h-screen bg-gray-50">
      <PropertyDetail 
        property={property}
        onBack={() => router.back()}
        onReserve={() => {}}
      />
    </Container>
  );
};

export default PropertyDetailsPage;
