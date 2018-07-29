/**
 * Created by harold on 7/11/18.
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PATHS} from "../../@core/config/constanst";
import {Observable} from "rxjs";
import {ServerResponse} from "../../@core/utils/ServerResponse";
@Injectable()

export class BlogService {

  constructor(private http: HttpClient){}

  getAllBlogCategories(): Observable<ServerResponse> {

    return this.http.get(PATHS.API + '&c=blog&m=get_all_categories');

  }

  createBlogCategory(categoryName): Observable<ServerResponse> {

    let blogCategory = JSON.stringify({category_name: categoryName});
    return this.http.post(PATHS.API + '&c=blog&m=blog_category_create', blogCategory);

  }

  updateBlogCategory(categoryId, categoryName): Observable<ServerResponse> {

    let blogCategory = JSON.stringify({category_id: categoryId, category_name: categoryName});
    return this.http.post(PATHS.API + '&c=blog&m=blog_category_update', blogCategory);

  }

  deleteBlogCategory(categoryId): Observable<ServerResponse> {

    let blogCategory = JSON.stringify({category_id: categoryId});
    return this.http.post(PATHS.API + '&c=blog&m=blog_category_delete', blogCategory);

  }

  getAllBlogPosts(): Observable<ServerResponse> {

    return this.http.get(PATHS.API + '&c=blog&m=get_all_blog_posts');

  }

  createBlogPost(post): Observable<ServerResponse> {

    return this.http.post(PATHS.API + '&c=blog&m=blog_post_create', post);

  }

  updateBlogPost(post): Observable<ServerResponse> {

    return this.http.post(PATHS.API + '&c=blog&m=blog_post_update', post);

  }

  deleteBlogPost(postId): Observable<ServerResponse> {

    let blogPostId = JSON.stringify({post_id: postId});
    return this.http.post(PATHS.API + '&c=blog&m=blog_post_delete', blogPostId);

  }

  getBlogPostById(postId): Observable<ServerResponse>{

    return this.http.get(PATHS.API + '&c=blog&m=get_blog_post_by_id&post_id=' + postId);

  }


}
