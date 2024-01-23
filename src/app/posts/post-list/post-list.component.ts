import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
  posts:Post[]=[]
  postListStatus !: string
  private postSub!:Subscription;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10]
  private authStatusSub!: Subscription;
  userIsAuthenticated = false;
  userId!: string;

constructor(private postService:PostsService, private authService: AuthService){}
ngOnInit(): void {
  this.postListStatus = 'loading'
  this.postService.getPosts(this.postsPerPage, this.currentPage);
  this.userId = this.authService.getUserId();
  this.postSub=this.postService.getPostUpdateListener().subscribe((postData:{posts: Post[], postCount: number})=>{
    this.posts=postData.posts;
    this.totalPosts = postData.postCount;

    this.postListStatus = 'loaded'
  });
  this.userIsAuthenticated = this.authService.getIsAuth();
  this.authStatusSub = this.authService.getAuthStatusLIstener().subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
    this.userId = this.authService.getUserId();
  });
}
ngOnDestroy(): void {
  this.postSub.unsubscribe();
  this.authStatusSub.unsubscribe();
}
onDeletePost(postId: number){
  this.postListStatus = 'loading'
this.postService.deletePost(postId).subscribe(() => {
  this.postService.getPosts(this.postsPerPage, this.currentPage)
}, () => {
  this.postListStatus = 'loaded'
})
}

onChangedPage(pageData: PageEvent){
  this.postListStatus ='loading'
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;
  this.postService.getPosts(this.postsPerPage, this.currentPage)
}
}
