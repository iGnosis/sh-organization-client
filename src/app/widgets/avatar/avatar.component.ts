import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() text = '';
  @Input() bgColor: string | 'auto' = '#000066'
  @Input() bgAuto = false;
  @Input() size: 'sm' | 'md' | 'lg'  = 'md'

  bgChoices = ['#000066', '#39B54A', '#FFB000', '#EB0000']

  constructor() { 
  }

  ngOnInit(): void {
    if(this.bgAuto) {
      let sum = 0
      for (let i = 0; i < this.text.length; i++) {
        sum += this.text.charCodeAt(i)
      }
      this.bgColor = this.bgChoices[sum % this.bgChoices.length]
    }
  }

}
