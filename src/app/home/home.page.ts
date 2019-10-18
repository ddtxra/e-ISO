import { Image } from './../../model/image';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireDatabase } from 'angularfire2/database';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public survey: any = {"fever": "Oui"};
  url: any;
  public langue = "fr";

  newImage: Image = {
    id: this.afs.createId(), image: ''
  }
  loading: boolean = false;;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage, private camera: Camera, private db: AngularFireDatabase, public navCtrl: NavController) { }
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

  public onChange(value) {
    if(value == "en") {
      alert("Sorry, this is a prototype we need $ to take it to production :) ")
    }else if(value == "it") {
      alert("Siamo spiacenti, questo è un prototipo di cui abbiamo bisogno $ per portarlo in produzione :) ")
    }else if(value == "de") {
      alert("Entschuldigung, dies ist ein Prototyp, den wir brauchen, um ihn in Produktion zu bringen :) ")
    }else if(value == "fr") {
      alert("Vous êtes chanceux c'est votre langue, mais nous avons tout de même besoin de $ pour pousser ce prototype en production :) ")
    }
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

  //https://blog.smartcodehub.com/how-to-upload-an-image-to-firebase-from-an-ionic-4-app/
   uploadImage(event) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
     
      reader.readAsDataURL(event.target.files[0]);
      // For Preview Of Image
      reader.onload = (e:any) => { // called once readAsDataURL is completed
        this.url = e.target.result;
      
        // For Uploading Image To Firebase
        const fileraw = event.target.files[0];
        console.log(fileraw)
        const filePath = '/Image/' + this.newImage.id + '/' + 'Image' + (Math.floor(1000 + Math.random() * 9000) + 1);
        const result = this.SaveImageRef(filePath, fileraw);
        const ref = result.ref;
        result.task.then(a => {
          ref.getDownloadURL().subscribe(a => {
            console.log(a);
            this.newImage.image = a;
            this.loading = false;
          });

          this.afs.collection('Image').doc(this.newImage.id).set(this.newImage);
        });
      }, error => {
        alert("Error");
        
      }

    }
  }

  SaveImageRef(filePath, file) {
    return {
      task: this.storage.upload(filePath, file)
      , ref: this.storage.ref(filePath)
    };
  }
}
