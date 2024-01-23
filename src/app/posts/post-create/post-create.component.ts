import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  postLoadingStatus: string = 'loaded';
  enteredTitle = '';
  enteredContent = '';
  enteredValue: string = '';
  private mode = 'create';
  private postId!: any;
  public post!: any;
  form!: FormGroup;
  imagePreview!: any;
  constructor(
    private postService: PostsService,
    public route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postLoadingStatus = 'loading';
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe((postData: any) => {
          this.postLoadingStatus = 'loaded';
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
          };
          console.log(this.post);
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
          this.imagePreview = this.post.imagePath;
          console.log(this.form.value);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  private initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      content: new FormControl(null, [Validators.required]),
      image: new FormControl(null, {
      }),
    });
  }

  onSavePost() {
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.post.id
      );
    }
    this.form.reset();
  }
  onImagePicked(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
