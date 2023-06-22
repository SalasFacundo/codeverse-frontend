import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteStudentComponent } from '../modales/delete-student/delete-student.component';
import { ModalCrearAlumnoComponent } from '../modales/modal-crear-alumno/modal-crear-alumno.component';
import { HttpClient } from '@angular/common/http';
import { ModifyStudentComponent } from '../modales/modify-student/modify-student.component';
import { DatosService } from 'src/app/services/datos.service';
import { LoginService } from 'src/app/services/loginService';
import { User } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { StudentDetailsModalComponent } from '../modales/student-details/student-details-modal/student-details-modal.component';
import { UserRoleEnum } from 'src/app/enums/UserRoleEnum';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-grilla',
  templateUrl: './grilla.component.html',
  styleUrls: ['./grilla.component.scss']
})
export class GrillaComponent implements OnInit {

  @Input()
  filter: string = ""
  displayedColumns: string[] = ['fullName', 'email'];
  dataSource: User[] = [];
  isAdmin: boolean = false;
  value: number = 0;
  articulos: any;
  user!: User;

  constructor(private matDialog: MatDialog,
              private http: HttpClient,
              private datosService: DatosService,
              private loginService: LoginService,
              private activatedRoute: ActivatedRoute,
              private userService: UserService
    ) { }

  ngOnInit(): void {
    this.fillColumns();
    this.user = this.loginService.getUser();
    this.isAdmin = this.user.role == UserRoleEnum.ADMIN;
    this.addColumns();
    this.userService.loadUsers();
  }

  openFormCreateStudent(): void {
    const dialog = this.matDialog.open(ModalCrearAlumnoComponent, { data: {students: this.dataSource} });
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        let user: User = valor;
        user.password = "password";
        user.role = "student"
       this.userService.addUser(valor);
       this.dataSource = [...this.dataSource, user]
      }
    })
  }

  openDeleteStudent(value: number): void {
    const dialog = this.matDialog.open(DeleteStudentComponent);
    dialog.afterClosed().subscribe((valor) => {
      if(valor == 'delete'){
        this.userService.deleteUser(value);
        this.dataSource = this.dataSource.filter(user => user.id != value)
      }
    })
  }

  openModifyStudent(value: User): void {
    const dialog = this.matDialog.open(ModifyStudentComponent, { data: {idSelected: value, students: this.dataSource} });
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        let user: User = value;
        user.name = valor.formValue.name;
        user.lastName = valor.formValue.lastName;
        user.dni = valor.formValue.dni;

        this.userService.updateUser(valor.originalId, user);
      }
    })
  }

  openStudentDetails(value: number){
    const dialog = this.matDialog.open(StudentDetailsModalComponent, {data: value});
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
      }
    })
  }

  addColumns() {
    if (this.isAdmin) {
      this.displayedColumns.push('dni')
      this.displayedColumns.push('action')
    } else if (this.displayedColumns.indexOf('action') != -1 && this.displayedColumns.indexOf('dni') != -1 && this.displayedColumns.indexOf('course') != -1 ) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('dni'), 1)
      this.displayedColumns.splice(this.displayedColumns.indexOf('action'), 1)
    }

  }

  fillColumns(){
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      if (this.filter == 'students') {
        this.datosService
          .getCourseById(
            Number(this.activatedRoute.snapshot.paramMap.get('id'))
          )
          .subscribe((value) => {
            //this.datosService.getUsersById(value[0].students).subscribe(valor => {this.dataSource = valor})
          });
      }  else if (this.filter == 'teachers') {
        this.datosService
          .getCourseById(
            Number(this.activatedRoute.snapshot.paramMap.get('id'))
          )
          .subscribe((value) => {
            //this.datosService.getUsersById(value[0].teachers).subscribe(valor => {this.dataSource = valor})
          });
      }
    } else {
      if(this.filter == "allStudents"){
        this.userService.getUsers(UserRoleEnum.STUDENT).subscribe(data=> {
          this.dataSource = data.usuarios;
        });

      }
      this.datosService.getStudents().subscribe((data) => {
        this.dataSource = data;
      });
    }
  }

}
