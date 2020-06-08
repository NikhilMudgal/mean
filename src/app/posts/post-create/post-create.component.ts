import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  title = '';
  content = '';
  mode = 'create';
  postId: string;
  post: Post;
  isLoading = false;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPostById(this.postId).subscribe((post) => {
          this.post = {
            Id: post._id,
            title: post.title,
            content: post.content,
          };
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      if (this.mode === 'create') {
        this.postService.addPost(form.value.title, form.value.content);
      } else {
        this.postService.updatePost(
          this.postId,
          form.value.title,
          form.value.content
        );
      }
      form.resetForm();
    }
  }
  getErrorMessage() {
    return 'This Field is required';
  }
}
