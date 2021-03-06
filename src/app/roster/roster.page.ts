import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Student, StudentsService } from '../students.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.page.html',
  styleUrls: ['./roster.page.scss'],
})
export class RosterPage implements OnInit {
  students: Student[] = [];
  deletedStudents: Student[] = [];

constructor(
  private actionSheetController: ActionSheetController,
  private alertController: AlertController,
  private studentService: StudentsService,
  private toastController: ToastController) { }

ngOnInit() {
  this.students = this.studentService.getAll();
}
  
  studentUrl(student: Student) {
    return `/student/${student.id}`;
  }

async presentActionSheet(student: Student) {
  const actionSheet = await this.actionSheetController.create({
    header: `${student.firstName} ${student.lastName}`,
    buttons: [{
      text: 'Mark Present',
      icon: 'checkmark-circle-outline',
      handler: () => {
        student.status = 'present';
      }
    }, {
      text: 'Mark Absent',
      icon: 'close-circle-outline',
      handler: () => {
        student.status = 'absent';
      }
    }, {
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.presentDeleteAlert(student);
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
  });

  await actionSheet.present();
}

async presentDeleteAlert(student: Student) {
  const alert = await this.alertController.create(
    {
      header: 'Delete this student?',
      subHeader: `${student.firstName} ${student.lastName}`,
      message: 'This operation cannot be undone.',
      buttons: [
        {
          text: 'Delete',
          handler: () => this.deleteStudent(student)
        },
        {
          text: 'Never mind',
          role: 'cancel'
        }
      ]
    }
  );

  await alert.present();
}

async undoDelete(){
  if (this.deletedStudents.length > 0) {
    let lastDeleted = this.deletedStudents.pop();
    this.students.push(lastDeleted);
  }
}

async deleteStudent(student: Student) {
  this.students = this.students.filter(x => x.id !== student.id);
  this.deletedStudents.push(student);
  const alert = await this.toastController.create(
    {
      message: `${student.firstName} ${student.lastName} has been deleted.`,
      position: 'middle',
      duration: 5000,
      color: 'success',
      buttons: [
          {
            text: 'Undo',
            icon: 'arrow-undo-circle-sharp',
            handler: () => {  this.undoDelete() }
          }
      ]
    });

  await alert.present();
}

async sortRoster(){
  const sortedStudents: Student[] = this.students.sort(function(a, b) {
      var keyA = a.lastName, keyB = b.lastName;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
     }
  )
  
  this.students = sortedStudents; 
}

}
