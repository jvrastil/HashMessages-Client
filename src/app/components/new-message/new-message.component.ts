import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ErrorStateMatcher, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Tag } from '../../models/tag';
import { TagService } from '../../services/tag.service/tag.service';
import { MessageService } from '../../services/message.service/message.service';
import { Message } from '../../models/message';
import * as CryptoJS from 'crypto-js';

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
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  suggestedTags$: Observable<Tag[]>;
  newMessageTags: Tag[] = [];
  encrypted = false;
  encryptionKey = '';

  formGroup: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private tagService: TagService,
    private msgService: MessageService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) {
    this.suggestedTags$ = this.tagService.getTags();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
      tags: new FormControl([], this.validateArrayNotEmpty),
      encryptionKey: new FormControl(''),
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
        this.tagService
          .addNewTag(new Tag(value.trim()))
          .then(newTag => {
            this.newMessageTags.push(newTag);
            this.formGroup.controls.tags.setValue([...this.newMessageTags.map(tag => tag.uuid)]);
          })
          .catch(err => console.log('Unable to get new tag', err));
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
  }

  postNewMessage() {
    const newMsg: Message = {
      title: this.formGroup.controls.title.value,
      message: this.formGroup.controls.body.value,
      tags: this.formGroup.controls.tags.value,
      encrypted: this.encrypted,
    };

    if (this.encrypted && this.formGroup.controls.encryptionKey) {
      // get hash of the title -> will be used lated for verification
      const encryptionKey = this.formGroup.controls.encryptionKey.value;
      const hashedTitle = this.msgService.getHashedTitle(newMsg.title, encryptionKey);

      newMsg.message = this.msgService.encrypt(newMsg.message, hashedTitle, encryptionKey);
      newMsg.hashedTitle = hashedTitle;
    }
    this.msgService.postNewMessage(newMsg);
  }

  toggleEncryption() {
    this.encrypted = !this.encrypted;
    this.cdRef.detectChanges();
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
        validateArrayNotEmpty: { valid: false },
      };
    }
    return null;
  }
}
