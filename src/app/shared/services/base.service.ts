import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";

export class BaseService<T> {
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/resources';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    })
  }

  constructor(protected http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    // Log the complete error response to console
    console.error('Error occurred:', error);

    // Default error handling
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.error.message}`);
    } else {
      // Unsuccessful response error code returned from backend
      console.log(`Backend returned code ${error.status}, body was ${error.error}`);
    }

    return throwError(() => new Error('Something happened with request, please try again later'));
  }


  private resourcePath() {
    return `${this.basePath}${this.resourceEndpoint}`
  }
  create(item: any): Observable<T> {
     return this.http.post<T>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
       .pipe(retry(2), catchError(this.handleError));
  }

  delete(id: any) {
    return this.http.delete(`${this.resourcePath()}/${id}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  update(id: any, item: any) {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.resourcePath(), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }


  getById(id: any) {
    return this.http.get<T>(`${this.resourcePath()}/${id}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

}
