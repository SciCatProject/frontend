import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { JsonHeadPipe } from "./json-head.pipe";
import { ObjKeysPipe } from "./obj-keys.pipe";
import { ReplaceUnderscorePipe } from "./replace-underscore.pipe";
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
    ObjKeysPipe,
    ReplaceUnderscorePipe,
    StripProposalPrefixPipe,
    ThumbnailPipe,
    TitleCasePipe
  ],
  imports: [CommonModule],
  exports: [
    FileSizePipe,
    FilePathTruncate,
    JsonHeadPipe,
    ObjKeysPipe,
    ReplaceUnderscorePipe,
    StripProposalPrefixPipe,
    ThumbnailPipe,
    TitleCasePipe
  ]
})
export class PipesModule {}
