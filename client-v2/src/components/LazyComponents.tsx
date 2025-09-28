import { lazy } from 'react';

// Lazy load components that are not immediately needed
export const LazyRecordDetails = lazy(() => import('./recorddetails/RecordDetails'));
export const LazyUpsertSample = lazy(() => import('./messages/UpsertSample'));
export const LazyDeleteSample = lazy(() => import('./messages/DeleteSample'));
export const LazyHowItWorks = lazy(() => import('./messages/HowItWorks'));