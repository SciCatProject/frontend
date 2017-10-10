import { CataniePage } from './app.po';

describe('catanie App', function() {
  let page: CataniePage;

  beforeEach(() => {
    page = new CataniePage();
  });

  it('should contain app name', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('CATANIE');
  });
});
