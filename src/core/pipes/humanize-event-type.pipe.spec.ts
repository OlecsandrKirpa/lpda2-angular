import { HumanizeEventTypePipe } from './humanize-event-type.pipe';

describe('HumanizeEventTypePipe', () => {
  it('create an instance', () => {
    const pipe = new HumanizeEventTypePipe();
    expect(pipe).toBeTruthy();
  });
});
