import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../transaction.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
    
  form!: FormGroup;
  transaction_type: any = ['Credit', 'Debit'];
  serverError:any;
  submitted = false;
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
   // public postService: PostService,
    private router: Router,
    private service:TransactionService
  ) {
   }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required,Validators.min(1), RxwebValidators.numeric({allowDecimal:true,isFormat:true})]),
      description: new FormControl(''),
      transaction_type: new FormControl('', Validators.required)
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
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.service.addTranscation(this.form.value)
    .subscribe(response => {
      if(response.status == 'success'){
        this.router.navigateByUrl('transaction');
      }
      else{
        var serverErrors = response.results;
        for (let prop in serverErrors) {
          this.form.controls[prop].setErrors({serverError:serverErrors[prop]})
         }
      }
    });
    
  }
  
}