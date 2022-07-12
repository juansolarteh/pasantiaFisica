import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectTeacher } from 'src/app/models/SubjectTeacher';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-add-update-subject',
  templateUrl: './add-update-subject.component.html',
  styleUrls: ['./add-update-subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUpdateSubjectComponent implements OnInit {

  @Input() subjectId!: string;

  subjectForm!: FormGroup
  startSubmit!:boolean;

  fieldFeatures: any = {
    name: ['nombre', 5, 60],
    description: ['descripcion', null, 400],
    numGroup: ['numGrupos', 1, 4],
  }

  constructor(private readonly fb: FormBuilder, private subjectSvc: SubjectService) { }

  ngOnInit(): void {
    this.startSubmit = false;
    this.subjectForm = this.initForm()
    if (this.subjectId) {
      this.subjectSvc.getSubjectById(this.subjectId).then((resp: SubjectTeacher) => this.setValues(resp));
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
    }else if(this.subjectForm.get(field)?.errors?.['min']){
      return 'El numero de participantes de los grupos no puede ser menor de ' + this.fieldFeatures[field][1];
    }
    return this.subjectForm.get(field)?.errors?.['minlength'] ?
      'El campo ' + this.fieldFeatures[field][0] + ' debe tener mas de '
      + this.fieldFeatures[field][1] + ' caracteres' : '';
  }

  onSubmit(){
  }
}
