import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialMoudle } from '../angular-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialMoudle,
    RouterModule,
  ],
})
export class PostsModule {}
