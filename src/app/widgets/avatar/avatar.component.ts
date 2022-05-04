import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() text = '';
  @Input() bgColor = '#000066'
  @Input() size: 'sm' | 'md' | 'lg'  = 'md'

  constructor() { }

  ngOnInit(): void {
  }

}
