import { Subject } from 'rxjs';
import { Post } from './posts.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postUpdates = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // this requests will not be send if we donot subscribe to it
    // we donot need to unsubscribe using ondestroy as it will be handled by angular automatically
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              Id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdates.next([...this.posts]);
      });
    // return this.posts;
  }

  getPostById(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  getPostUpdateListener() {
    // Event Listener Created
    return this.postUpdates.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { Id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          Id: responseData.post.Id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        // post.Id = responseData.postId;
        this.posts.push(post);
        this.postUpdates.next([...this.posts]); // Emiting the event
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, postTitle: string, postContent: string, image: File | string) {
    // const post: Post = { Id: postId, title: postTitle, content: postContent, imagePath: null };
    let postData: Post | FormData;
    if ( typeof(image) === 'object' ) {
      postData = new FormData();
      postData.append('Id', postId);
      postData.append('title', postTitle);
      postData.append('content', postContent);
      postData.append('image', image, postTitle);
    } else {
      postData = { Id: postId, title: postTitle, content: postContent, imagePath: image };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + postId, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.Id === postId);
        const post: Post = {
          Id: postId,
          title: postTitle,
          content: postContent,
          imagePath: null
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdates.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.Id !== postId);
        this.posts = updatedPosts;
        this.postUpdates.next([...this.posts]);
      });
  }
}
