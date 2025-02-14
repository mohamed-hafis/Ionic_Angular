import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';

registerSwiperElements();
bootstrapApplication(AppComponent).catch((err) =>
    console.error(err)
);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
