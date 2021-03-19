import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService, AlertService } from '@app/_services';
import { ModalService } from '@app/_modal';
import { User } from '@app/_models';

/**
 * Functionality for the home screen table and modal utility for money transfer among users
 */

@Component({
    templateUrl: './memberlist.component.html',
    styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent implements OnInit {
    submitted = false;
    users = null;
    sender: User;
    receiver = { firstName: null, lastName: null, balance: null, id: null };
    form: FormGroup;
    loading = false;


    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private modalService: ModalService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.sender = this.accountService.userValue;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            balance: ['', Validators.required]
        });
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    openModal(id: string, receiverID) {
        this.modalService.open(id);
        this.form.reset();
        Object.keys(this.form.controls).forEach(key => {
            this.form.controls[key].setErrors(null)
        });
        this.receiver = this.users.find(x => x.id === receiverID + 1);
        this.sender = this.users.find(x => x.id === this.sender.id);
    }

    closeModal(id: string) {
        this.form.reset();
        this.modalService.close(id);
    }

    get f() { return this.form.controls; }

    refresh() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
        this.receiver = this.users.find(x => x.id === this.receiver.id + 1);
        this.sender = this.users.find(x => x.id === this.sender.id);

    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid){
            return;
        }

        this.modalService.close('custom-modal-1');

        let senderBalance = {
            balance: (Number(this.sender.balance) - this.f.balance.value).toFixed(2)
        };

        let receiverBalance = {
            balance: (Number(this.receiver.balance) + this.f.balance.value).toFixed(2)
        };

        this.accountService.update(this.sender.id, senderBalance)
            .pipe(first())
            .subscribe(
                data => {},
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

        this.accountService.update(this.receiver.id, receiverBalance)
            .pipe(first())
            .subscribe(
                async data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);

        this.modalService.close('custom-modal-1');
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);

    }

}
