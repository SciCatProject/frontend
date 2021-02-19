import { MatTreeModule} from '@angular/material/tree';
import { NgModule } from "@angular/core";
import { TreeViewComponent } from './tree-view.component';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from 'shared/pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [TreeViewComponent],
  imports: [
    MatFormFieldModule,
    MatTreeModule,
    PipesModule,
    MatIconModule,
  ],
  exports: [TreeViewComponent]
})
export class TreeViewModule {}
