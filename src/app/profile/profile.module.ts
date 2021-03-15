import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout.component';
import { MemberlistComponent } from './memberlist.component';
import { ModalModule } from '@app/_modal';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        ModalModule,
    ],
    declarations: [
        LayoutComponent,
        MemberlistComponent,
    ],

})
export class UsersModule { }