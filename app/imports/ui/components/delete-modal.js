import { Template } from 'meteor/templating';

import './delete-modal.html';

Template.Delete_modal.onCreated(function () {
  this.onDelete = () => this.data.onDelete;
});

Template.Delete_modal.events({
  'click #confirmDelete': (event) => {
    event.preventDefault();

    // this timeout lets backdrop disappear
    setTimeout(() => this.onDelete(), 500);
  },
});
