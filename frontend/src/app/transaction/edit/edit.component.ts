import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { TransactionService } from '../transaction.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ActivatedRoute } from '@angular/router';
import { TransactionInterface } from '../transaction-interface';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  transaction_type: any = ['Credit', 'Debit'];
  serverError:any;
  transactionId!: number;
  constructor(private router: Router, private service: TransactionService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.params['id'];
    this.service.getSpecificTransaction(this.transactionId)
    .subscribe(Response =>{
      if(Response !== null){
        this.form.patchValue({
          amount: Response.amount,
          description: Response.description,
          transaction_type: Response.transaction_type
        });
      }
      else{
        this.router.navigateByUrl('transaction');
      }
    });
    this.form = new FormGroup({
      amount: new FormControl(''),
      description: new FormControl(''),
      transaction_type: new FormControl('')
    });
  }
 /**
   * Write code on Method
   *
   * @return response()
   */
  get isError(){
    return this.form.controls;
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
  submit(){
    this.service.updateTransaction(this.transactionId,this.form.value)
    .subscribe((response: any) =>{
      if(response.status == 'success'){
        this.router.navigateByUrl('transaction');
      }
      else{
        var serverErrors = response.results;
        for (let prop in serverErrors) {
          this.form.controls[prop].setErrors({serverError:serverErrors[prop]})
         }
      }
    })
  }

}
