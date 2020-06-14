import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Post } from '../posts.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubscription: Subscription;
  isLoading = false;
  totalPosts = 10;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  onDelete(postId) {
    this.postService.deletePost(postId);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    console.log(pageData);
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
