import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appPopUp]'
})
export class PopUpDirective {
  @Output('onClickOutside') onClickOutside = new EventEmitter<MouseEvent>();

  constructor(private eref: ElementRef) { }

  @HostListener('document:click', ['$event', '$event.target'])
  onDocumentClicked(event: MouseEvent, targetElement: HTMLElement) {
    if (targetElement && document.body.contains(targetElement) && !this.eref.nativeElement.contains(targetElement)) {
      this.onClickOutside.emit(event);
    }
  }
 
}
