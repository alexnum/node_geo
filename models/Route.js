/**
 * Created by GAEL on 16/03/2017.
 */

var mongoose = require('mongoose');

var routeSchema = mongoose.Schema({
  cords: {
    type: { type: String }
    , coordinates: []
  },
  name: String
});
routeSchema.index({ cords: '2dsphere' });

mongoose.model('Route', routeSchema);