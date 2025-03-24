import "@scicatproject/scicat-sdk-ts-angular";

// Extend the existing interface
declare module "@scicatproject/scicat-sdk-ts-angular" {
  interface OutputDatasetObsoleteDto {
    /**
     * IDs of the instruments where the data was created.
     */
    instrumentIds?: Array<string>;
  }
}
