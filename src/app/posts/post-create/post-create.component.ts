import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
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
  form: FormGroup;
  imagePreview: string;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
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
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file  = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview =  reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.valid) {
      this.isLoading = true;
      if (this.mode === 'create') {
        this.postService.addPost(this.form.value.title, this.form.value.content);
      } else {
        this.postService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content
        );
      }
      this.form.reset();
    }
  }
  getErrorMessage() {
    return 'This Field is required';
  }
}
