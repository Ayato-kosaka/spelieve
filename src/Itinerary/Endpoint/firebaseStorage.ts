import { getStorage } from 'firebase/storage';

import app from '@/Common/Endpoint/firebase';

export const storage = getStorage(app);
