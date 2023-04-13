import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from '../../_providers/search.pipe';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchDropdownPipe } from '../../_providers/search-dropdown.pipe';


@NgModule({
  declarations: [
    SearchPipe,
    SearchDropdownPipe
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    Ng2SearchPipeModule
  ],
  exports:[
    SearchPipe,
    InfiniteScrollModule,
    Ng2SearchPipeModule,
    SearchDropdownPipe
  ]
})
export class SharedModuleModule { }
