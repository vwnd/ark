export interface WorkItemData {
  id: string;
  status:
    | 'success'
    | 'pending'
    | 'inprogress'
    | 'cancelled'
    | 'failedLimitProcessingTime'
    | 'failedDownload'
    | 'failedInstructions'
    | 'failedUpload'
    | 'failedUploadOptional';
  activityId: string;
  stats: {
    timedQueued: string;
  };
}
