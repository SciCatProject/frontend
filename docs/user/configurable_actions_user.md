---
title: Configurable Actions
audience: Users
created_by: Max Novelli
created_on: 2024/07/29
---

# What Are Configurable Actions?

For non-technical users at ESS, **configurable actions** are custom buttons or menu options that appear in multiple locations in the web interface. They are available on the datafiles tab and on the datasets list; availability on other pages depends on the site configuration.

These actions make it easy to perform specific tasks with just a click. Examples include:

- **Download All Files:** Download every file in a dataset in one go.
- **Download Selected Files:** Download only the files you have selected from a dataset.
- **Download Jupyter Notebook:** Get a ready-made Jupyter notebook that’s already filled in with information about your selected dataset.
- **Publish or Unpublish a Dataset:** Change whether a dataset is visible to others or kept private.
- **Add to Selection:** Add the currently selected datasets to your selection/cart from the datasets list.
- **Quick Links:** Jump directly to important resources, like the ESS homepage.

Each action is set up behind the scenes by the IT team through the FE configuration during deployment. The system automatically fills in any technical details for you (like dataset IDs or file locations), so you don’t have to worry about them.

## Actions on the datasets list

Configured datasets-list actions appear above the datasets table. Select one or more rows to make selection-dependent actions available. The standard **Add to Selection** action is disabled when no rows are selected. Using it adds the selected datasets to the existing selection/cart and clears the table-row selection; it does not remove datasets already in the selection/cart.

The actions shown on your site may differ from this description because administrators can enable, disable, replace, and reorder them.

**In summary:**  
Configurable actions help you get your work done faster and more easily, without needing to worry about technical steps or complicated processes.