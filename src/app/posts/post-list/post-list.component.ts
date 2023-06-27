import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
  posts:Post[]=[]
  private postSub!:Subscription;
constructor(private postService:PostsService){}
ngOnInit(): void {
  this.posts=this.postService.getPosts();
  this.postSub=this.postService.getPostUpdateListener().subscribe((posts:Post[])=>{
    this.posts=posts;
  })
}
ngOnDestroy(): void {
  this.postSub.unsubscribe();
}
}
