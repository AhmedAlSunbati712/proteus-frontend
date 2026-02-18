export interface WeaverJob {
    id: string;
    userId: string;
    vton_id: string;
    user_snap_s3: string;
    uncleaned_outfit_s3: string;
    created_at: Date;
}

export interface TailorJob {
    id: string;
    userId: string;
    vton_id: string;
    uncleaned_outfit_s3: string;
    created_at: Date;
}