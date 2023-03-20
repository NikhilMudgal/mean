import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Post } from '../posts.model';
import { PostService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  userisAuthenticated = false;
  private postSubscription: Subscription;
  private authStatusSubs: Subscription;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((postsData: {posts: Post[], postCount: number}) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postCount;
        this.isLoading = false;
        console.log(this.userisAuthenticated);
      });
    this.userisAuthenticated = this.authService.getisAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isUserAuthenticated => {
      this.userisAuthenticated = isUserAuthenticated;
    });
  }

  onDelete(postId) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    console.log(pageData);
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
