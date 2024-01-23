import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();
  constructor(private http: HttpClient, private router:Router ) {}
  private BACKEND_URL = `${environment.apiUrl}/posts`;

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: Post[], maxPosts: number }>(
        `${this.BACKEND_URL}`+queryParams
      )
      .subscribe((postsData: any) => {
        console.log(postsData.posts)
        this.posts = postsData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: postsData.maxPosts
        });
      });
    return [...this.posts];
  }
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title)
    postData.append("content", content)
    postData.append("image",image, title);
    this.http
      .post<{ message: string; post: Post }>(`${this.BACKEND_URL}`, postData)
      .subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['/'])
      });
  }
  updatePost(title: string, content: string, image: string, id: string) {
    const post: Post = { _id: id, title: title, content: content, imagePath: image, creator: '' };
    console.log(post)
    this.http
      .put<{ id: string; message: string }>(
        `${this.BACKEND_URL}/${id}`,
        post
      )
      .subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['/'])
      });
  }

  deletePost(postId: number) {
    return this.http
      .delete(`${this.BACKEND_URL}/${postId}`)
  }

  getPost(postId: string) {
    return this.http.get(`${this.BACKEND_URL}/${postId}`)
  }
}
