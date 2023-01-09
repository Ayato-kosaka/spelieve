import { LoadScript } from '@react-google-maps/api';
import { ReactNode } from 'react';

import { ENV } from './ENV';

import './Web.css';

export const AppProvider = ({ children }: { children: ReactNode }) => (
	<LoadScript googleMapsApiKey={ENV.GCP_API_KEY_WEB}>{children}</LoadScript>
);
