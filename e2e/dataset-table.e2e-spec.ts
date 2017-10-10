import { DatasetsPage } from './dataset-table.po';



describe('catanie App', function() {
  let page: DatasetsPage;

  beforeEach(() => {
    page = new DatasetsPage();
  });

  it('should contain app name', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('CATANIE');
  });



});
