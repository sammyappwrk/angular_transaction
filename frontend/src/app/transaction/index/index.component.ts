import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  transactionList:any;
  totalRows!: number;
  currentPageRows!: number;
  pager:any = {
    pages: 0
  };
  constructor(private service:TransactionService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(x => this.loadPage(x['page'] || 1));
  }
  private loadPage(page_num:number) {
    // get page of items from api
    let limit = 2;
    this.service.getTransactions(page_num,limit)
        .subscribe((response: any)  => {
          this.transactionList = response.article.rows;
          this.currentPageRows = response.article.rows.length;
          this.totalRows = response.article.count;
          this.pager = response.pager;
        });
}
  deletetransaction(transactionId=''){

  }

}
