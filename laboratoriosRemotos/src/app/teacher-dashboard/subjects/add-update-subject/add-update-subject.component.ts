import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { SubjectTeacher } from 'src/app/models/SubjectTeacher';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-update-subject',
  templateUrl: './add-update-subject.component.html',
  styleUrls: ['./add-update-subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUpdateSubjectComponent implements OnInit {

  @Input() subjectId!: string;
  @Output() successOperation: EventEmitter<ObjectDB<string>> = new EventEmitter();

  subjectForm!: FormGroup
  processing!: boolean;

  fieldFeatures: any = {
    name: ['nombre', 5, 60],
    description: ['descripcion', null, 400],
    numGroup: ['numGrupos', 1, 4],
  }

  constructor(private readonly fb: FormBuilder, private subjectSvc: SubjectService, private userSvc: UserService) { }

  ngOnInit(): void {
    this.processing = false;
    if (this.subjectId) {
      this.subjectForm = this.initFormUpdate()
      this.subjectSvc.getSubjectById(this.subjectId).then((resp: SubjectTeacher) => this.setValues(resp));
    } else {
      this.subjectForm = this.initForm()
    }
  }

  initForm() {
    return this.fb.group({
      description: ['', Validators.maxLength(this.fieldFeatures.description[2])],
      name: ['', [
        Validators.required,
        Validators.minLength(this.fieldFeatures.name[1]),
        Validators.maxLength(this.fieldFeatures.name[2])]
      ],
      numGroup: ['', [
        Validators.required,
        Validators.min(this.fieldFeatures.numGroup[1]),
        Validators.max(this.fieldFeatures.numGroup[2])]
      ]
    })
  }

  initFormUpdate() {
    return this.fb.group({
      description: ['', Validators.maxLength(this.fieldFeatures.description[2])],
      name: ['', [
        Validators.required,
        Validators.minLength(this.fieldFeatures.name[1]),
        Validators.maxLength(this.fieldFeatures.name[2])]
      ],
      numGroup: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.min(this.fieldFeatures.numGroup[1]),
        Validators.max(this.fieldFeatures.numGroup[2])]
      ]
    })
  }

  setValues(subject: SubjectTeacher) {
    this.subjectForm.get('description')?.setValue(subject.getDescripcion());
    this.subjectForm.get('name')?.setValue(subject.getNombre());
    this.subjectForm.get('numGroup')?.setValue(subject.getNumGrupos());
  }

  getErrorMessage(field: string) {
    if (this.subjectForm.get(field)?.errors?.['required']) {
      return 'Debes llenar el campo';
    } else if (this.subjectForm.get(field)?.errors?.['maxlength']) {
      return 'El campo ' + this.fieldFeatures[field][0] + ' debe tener menos de '
        + this.fieldFeatures[field][2] + ' caracteres';
    } else if (this.subjectForm.get(field)?.errors?.['max']) {
      return 'El numero de participantes de los grupos no puede ser mayor de ' + this.fieldFeatures[field][2];
    } else if (this.subjectForm.get(field)?.errors?.['min']) {
      return 'El numero de participantes de los grupos no puede ser menor de ' + this.fieldFeatures[field][1];
    }
    return this.subjectForm.get(field)?.errors?.['minlength'] ?
      'El campo ' + this.fieldFeatures[field][0] + ' debe tener mas de '
      + this.fieldFeatures[field][1] + ' caracteres' : '';
  }

  onCreate() {
    this.processing = true;
    this.createNewCode().then(code => {
      let subject: SubjectTeacher = new SubjectTeacher(
        code,
        this.subjectForm.get('description')?.value,
        this.userSvc.getUserLoggedRef(),
        this.subjectForm.get('name')?.value,
        this.subjectForm.get('numGroup')?.value
      )
      this.subjectSvc.addSubject(subject).then(doc => {
        if (doc.id) {
          this.successOperation.emit(new ObjectDB(this.subjectForm.get('name')?.value, doc.id));
        } else {
          this.subjectForm.reset();
          this.processing = false;
        }
      },
        () => {
          this.processing = false;
        })
    },
      () => {
        this.processing = false;
      })
  }

  onUpdate() {
    let subject: SubjectTeacher = new SubjectTeacher(
      "",
      this.subjectForm.get('description')?.value,
      this.userSvc.getUserLoggedRef(),
      this.subjectForm.get('name')?.value,
      this.subjectForm.get('numGroup')?.value
    )
    this.subjectSvc.updateSubject(subject, this.subjectId).then(() => {
      this.successOperation.emit(new ObjectDB(this.subjectForm.get('name')?.value, this.subjectId));
      this.processing = false;
    })
  }

  private async createNewCode() {
    let validCode = false;
    let newCode!: string;
    while (!validCode) {
      newCode = this.createCode()
      validCode = await this.subjectSvc.verifyCode(newCode)
    }
    return newCode;
  }

  private createCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
  }
}
