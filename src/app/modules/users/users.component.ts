import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialog.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public loading = false;
  public modal = false;
  public users: Array<User> = [];

  public userToEdit: User;

  constructor(
    private dialogService: DialogService,
    public usersService: UsersService
  ) {
    this.loadUsers();
  }

  ngOnInit(): void {}

  loadUsers(): void {
    this.loading = true;
    this.usersService
      .getUsers()
      .then((users: Array<User>) => {
        this.users = users;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  }

  onDelete(userId: number): void {
    this.usersService
      .preventDeleteUser(userId)
      .then(() => {
        this.dialogService.confirmThis(
          {
            text: 'modals.users.delete.content',
            type: 'confirm',
            yes: 'modals.users.delete.confirm',
            no: 'modals.cancel',
            icon: 'pia-icons pia-icon-sad',
            data: {
              btn_no: 'btn-blue',
              btn_yes: 'btn-red',
              modal_id: 'deleteUser'
            }
          },
          () => {
            // QUERY
            this.usersService
              .deleteUser(userId)
              .then(() => {
                // Delete from this.users
                const index = this.users.findIndex(u => u.id === userId);
                if (index !== -1) {
                  this.users.splice(index, 1);
                }
                return;
              })
              .catch(err => {
                console.log(err);
              });
          },
          () => {
            return;
          }
        );
      })
      .catch((error: Error) => {
        // Error
        this.dialogService.confirmThis(
          {
            text: error.message,
            type: 'yes',
            yes: 'modals.continue',
            no: '',
            icon: 'fa fa-cog icon-red',
            data: {
              btn_yes: 'btn-blue',
              no_cross_button: true
            }
          },
          () => {
            return false;
          },
          () => {
            return false;
          }
        );
      });
  }

  onEdit(userId): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.userToEdit = user;
      this.modal = true;
    }
  }

  onUserAdded($event: User): void {
    if ($event.id) {
      this.users.push($event);
    }
    this.userToEdit = null;
    this.modal = false;
    this.loadUsers();
  }
}