import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ErrorStateMatcher, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Tag } from '../../models/tag';
import { TagService } from '../../services/tag.service/tag.service';
import { MessageService } from '../../services/message.service/message.service';
import { Message } from '../../models/message';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent implements OnInit {

  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;
  suggestedTags$: Observable<Tag[]>;
  newMessageTags: Tag[] = [];
  message = new Message();

  formGroup: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private tagService: TagService,
    private msgService: MessageService,
    private fb: FormBuilder,
  ) {
    this.suggestedTags$ = this.tagService.getTags();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
      tags: new FormControl([], this.validateArrayNotEmpty)
    });
  }

  add(event: MatChipInputEvent): void {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our tag
      if ((value || '').trim()) {
        this.tagService.addNewTag(new Tag(value.trim())).then(newTag => {
          this.newMessageTags.push(newTag);
          this.formGroup.controls.tags.setValue([...this.newMessageTags.map(tag => tag.uuid)]);
        });
      }

      // Reset the input value
      if (input) {
        input.value = '';
        // this.formGroup.controls.tags.setValue([]);
      }
    }
  }

  postNewMessage() {
    const newMsg: Message = {
      title: this.formGroup.controls.title.value,
      message: this.formGroup.controls.body.value,
      tags: this.formGroup.controls.tags.value,
    };
    this.msgService.postNewMessage(newMsg);
  }

  remove(uuid: string): void {
    const index = this.newMessageTags.findIndex(tag => tag.uuid === uuid);

    if (index >= 0) {
      this.newMessageTags.splice(index, 1);
      this.formGroup.controls.tags.setValue([...this.newMessageTags]);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.newMessageTags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.formGroup.controls.tags.setValue([...this.newMessageTags.map(tag => tag.uuid)]);
  }

  private validateArrayNotEmpty(formControl: FormControl) {
    if (formControl.value && formControl.value.length === 0) {
      return {
        validateArrayNotEmpty: {valid: false},
      };
    }
    return null;
  }
}
