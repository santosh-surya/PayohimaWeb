import {Component, Input, ViewChild, ChangeDetectorRef} from "@angular/core";

@Component({
  selector: "upload-button",
  templateUrl: "upload-button.html"

})

/**
 * Upload button component.
 *
 * As native input elements with type file are diffcult to style, it is common
 * practice to hide them and trigger the needed events manually as it done here.
 * A button is is used for user interaction, next to the hidden input.
 */
export class UploadButtonComponent {
  @Input() placeHolder: String;
  @Input() iconName: String;
  @Input() change: Function;
  @Input() iconPosition: String;
  @Input() multiple: Boolean = false;
  @Input() full: String;
  @Input() round: String;
  @Input() block: String;
  @Input() small: String;
  @Input() large: String;
  @Input() uploading: boolean = false;
  @Input('icon-left') iconLeft: String;
  @Input('icon-right') iconRight: String;
  @ViewChild("inputfileuploadbutton") nativeInputBtn: any;
  filename: string;

  constructor(private cd: ChangeDetectorRef) {
    
  }

  /**
   * Callback executed when the visible button is pressed
   * @param  {Event}  event should be a mouse click event
   */
  public callback(event: Event): void {
    console.log("upload-button callback executed");
    // trigger click event of hidden input
    this.nativeInputBtn.nativeElement.click();
  }
  ngOnInit(){
    // if (icon)
    // console.log(this);
  }

  /**
   * Callback which is executed after files from native popup are selected.
   * @param  {Event}    event change event containing selected files
   */
  public filesAdded(event: Event): void {
    let files: FileList = this.nativeInputBtn.nativeElement.files
    if (files.length>0){
      this.filename = files[0].name;
      this.cd.detectChanges();
    }
    this.cd.detectChanges();
    let self = this;
    this.change(files)
      .then((image)=>{
        self.cd.detectChanges();
      }).catch((error)=>{
        self.cd.detectChanges();
      });
  }
}