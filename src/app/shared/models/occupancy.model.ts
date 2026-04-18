export interface FacilityCompliance {
    maxCapacity: number;
    currentOccupancy: number;
    status: 'NORMAL' | 'WARNING' | 'DANGER';
}

export interface OccupancyEvent {
    timestamp: string;
    flow: 'IN' | 'OUT';
    sensorId: string;
    totalCount: number;
}
