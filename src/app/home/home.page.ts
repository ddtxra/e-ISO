import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireDatabase } from 'angularfire2/database';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public survey: any = {"fever": "Oui"};

  constructor(private camera: Camera, private db: AngularFireDatabase, public navCtrl: NavController) { }
  private surveyResponsesRef = this.db.list<any>('survey-responses');

  private convertObjectValuesRecursive(obj, target, replacement) {
    obj = {...obj};
    Object.keys(obj).forEach((key) => {
      if (obj[key] == target) {
        obj[key] = replacement;
      } else if (typeof obj[key] == 'object' && !Array.isArray(obj[key])) {
        obj[key] = this.convertObjectValuesRecursive(obj[key], target, replacement);
      }
    });
    return obj;
  }

  public uploadPicture(event) {

    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
      });

  }
  public sendResponses(event){

    let surveyNoUndefined: Object = this.convertObjectValuesRecursive(this.survey, null, '');
    surveyNoUndefined["date"] = new Date().toISOString();

    this.surveyResponsesRef.push(surveyNoUndefined)
      .then( () => this.navCtrl.navigateRoot('/thanks'))
      .catch(err => alert('Something wrong happened: ' + err));
     
  }
}
