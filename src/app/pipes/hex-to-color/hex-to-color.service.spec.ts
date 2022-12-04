import { HexToColorPipe } from './hex-to-color.pipe';


describe('HexToColorPipe', () => {
  it('create an instance', () => {
    const pipe = new HexToColorPipe();
    expect(pipe).toBeTruthy();
  });
});
