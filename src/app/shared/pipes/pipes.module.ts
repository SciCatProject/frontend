import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { JsonHeadPipe } from "./json-head.pipe";
import { KeysPipe } from "./keys.pipe";
import { ObjKeysPipe } from "./obj-keys.pipe";
import { ReplaceUnderscorePipe } from "./replace-underscore.pipe";
import { ScientificMetadataPipe } from "./scientific-metadata.pipe";
import { StripProposalPrefixPipe } from "./stripProposalPrefix.pipe";
import { ThumbnailPipe } from "./thumbnail.pipe";
import { TitleCasePipe } from "./title-case.pipe";
import { FileSizePipe } from "./filesize.pipe";
import { FilePathTruncate } from "./file-path-truncate.pipe";

@NgModule({
  declarations: [
    FileSizePipe,
    FilePathTruncate,
    JsonHeadPipe,
    KeysPipe,
    ObjKeysPipe,
    ReplaceUnderscorePipe,
    ScientificMetadataPipe,
    StripProposalPrefixPipe,
    ThumbnailPipe,
    TitleCasePipe
  ],
  imports: [CommonModule],
  exports: [
    FileSizePipe,
    FilePathTruncate,
    JsonHeadPipe,
    KeysPipe,
    ObjKeysPipe,
    ReplaceUnderscorePipe,
    ScientificMetadataPipe,
    StripProposalPrefixPipe,
    ThumbnailPipe,
    TitleCasePipe
  ]
})
export class PipesModule {}
