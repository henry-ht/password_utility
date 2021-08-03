import { HttpService } from './../../services/http.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import * as Dayjs from 'dayjs';
import { faCog, faEdit, faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;
  faCog = faCog;
  faEye = faEye;
  formCreate:FormGroup;
  accountList:any = [];
  readonly regUrl:string = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  textSearch:string = '';
  orderCreate_at:boolean = false;
  @ViewChild('account_name') accountNameInput: ElementRef;
  @ViewChild('password') passwordInput: ElementRef;

  constructor(private request:HttpService, private fb:FormBuilder) {

    this.formCreate = this.fb.group({
      account_name: ["", [Validators.required, Validators.minLength(3)]],
      username: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      site_url: ["", [Validators.required, Validators.minLength(8), Validators.pattern(this.regUrl)]],
      logo_url: ["", [ Validators.minLength(8), Validators.pattern(this.regUrl)]],
      created_at: ["", [Validators.required]],
      id: [""/* , Validators.pattern("^[0-9]*$") */],
    });
  }

  ngOnInit(): void {
    this.getAccount();
    // this.request.pingToUrl('url');
    console.log('reset 12: ', this.formCreate.value)
  }

  getAccount(id?:number){
    this.request.get('passwords'+(id ? '/'+id:'')).subscribe((data:any) => {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          if(!element.account_name){
            data.splice(key,1);
          }
        }
      }
      this.accountList = data;
    });
  }

  createAccount(){
    // this.validateUrl(this.formCreate.value.site_url);
    if(this.formCreate.value.id != ''){
        this.formAccountEdit();
    }else{
      this.formCreate.controls['created_at'].setValue(Dayjs().format('YYYY-MM-DD HH:mm:ss'));
      this.request.post('passwords', this.formCreate.value).subscribe((data:object) => {
        if(data){
          this.formCreateReset();
          this.getAccount();
        }
      });
    }

  }

  isValid(){
    return this.formCreate.controls
  }

  formCreateReset(){
    this.formCreate.reset();
    this.formCreate.controls['id'].setValue("");
    this.formCreate.controls['logo_url'].setValue(null);
    this.formCreate.controls['created_at'].setValue(Dayjs().format('YYYY-MM-DD HH:mm:ss'));

    console.log('reset: ', this.formCreate.value)
    this.accountNameInput.nativeElement.focus();
  }

  seePassword(){
    let pw = this.passwordInput.nativeElement;
    if(pw.type == 'password'){
      pw.type = 'text';
    }else{
      pw.type = 'password';
    }
  }

  setPassword() {
    length = (Math.random() * (10 - 6 + 1)) + 6;
    let pw = this.passwordInput.nativeElement;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
   }
   this.formCreate.controls['password'].setValue(result);
  //  pw.value = result;
  //  return result;
}

  addFormCreateEdit(data:object){
    this.formCreate.patchValue(data);
  }

  formAccountEdit(){
    this.request.put('passwords/'+this.formCreate.value.id, this.formCreate.value).subscribe((data:object) => {
      if(data){
        this.formCreateReset();
        this.getAccount();
      }
    });
  }

  accountDelete(data:object){
    Swal.fire({
      title: "¿Deseas eliminar a "+data['account_name']+" ?",
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.request.delete('passwords/'+data['id']).subscribe((data:object) => {
          if(data){
            Swal.fire(
              '¡Eliminado!',
              'Los datos ha sido eliminado.',
              'success'
            );
            this.getAccount();
          }
        });
      }
    })
  }

  validateUrl(url:string){
    this.request.pingToUrl(url);

      return null;
  }
  changeOrderCreate_at(order:boolean){
    this.orderCreate_at = order;
  }

}
