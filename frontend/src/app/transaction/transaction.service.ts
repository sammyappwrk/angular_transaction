import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { TransactionInterface } from './transaction-interface';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private url = 'http://localhost:3000/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }
  
  getTransactions(page_num=1,limit=5){
    return this.httpClient.get(this.url+'listTranscation/'+page_num+'/'+limit);
  }
  addTranscation(post:TransactionInterface): Observable<any> {
  
    return this.httpClient.post(this.url+'create', JSON.stringify(post), this.httpOptions)
  
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getSpecificTransaction(id:number): Observable<any> {
  
    return this.httpClient.get(this.url + 'getTransaction/' + id)
  
    .pipe(
      catchError(this.errorHandler)
    )
  }
  updateTransaction(transactionId:number, post: TransactionInterface): Observable<any> {
    return this.httpClient.post(this.url+'updateTransaction/'+transactionId, JSON.stringify(post), this.httpOptions)
  
    .pipe(
      catchError(this.errorHandler)
    )
  }
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage))
 } 
  
}