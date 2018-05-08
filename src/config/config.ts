export const config = {
  archiveable: ['datasetCreated', 'scheduleArchiveJobFailed'],
  retrieveable: ['datasetOnDiskAndTape', 'datasetOnTape', 'datasetOnArchiveDisk'],
  datasetStatusMessages: {
    datasetCreated: 'Dataset created',
    datasetOndisk: 'Stored on primary disk and on archive disk',
    datasetOnArchiveDisk: 'Stored on primary disk and on archive disk',
    datasetOnDiskAndTape: 'Stored on primary disk and on tape',
    datasetOnTape: 'Stored only in archive',
    datasetRetrieved: 'Retrieved to target disk',
    datasetDeleted: 'Deleted from archive and disk',
    scheduleArchive: "Scheduled for archiving",
    scheduleArchiveJobFailed:   "Dataset was scheduled for archiving, but job failed",
    schedulePurgeFromDisk: "Scheduled for purging from primary disk",
    schedulePurgeFromDiskFailed: "Dataset was scheduled for purging from primary disk, but Job failed",
    scheduleRetrieve: "Scheduled for retrieval",
    scheduleRetrieveJobFailed:   "Dataset was scheduled for retrieval, but job failed",
    scheduleDelete: "Scheduled for removal from archive",
    scheduleDeleteFailed: "Dataset was scheduled for removal from archive, but Job failed"
  }
};
