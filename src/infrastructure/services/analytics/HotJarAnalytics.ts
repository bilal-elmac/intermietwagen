import { hotjar } from 'react-hotjar';

import { TrackingService } from '../../../services/TrackingService';

export class HotJarAnalytics implements TrackingService {
    private trackingId: number | null;
    constructor(trackingId: number | null) {
        this.trackingId = trackingId;
    }

    initialize(): void {
        if (this.trackingId) {
            hotjar.initialize(this.trackingId, 6);
        } else {
            console.warn('Hotjar is not tracking. Id is unavailable');
        }
    }
}
