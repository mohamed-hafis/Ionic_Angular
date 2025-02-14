import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class SliderComponent   {

  title = 'swiper-elements';

}
