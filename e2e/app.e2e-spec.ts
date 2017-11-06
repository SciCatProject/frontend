import { CataniePage } from './app.po';

describe('catanie App', function() {
  let page: CataniePage;

  beforeEach(() => {
    page = new CataniePage();
    page.navigateTo();
  });

  it('should contain app name', () => {
    expect(page.getParagraphText('app-root')).toContain('SciCat');
  });
});
